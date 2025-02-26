import { ChunkRepo } from '@/core/domain/chunk-repo';
import { service } from '@/core/services/container';
import {
  CreateChunkServiceTask,
  CreateChunksService,
} from '@/core/services/create-chunks.service';
import { createMultipleEmbeddings } from '@/core/services/create-embedding';
import { CreateSourceServiceTask } from '@/core/services/create-source.service';
import { EnrichChunksServiceTask } from '@/core/services/enrich-chunk.service';
import { extractChunkTextsTask } from '@/core/services/extract-chunks-texts';
import {
  GenerateCourseSyllabusService,
  GenerateCourseSyllabusServiceTask,
} from '@/core/services/generate-course-syllabus.service';
import { ParseSourceServiceTask } from '@/core/services/parse-source.service';
import { SumarizeChunksContentsServiceTask } from '@/core/services/summarize-chunk-content.service';
import { SummarizeSourceContentServiceTask } from '@/core/services/summarize-source-content.service';
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
import { getGenerateLessonPrompt } from '@/lib/prompts';
import { SyllabusSchema } from '@/lib/schemas';
import { formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { batch, schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { generateObject } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

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
    const sourceContent = await service(ParseSourceServiceTask).execute(
      payload.url,
    );

    const chunks = await extractChunkTextsTask(sourceContent, CHUNK_SIZE);
    let summarizedChunks = await service(
      SumarizeChunksContentsServiceTask,
    ).execute(chunks);

    let sourceSummary = await service(
      SummarizeSourceContentServiceTask,
    ).execute(summarizedChunks.map((chunk) => chunk.summary));

    const enrichedChunks = await service(EnrichChunksServiceTask).execute(
      summarizedChunks.map((chunk) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        sourceSummary: sourceSummary,
        precedingChunkContent:
          summarizedChunks.find((c) => c.order === chunk.order - 1)
            ?.rawContent ?? null,
        succeedingChunkContent:
          summarizedChunks.find((c) => c.order === chunk.order + 1)
            ?.rawContent ?? null,
      })),
      CHUNK_SIZE,
    );

    for (const element of enrichedChunks) {
      element.rawContent = summarizedChunks[element.order].rawContent;
    }

    summarizedChunks = [];

    // enriched source summary
    sourceSummary = await service(SummarizeSourceContentServiceTask).execute(
      enrichedChunks.map((chunk) => chunk.enrichedSummary),
    );

    const source = await service(CreateSourceServiceTask).execute(
      payload.url,
      payload.userId,
      sourceSummary,
      enrichedChunks.length,
    );

    const sourceId = source.id;

    await new CreateChunkServiceTask(
      new CreateChunksService(new ChunkRepo()),
    ).execute(
      sourceId,
      enrichedChunks.map((chunk) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        summary: chunk.enrichedSummary,
        enrichedContent: chunk.enrichedContent,
      })),
    );

    const contentSize = getContentSize(sourceContent.length);

    const syllabus = await new GenerateCourseSyllabusServiceTask(
      new GenerateCourseSyllabusService(),
    ).execute(
      sourceSummary,
      enrichedChunks.map((chunk) => chunk.enrichedSummary),
      contentSize,
    );

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

    const getsectionId = (unitOrder: number, sectionOrder: number) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      sections.find(
        (m) =>
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          m.unitId === units.find((u) => u.order === unitOrder)!.id &&
          m.order === sectionOrder,
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
          sectionId: getsectionId(unit.order, section.order),
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

    const firstSectionLessons = lessons.filter(
      (lesson) => lesson.unitOrder === 1 && lesson.sectionOrder === 1,
    );

    await batch.triggerByTaskAndWait(
      firstSectionLessons.map((lesson) => ({
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
          sectionTitle: sections.find((m) => m.order === lesson.sectionOrder)!
            .title,
        },
      })),
    );
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

    const courseEmbeddingResult = await createMultipleEmbeddings([
      `${payload.syllabus.title} ${payload.syllabus.description}`,
      ...units.map((unit) => `${unit.title} ${unit.description}`),
      ...sections.map((section) => `${section.title} ${section.description}`),
      ...lessons.map((lesson) => `${lesson.title} ${lesson.description}`),
    ]);

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
