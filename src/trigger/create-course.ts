import { db } from '@/db';
import * as schema from '@/db/schema';
import {
  type InsertCourse,
  InsertCourseSchema,
  type InsertSection,
  InsertSectionSchema,
  type InsertTask,
  InsertTaskSchema,
  type InsertUnit,
  InsertUnitSchema,
} from '@/db/schema';
import { CHUNK_SIZE } from '@/lib/constants';
import {
  getEnrichChunkPrompt,
  getGenerateCourseSyllabusPrompt,
  getGenerateLessonPrompt,
  getSummarizeChunkPrompt,
  getSummarizeDocumentPrompt,
} from '@/lib/prompts';
import { SyllabusSchema } from '@/lib/schemas';
import { formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import Firecrawl from '@mendable/firecrawl-js';
import { batch, logger, schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { embed, embedMany, generateObject, generateText } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const FirecrawlClient = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const CreateCourseTaskSchema = z.object({
  url: z.string().url(),
  userId: z.string().uuid(),
});

function getContentSize(sourceContentLength: number) {
  return sourceContentLength > CHUNK_SIZE * 50
    ? 'large'
    : sourceContentLength > CHUNK_SIZE * 10
      ? 'medium'
      : 'small';
}

export const CreateCourseTask = schemaTask({
  id: 'create-course',
  schema: CreateCourseTaskSchema,
  run: async (payload) => {
    const parseSourceRun = await tasks.triggerAndWait<typeof ParseSourceTask>(
      'parse-source',
      {
        url: payload.url,
      },
    );

    if (!parseSourceRun.ok) {
      throw new Error('Failed to parse source');
    }

    const sourceContent = parseSourceRun.output;

    const chunkenizeSourceContentRun = await tasks.triggerAndWait<
      typeof ChunkenizeSourceContentTask
    >('chunkenize-source-content', {
      content: sourceContent,
    });

    if (!chunkenizeSourceContentRun.ok) {
      throw new Error('Failed to chunk content');
    }

    const chunks = chunkenizeSourceContentRun.output;

    let summarizedChunks: {
      order: number;
      summary: string;
      rawContent: string;
    }[] = [];

    const { runs } = await batch.triggerByTaskAndWait(
      chunks.map((chunk, index) => ({
        task: SummarizeChunkContentTask,
        payload: { rawContent: chunk, order: index },
      })),
    );

    for (const run of runs) {
      if (run.ok) {
        summarizedChunks.push({
          order: run.output.order,
          summary: run.output.summary,
          rawContent: chunks[run.output.order],
        });
      }
    }

    const summarizeSourceTask = await tasks.triggerAndWait<
      typeof SummarizeSourceContentTask
    >('summarize-source-content', {
      chunkSummaries: summarizedChunks.map((chunk) => chunk.summary),
    });

    if (!summarizeSourceTask.ok) {
      throw new Error('Failed to summarize source');
    }

    let sourceSummary = summarizeSourceTask.output.summary;

    const enrichedChunks: {
      order: number;
      enrichedContent: string;
      enrichedSummary: string;
      rawContent: string;
    }[] = [];

    const { runs: enrichChunksRuns } = await batch.triggerByTaskAndWait(
      summarizedChunks.map((chunk) => ({
        task: EnrichChunkTask,
        payload: {
          order: chunk.order,
          rawContent: chunk.rawContent,
          sourceSummary: sourceSummary,
          precedingChunkContent:
            summarizedChunks.find((c) => c.order === chunk.order - 1)
              ?.rawContent ?? null,
          succeedingChunkContent:
            summarizedChunks.find((c) => c.order === chunk.order + 1)
              ?.rawContent ?? null,
        },
      })),
    );

    for (const run of enrichChunksRuns) {
      if (run.ok) {
        enrichedChunks.push({
          order: run.output.order,
          enrichedContent: run.output.enrichedContent,
          enrichedSummary: run.output.enrichedSummary,
          rawContent: summarizedChunks[run.output.order].rawContent,
        });
      }
    }

    summarizedChunks = [];

    const enrichedSourceSummary = await tasks.triggerAndWait<
      typeof SummarizeSourceContentTask
    >('summarize-source-content', {
      chunkSummaries: enrichedChunks.map((chunk) => chunk.enrichedSummary),
    });

    if (!enrichedSourceSummary.ok) {
      throw new Error('Failed to enrich source summary');
    }

    sourceSummary = enrichedSourceSummary.output.summary;

    const storeSourceRun = await tasks.triggerAndWait<typeof StoreSourceTask>(
      'store-source',
      {
        url: payload.url,
        userId: payload.userId,
        sourceSummary,
        chunksCount: enrichedChunks.length,
      },
    );

    if (!storeSourceRun.ok) {
      throw new Error('Failed to store source');
    }

    const sourceId = storeSourceRun.output;

    const storeChunksRun = await tasks.triggerAndWait<typeof StoreChunksTask>(
      'store-chunks',
      {
        sourceId,
        chunks: enrichedChunks.map((chunk) => ({
          order: chunk.order,
          rawContent: chunk.rawContent,
          summary: chunk.enrichedSummary,
          enrichedContent: chunk.enrichedContent,
        })),
      },
    );

    if (!storeChunksRun.ok) {
      throw new Error('Failed to store chunks');
    }

    const contentSize = getContentSize(sourceContent.length);

    const syllabusResult = await tasks.triggerAndWait<
      typeof GenerateCourseSyllabusTask
    >('generate-course-syllabus', {
      documentSummary: sourceSummary,
      documentChunksSummaries: enrichedChunks.map(
        (chunk) => chunk.enrichedSummary,
      ),
      contentSize,
    });

    if (!syllabusResult.ok) {
      throw new Error('Failed to generate course syllabus');
    }

    const syllabus = syllabusResult.output;

    const syllabusEmbeddingsResult = await tasks.triggerAndWait<
      typeof GenerateSyllabusEmbeddingsTask
    >('generate-syllabus-embeddings', {
      syllabus,
    });

    if (!syllabusEmbeddingsResult.ok) {
      throw new Error('Failed to generate course syllabus embeddings');
    }

    const {
      courseEmbedding,
      unitEmbeddings,
      sectionEmbeddings,
      lessonEmbeddings,
    } = syllabusEmbeddingsResult.output;

    const course: InsertCourse & { id: string } = {
      id: uuidv4(),
      title: syllabus.title,
      description: syllabus.description,
      creatorId: payload.userId,
      embedding: courseEmbedding,
    };
    const units: (InsertUnit & { id: string })[] = syllabus.units.map(
      (unit) => ({
        id: uuidv4(),
        ...unit,
        courseId: course.id,
        order: unit.order,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        embedding: unitEmbeddings.find((u) => u.unitOrder === unit.order)!
          .embedding,
      }),
    );

    const sections: (InsertSection & { id: string })[] = syllabus.units.flatMap(
      (unit) =>
        unit.sections.map((section) => ({
          id: uuidv4(),
          ...section,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          unitId: units.find((u) => u.order === unit.order)!.id,
          order: section.order,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          embedding: sectionEmbeddings.find(
            (u) =>
              u.sectionOrder === section.order && u.unitOrder === unit.order,
          )!.embedding,
        })),
    );

    const getSectionId = (unitOrder: number, sectionOrder: number) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      sections.find(
        (s) =>
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          s.unitId === units.find((u) => u.order === unitOrder)!.id &&
          s.order === sectionOrder,
      )!.id;

    const getUnitId = (unitOrder: number) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      units.find((u) => u.order === unitOrder)!.id;

    const getEmbedding = (
      unitOrder: number,
      sectionOrder: number,
      lessonOrder: number,
    ) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      lessonEmbeddings.find(
        (l) =>
          l.lessonOrder === lessonOrder &&
          l.sectionOrder === sectionOrder &&
          l.unitOrder === unitOrder,
      )!.embedding;

    const lessons: (InsertTask & {
      id: string;
      type: 'LESSON';
      unitId: string;
      courseId: string;
      unitOrder: number;
      sectionOrder: number;
    })[] = syllabus.units.flatMap((unit) =>
      unit.sections.flatMap((section) =>
        section.lessons.map((lesson) => ({
          id: uuidv4(),
          ...lesson,
          sectionId: getSectionId(unit.order, section.order),
          order: lesson.order,
          type: 'LESSON',
          stepsCount: 0,
          embedding: getEmbedding(unit.order, section.order, lesson.order),
          unitId: getUnitId(unit.order),
          courseId: course.id,
          unitOrder: unit.order,
          sectionOrder: section.order,
        })),
      ),
    );

    await tasks.triggerAndWait<typeof StoreSyllabusTask>('store-syllabus', {
      course,
      units,
      sections,
      lessons,
      sourceId,
    });

    const firstUnitFirstSectionLessons = lessons.filter(
      (lesson) => lesson.unitOrder === 1 && lesson.sectionOrder === 1,
    );

    await batch.triggerByTaskAndWait(
      firstUnitFirstSectionLessons.map((lesson) => ({
        task: GenerateLessonStepsTask,
        payload: {
          lesson: {
            ...lesson,
            // We are retrieving the embedding from the database, so we don't need to pass it to the task
            // This is to avoid the task payload from becoming too large
            embedding: undefined,
          },
          syllabus,
          sourceId,
          unitOrder: lesson.unitOrder,
          sectionOrder: lesson.sectionOrder,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          unitTitle: units.find((u) => u.order === lesson.unitOrder)!.title,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          sectionTitle: sections.find((s) => s.order === lesson.sectionOrder)!
            .title,
        },
      })),
    );
  },
});

export const ParseSourceTask = schemaTask({
  id: 'parse-source',
  schema: z.object({
    url: z.string().url(),
  }),
  run: async (payload) => {
    const scrapeResult = await FirecrawlClient.scrapeUrl(payload.url, {
      formats: ['markdown'],
      timeout: 100000,
    });

    if (!scrapeResult.success) {
      logger.error(`Error scraping ${payload.url}`, {
        scrapeResult,
      });
      throw new Error('Failed to scrape source');
    }

    if (!scrapeResult.markdown) {
      logger.error(`No markdown content found for ${payload.url}`, {
        scrapeResult,
      });
      throw new Error('No markdown content found');
    }

    logger.info(`Scraped ${payload.url}`, {
      scrapeResult,
    });

    return scrapeResult.markdown;
  },
});

export const ChunkenizeSourceContentTask = schemaTask({
  id: 'chunkenize-source-content',
  schema: z.object({
    content: z.string(),
  }),
  run: async (payload) => {
    const chunks: string[] = [];

    const recursiveChunk = (text: string) => {
      // Base case - text is small enough to be a chunk
      if (text.length <= CHUNK_SIZE) {
        chunks.push(text);
        return;
      }

      // Find the best split point near the middle
      const splitIndex = Math.floor(text.length / 2);
      let leftEnd = text.lastIndexOf('\n', splitIndex);
      let rightStart = text.indexOf('\n', splitIndex);

      // If no newlines found, fall back to splitting on spaces
      if (leftEnd === -1 && rightStart === -1) {
        leftEnd = text.lastIndexOf(' ', splitIndex);
        rightStart = text.indexOf(' ', splitIndex);
      }

      // If still no good split points, just split in the middle
      if (leftEnd === -1) leftEnd = splitIndex;
      if (rightStart === -1) rightStart = splitIndex;

      // Choose the split point closest to the middle
      const splitPoint =
        Math.abs(splitIndex - leftEnd) < Math.abs(splitIndex - rightStart)
          ? leftEnd
          : rightStart;

      // Recursively process each half
      recursiveChunk(text.slice(0, splitPoint).trim());
      recursiveChunk(text.slice(splitPoint).trim());
    };

    recursiveChunk(payload.content);

    return chunks;
  },
});

export const SummarizeChunkContentTask = schemaTask({
  id: 'summarize-chunk-content',
  schema: z.object({
    rawContent: z.string(),
    order: z.number(),
  }),
  run: async (payload) => {
    const summary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeChunkPrompt({ chunk: payload.rawContent }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'summarize-chunk-content',
      },
    });

    return {
      order: payload.order,
      summary: summary.text,
    };
  },
});

export const SummarizeSourceContentTask = schemaTask({
  id: 'summarize-source-content',
  schema: z.object({
    chunkSummaries: z.array(z.string()),
  }),
  run: async (payload) => {
    const documentSummary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeDocumentPrompt({
        content: payload.chunkSummaries.join('\n'),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'summarize-source-content',
      },
    });

    return {
      summary: documentSummary.text,
    };
  },
});

export const EnrichChunkContentTask = schemaTask({
  id: 'enrich-chunk-content',
  schema: z.object({
    rawContent: z.string(),
    sourceSummary: z.string(),
    precedingChunkContent: z.string().nullable(),
    succeedingChunkContent: z.string().nullable(),
  }),
  run: async (payload) => {
    const enrichedContent = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getEnrichChunkPrompt({
        chunk: payload.rawContent,
        sourceSummary: payload.sourceSummary,
        precedingChunkContent: payload.precedingChunkContent,
        succeedingChunkContent: payload.succeedingChunkContent,
        chunkSize: CHUNK_SIZE,
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'enrich-chunk-content',
      },
    });

    return {
      enrichedContent: enrichedContent.text,
    };
  },
});

export const EnrichChunkTask = schemaTask({
  id: 'enrich-chunk',
  schema: z.object({
    order: z.number(),
    rawContent: z.string(),
    sourceSummary: z.string(),
    precedingChunkContent: z.string().nullable(),
    succeedingChunkContent: z.string().nullable(),
  }),
  run: async (payload) => {
    const enrichedChunkContent = await tasks.triggerAndWait<
      typeof EnrichChunkContentTask
    >('enrich-chunk-content', {
      rawContent: payload.rawContent,
      sourceSummary: payload.sourceSummary,
      precedingChunkContent: payload.precedingChunkContent,
      succeedingChunkContent: payload.succeedingChunkContent,
    });

    if (!enrichedChunkContent.ok) {
      throw new Error('Failed to enrich chunk!');
    }

    const enrichedSummary = await tasks.triggerAndWait<
      typeof SummarizeChunkContentTask
    >('summarize-chunk-content', {
      order: payload.order,
      rawContent: enrichedChunkContent.output.enrichedContent,
    });

    if (!enrichedSummary.ok) {
      throw new Error('Failed to summarize chunk!');
    }

    return {
      order: payload.order,
      enrichedContent: enrichedChunkContent.output.enrichedContent,
      enrichedSummary: enrichedSummary.output.summary,
    };
  },
});

export const StoreSourceTask = schemaTask({
  id: 'store-source',
  schema: z.object({
    url: z.string(),
    userId: z.string(),
    sourceSummary: z.string(),
    chunksCount: z.number(),
  }),

  run: async (payload) => {
    const sourceEmbedding = await embed({
      model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
      value: payload.sourceSummary,
    });

    const [source] = await db
      .insert(schema.source)
      .values({
        type: 'URL',
        filePath: payload.url,
        creatorId: payload.userId,
        summary: payload.sourceSummary,
        embedding: sourceEmbedding.embedding,
        chunksCount: payload.chunksCount,
      })
      .returning({ id: schema.source.id });

    return source.id;
  },
});

export const StoreChunksTask = schemaTask({
  id: 'store-chunks',
  schema: z.object({
    sourceId: z.string(),
    chunks: z.array(
      z.object({
        order: z.number(),
        rawContent: z.string(),
        summary: z.string(),
        enrichedContent: z.string(),
      }),
    ),
  }),
  run: async (payload) => {
    const embeddingsResult = await embedMany({
      model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
      values: payload.chunks.map((chunk) => chunk.enrichedContent),
    });

    await db.insert(schema.chunk).values(
      payload.chunks.map((chunk, index) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        enrichedContent: chunk.enrichedContent,
        summary: chunk.summary,
        embedding: embeddingsResult.embeddings[index],
        sourceId: payload.sourceId,
      })),
    );
  },
});

export const GenerateCourseSyllabusTask = schemaTask({
  id: 'generate-course-syllabus',
  schema: z.object({
    documentSummary: z.string(),
    documentChunksSummaries: z.array(z.string()),
    contentSize: z.enum(['small', 'medium', 'large']),
  }),
  run: async (payload) => {
    const syllabusResult = await generateObject({
      model: openai('o3-mini'),
      prompt: getGenerateCourseSyllabusPrompt({
        documentSummary: payload.documentSummary,
        documentChunksSummariesJoined:
          payload.documentChunksSummaries.join('\n'),
        contentSize: payload.contentSize,
      }),
      schema: SyllabusSchema,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'generate-course-syllabus',
      },
    });

    return syllabusResult.object;
  },
  retry: {
    maxAttempts: 3,
  },
});

export const GenerateSyllabusEmbeddingsTask = schemaTask({
  id: 'generate-syllabus-embeddings',
  schema: z.object({
    syllabus: SyllabusSchema,
  }),
  run: async (payload) => {
    const units = payload.syllabus.units.map((unit) => ({
      title: unit.title,
      description: unit.description,
      unitOrder: unit.order,
    }));

    const sections = payload.syllabus.units.flatMap((unit) =>
      unit.sections.map((section) => ({
        title: section.title,
        description: section.description,
        sectionOrder: section.order,
        unitOrder: unit.order,
      })),
    );

    const lessons = payload.syllabus.units.flatMap((unit) =>
      unit.sections.flatMap((section) =>
        section.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          lessonOrder: lesson.order,
          sectionOrder: section.order,
          unitOrder: unit.order,
        })),
      ),
    );

    const courseEmbeddingResult = await embedMany({
      model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
      values: [
        `${payload.syllabus.title} ${payload.syllabus.description}`,
        ...units.map((unit) => `${unit.title} ${unit.description}`),
        ...sections.map((section) => `${section.title} ${section.description}`),
        ...lessons.map((lesson) => `${lesson.title} ${lesson.description}`),
      ],
    });

    return {
      courseEmbedding: courseEmbeddingResult.embeddings[0],
      unitEmbeddings: units.map((unit, index) => ({
        embedding: courseEmbeddingResult.embeddings[1 + index],
        unitOrder: unit.unitOrder,
      })),
      sectionEmbeddings: sections.map((section, index) => ({
        embedding: courseEmbeddingResult.embeddings[1 + units.length + index],
        sectionOrder: section.sectionOrder,
        unitOrder: section.unitOrder,
      })),
      lessonEmbeddings: lessons.map((lesson, index) => ({
        embedding:
          courseEmbeddingResult.embeddings[
            1 + units.length + sections.length + index
          ],
        lessonOrder: lesson.lessonOrder,
        sectionOrder: lesson.sectionOrder,
        unitOrder: lesson.unitOrder,
      })),
    };
  },
});

export const StoreSyllabusTask = schemaTask({
  id: 'store-syllabus',
  schema: z.object({
    course: InsertCourseSchema,
    units: z.array(InsertUnitSchema),
    sections: z.array(InsertSectionSchema),
    lessons: z.array(InsertTaskSchema),
    sourceId: z.string(),
  }),
  run: async (payload) => {
    await db.insert(schema.course).values(payload.course);
    await db.insert(schema.unit).values(payload.units);
    await db.insert(schema.section).values(payload.sections);
    await db.insert(schema.task).values(payload.lessons);
    await db
      .update(schema.source)
      .set({
        courseId: payload.course.id,
      })
      .where(eq(schema.source.id, payload.sourceId));
  },
});

export const GenerateLessonStepsTask = schemaTask({
  id: 'generate-lesson-steps',
  schema: z.object({
    lesson: InsertTaskSchema.omit({ embedding: true }),
    syllabus: SyllabusSchema,
    sourceId: z.string(),
    unitOrder: z.number(),
    sectionOrder: z.number(),
    unitTitle: z.string(),
    sectionTitle: z.string(),
  }),
  run: async ({
    lesson,
    syllabus,
    sourceId,
    unitOrder,
    sectionOrder,
    unitTitle,
    sectionTitle,
  }) => {
    const [lessonEmbedding] = await db
      .select({ embedding: schema.task.embedding })
      .from(schema.task)
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      .where(eq(schema.task.id, lesson.id!));

    const similarity = sql<number>`1 - (${cosineDistance(
      schema.chunk.embedding,
      lessonEmbedding.embedding,
    )})`;

    const chunks = await db
      .select()
      .from(schema.chunk)
      .where(and(eq(schema.chunk.sourceId, sourceId), gte(similarity, 0.5)))
      .orderBy(desc(similarity))
      .limit(5);

    const stepsResult = await generateObject({
      model: openai('o3-mini'),
      prompt: getGenerateLessonPrompt({
        lesson: {
          ...lesson,
          title: `${unitOrder}.${sectionOrder}.${lesson.order}. ${lesson.title}`,
        },
        chunks: chunks.map((chunk) => chunk.enrichedContent),
        syllabus: formatSyllabus(syllabus),
        unitTitle: `${unitOrder}. ${unitTitle}`,
        sectionTitle: `${unitOrder}.${sectionOrder}. ${sectionTitle}`,
      }),
      schema: z.object({
        steps: z.array(schema.StepContentSchema),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'generate-lesson-steps',
      },
    });

    const steps = stepsResult.object.steps;

    await db
      .update(schema.task)
      .set({
        stepsCount: steps.length,
      })
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      .where(eq(schema.task.id, lesson.id!));

    await db.insert(schema.step).values(
      steps.map((step, stepIndex) => ({
        order: stepIndex,
        content: step,
        type: step.type,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        taskId: lesson.id!,
      })),
    );
  },
});

export async function getSyllabus(courseId: string) {
  const course = await db.query.course.findFirst({
    columns: {
      title: true,
      description: true,
    },
    where: (course, { eq }) => eq(course.id, courseId),
    with: {
      units: {
        columns: {
          order: true,
          title: true,
          description: true,
        },
        with: {
          sections: {
            columns: {
              order: true,
              title: true,
              description: true,
            },
            with: {
              tasks: {
                where: (task, { eq }) => eq(task.type, 'LESSON'),
                columns: {
                  id: true,
                  order: true,
                  title: true,
                  description: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const syllabus = {
    title: course.title,
    description: course.description,
    units: course.units.map((unit) => ({
      order: unit.order,
      title: unit.title,
      description: unit.description,
      sections: unit.sections.map((section) => ({
        order: section.order,
        title: section.title,
        description: section.description,
        lessons: section.tasks.map((lesson) => ({
          id: lesson.id,
          order: lesson.order,
          title: lesson.title,
          description: lesson.description,
        })),
      })),
    })),
  };

  return syllabus;
}

export const GenerateLessonStepsTaskById = schemaTask({
  id: 'generate-lesson-steps-by-id',
  schema: z.object({
    lessonId: z.string().uuid(),
    courseId: z.string().uuid(),
  }),
  run: async ({ lessonId, courseId }) => {
    const [lesson] = await db
      .select()
      .from(schema.task)
      .where(eq(schema.task.id, lessonId))
      .limit(1);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const [source] = await db
      .select()
      .from(schema.source)
      .where(eq(schema.source.courseId, courseId))
      .limit(1);

    if (!source) {
      throw new Error('Source not found');
    }

    const syllabus = await getSyllabus(courseId);

    if (!syllabus) {
      throw new Error('Syllabus not found');
    }

    const currentUnit = syllabus.units.find((unit) =>
      unit.sections.some((section) =>
        section.lessons.some((lesson) => lesson.id === lessonId),
      ),
    );

    const currentSection = currentUnit?.sections.find((section) =>
      section.lessons.some((lesson) => lesson.id === lessonId),
    );

    if (!currentUnit || !currentSection) {
      throw new Error('Unit or section not found');
    }

    await tasks.triggerAndWait<typeof GenerateLessonStepsTask>(
      'generate-lesson-steps',
      {
        lesson,
        syllabus,
        sourceId: source.id,
        unitTitle: `${currentUnit.order}. ${currentUnit.title}`,
        sectionTitle: `${currentUnit.order}.${currentSection.order}. ${currentSection.title}`,
        sectionOrder: currentSection.order,
        unitOrder: currentUnit.order,
      },
    );
  },
});
