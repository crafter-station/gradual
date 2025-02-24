import { Scrapper } from "@/core/domain/scrapper";
import { UserRepo } from "@/core/domain/user-repo";
import { EnrichChunkContentService } from "@/core/services/enrich-chunk-content.service";
import { extractChunkTexts } from "@/core/services/extract-chunks-texts";
import {
  ParseSourceService,
  ParseSourceServiceTask,
} from "@/core/services/parse-source.service";
import { SummarizeChunkContentService } from "@/core/services/summarize-chunk-content.service";
import { SummarizeSourceContentService } from "@/core/services/summarize-source-content.service";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  type InsertCourse,
  InsertCourseSchema,
  type InsertModule,
  InsertModuleSchema,
  type InsertTask,
  InsertTaskSchema,
  type InsertUnit,
  InsertUnitSchema,
} from "@/db/schema";
import { CHUNK_SIZE } from "@/lib/constants";
import {
  getGenerateCourseSyllabusPrompt,
  getGenerateLessonPrompt,
} from "@/lib/prompts";
import { SyllabusSchema } from "@/lib/schemas";
import { formatSyllabus } from "@/lib/utils";
import { openai } from "@ai-sdk/openai";
import { batch, logger, schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { embed, embedMany, generateObject } from "ai";
import { and, cosineDistance, desc, eq, gte, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const scrapper = new Scrapper(process.env.FIRECRAWL_API_KEY);

const CreateCourseTaskSchema = z.object({
  url: z.string().url(),
});

function getContentSize(sourceContentLength: number) {
  return sourceContentLength > CHUNK_SIZE * 50
    ? "large"
    : sourceContentLength > CHUNK_SIZE * 10
    ? "medium"
    : "small";
}

export const CreateCourseTask = schemaTask({
  id: "create-course",
  schema: CreateCourseTaskSchema,
  run: async (payload) => {
    const userRepo = new UserRepo();
    const user = await userRepo.findFirst();
    if (!user) {
      throw new Error("User not found");
    }

    const sourceContent = await new ParseSourceServiceTask(
      new ParseSourceService(scrapper, logger)
    ).execute(payload.url);

    const chunkenizeSourceContentRun = await tasks.triggerAndWait<
      typeof ChunkenizeSourceContentTask
    >("chunkenize-source-content", {
      content: sourceContent,
    });

    if (!chunkenizeSourceContentRun.ok) {
      throw new Error("Failed to chunk content");
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
      }))
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
    >("summarize-source-content", {
      chunkSummaries: summarizedChunks.map((chunk) => chunk.summary),
    });

    if (!summarizeSourceTask.ok) {
      throw new Error("Failed to summarize source");
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
      }))
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
    >("summarize-source-content", {
      chunkSummaries: enrichedChunks.map((chunk) => chunk.enrichedSummary),
    });

    if (!enrichedSourceSummary.ok) {
      throw new Error("Failed to enrich source summary");
    }

    sourceSummary = enrichedSourceSummary.output.summary;

    const storeSourceRun = await tasks.triggerAndWait<typeof StoreSourceTask>(
      "store-source",
      {
        url: payload.url,
        userId: user.id,
        sourceSummary,
        chunksCount: enrichedChunks.length,
      }
    );

    if (!storeSourceRun.ok) {
      throw new Error("Failed to store source");
    }

    const sourceId = storeSourceRun.output;

    const storeChunksRun = await tasks.triggerAndWait<typeof StoreChunksTask>(
      "store-chunks",
      {
        sourceId,
        chunks: enrichedChunks.map((chunk) => ({
          order: chunk.order,
          rawContent: chunk.rawContent,
          summary: chunk.enrichedSummary,
          enrichedContent: chunk.enrichedContent,
        })),
      }
    );

    if (!storeChunksRun.ok) {
      throw new Error("Failed to store chunks");
    }

    const contentSize = getContentSize(sourceContent.length);

    const syllabusResult = await tasks.triggerAndWait<
      typeof GenerateCourseSyllabusTask
    >("generate-course-syllabus", {
      documentSummary: sourceSummary,
      documentChunksSummaries: enrichedChunks.map(
        (chunk) => chunk.enrichedSummary
      ),
      contentSize,
    });

    if (!syllabusResult.ok) {
      throw new Error("Failed to generate course syllabus");
    }

    const syllabus = syllabusResult.output;

    const syllabusEmbeddingsResult = await tasks.triggerAndWait<
      typeof GenerateSyllabusEmbeddingsTask
    >("generate-syllabus-embeddings", {
      syllabus,
    });

    if (!syllabusEmbeddingsResult.ok) {
      throw new Error("Failed to generate course syllabus embeddings");
    }

    const {
      courseEmbedding,
      unitEmbeddings,
      moduleEmbeddings,
      lessonEmbeddings,
    } = syllabusEmbeddingsResult.output;

    const course: InsertCourse & { id: string } = {
      id: uuidv4(),
      title: syllabus.title,
      description: syllabus.description,
      creatorId: user.id,
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
      })
    );

    const modules: (InsertModule & { id: string })[] = syllabus.units.flatMap(
      (unit) =>
        unit.modules.map((module) => ({
          id: uuidv4(),
          ...module,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          unitId: units.find((u) => u.order === unit.order)!.id,
          order: module.order,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          embedding: moduleEmbeddings.find(
            (u) => u.moduleOrder === module.order && u.unitOrder === unit.order
          )!.embedding,
        }))
    );

    const getModuleId = (unitOrder: number, moduleOrder: number) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      modules.find(
        (m) =>
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          m.unitId === units.find((u) => u.order === unitOrder)!.id &&
          m.order === moduleOrder
      )!.id;

    const getUnitId = (unitOrder: number) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      units.find((u) => u.order === unitOrder)!.id;

    const getEmbedding = (
      unitOrder: number,
      moduleOrder: number,
      lessonOrder: number
    ) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      lessonEmbeddings.find(
        (l) =>
          l.lessonOrder === lessonOrder &&
          l.moduleOrder === moduleOrder &&
          l.unitOrder === unitOrder
      )!.embedding;

    const lessons: (InsertTask & {
      id: string;
      type: "LESSON";
      unitId: string;
      courseId: string;
      unitOrder: number;
      moduleOrder: number;
    })[] = syllabus.units.flatMap((unit) =>
      unit.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          id: uuidv4(),
          ...lesson,
          moduleId: getModuleId(unit.order, module.order),
          order: lesson.order,
          type: "LESSON",
          stepsCount: 0,
          embedding: getEmbedding(unit.order, module.order, lesson.order),
          unitId: getUnitId(unit.order),
          courseId: course.id,
          unitOrder: unit.order,
          moduleOrder: module.order,
        }))
      )
    );

    await tasks.triggerAndWait<typeof StoreSyllabusTask>("store-syllabus", {
      course,
      units,
      modules,
      lessons,
      sourceId,
    });

    await batch.triggerByTaskAndWait(
      lessons.map((lesson) => ({
        task: GenerateLessonStepsTask,
        payload: {
          lesson,
          syllabus,
          sourceId,
          unitOrder: lesson.unitOrder,
          moduleOrder: lesson.moduleOrder,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          unitTitle: units.find((u) => u.order === lesson.unitOrder)!.title,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          moduleTitle: modules.find((m) => m.order === lesson.moduleOrder)!
            .title,
        },
      }))
    );
  },
});

export const ChunkenizeSourceContentTask = schemaTask({
  id: "chunkenize-source-content",
  schema: z.object({
    content: z.string(),
  }),
  run: async (payload) => {
    return extractChunkTexts(payload.content, CHUNK_SIZE);
  },
});

export const SummarizeChunkContentTask = schemaTask({
  id: "summarize-chunk-content",
  schema: z.object({
    rawContent: z.string(),
    order: z.number(),
  }),
  run: async (payload) => {
    return new SummarizeChunkContentService().execute(
      payload.rawContent,
      payload.order
    );
  },
});

export const SummarizeSourceContentTask = schemaTask({
  id: "summarize-source-content",
  schema: z.object({
    chunkSummaries: z.array(z.string()),
  }),
  run: async (payload) => {
    return new SummarizeSourceContentService().execute(payload.chunkSummaries);
  },
});

export const EnrichChunkContentTask = schemaTask({
  id: "enrich-chunk-content",
  schema: z.object({
    rawContent: z.string(),
    sourceSummary: z.string(),
    precedingChunkContent: z.string().nullable(),
    succeedingChunkContent: z.string().nullable(),
  }),
  run: async (payload) => {
    return new EnrichChunkContentService().execute(
      payload.rawContent,
      payload.sourceSummary,
      payload.precedingChunkContent,
      payload.succeedingChunkContent,
      CHUNK_SIZE
    );
  },
});

export const EnrichChunkTask = schemaTask({
  id: "enrich-chunk",
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
    >("enrich-chunk-content", {
      rawContent: payload.rawContent,
      sourceSummary: payload.sourceSummary,
      precedingChunkContent: payload.precedingChunkContent,
      succeedingChunkContent: payload.succeedingChunkContent,
    });

    if (!enrichedChunkContent.ok) {
      throw new Error("Failed to enrich chunk!");
    }

    const enrichedSummary = await tasks.triggerAndWait<
      typeof SummarizeChunkContentTask
    >("summarize-chunk-content", {
      order: payload.order,
      rawContent: enrichedChunkContent.output.enrichedContent,
    });

    if (!enrichedSummary.ok) {
      throw new Error("Failed to summarize chunk!");
    }

    return {
      order: payload.order,
      enrichedContent: enrichedChunkContent.output.enrichedContent,
      enrichedSummary: enrichedSummary.output.summary,
    };
  },
});

export const StoreSourceTask = schemaTask({
  id: "store-source",
  schema: z.object({
    url: z.string(),
    userId: z.string(),
    sourceSummary: z.string(),
    chunksCount: z.number(),
  }),

  run: async (payload) => {
    const sourceEmbedding = await embed({
      model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
      value: payload.sourceSummary,
    });

    const [source] = await db
      .insert(schema.sources)
      .values({
        type: "URL",
        filePath: payload.url,
        creatorId: payload.userId,
        summary: payload.sourceSummary,
        embedding: sourceEmbedding.embedding,
        chunksCount: payload.chunksCount,
      })
      .returning({ id: schema.sources.id });

    return source.id;
  },
});

export const StoreChunksTask = schemaTask({
  id: "store-chunks",
  schema: z.object({
    sourceId: z.string(),
    chunks: z.array(
      z.object({
        order: z.number(),
        rawContent: z.string(),
        summary: z.string(),
        enrichedContent: z.string(),
      })
    ),
  }),
  run: async (payload) => {
    const embeddingsResult = await embedMany({
      model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
      values: payload.chunks.map((chunk) => chunk.enrichedContent),
    });

    await db.insert(schema.chunks).values(
      payload.chunks.map((chunk, index) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        enrichedContent: chunk.enrichedContent,
        summary: chunk.summary,
        embedding: embeddingsResult.embeddings[index],
        sourceId: payload.sourceId,
      }))
    );
  },
});

export const GenerateCourseSyllabusTask = schemaTask({
  id: "generate-course-syllabus",
  schema: z.object({
    documentSummary: z.string(),
    documentChunksSummaries: z.array(z.string()),
    contentSize: z.enum(["small", "medium", "large"]),
  }),
  run: async (payload) => {
    const syllabusResult = await generateObject({
      model: openai("o3-mini"),
      prompt: getGenerateCourseSyllabusPrompt({
        documentSummary: payload.documentSummary,
        documentChunksSummariesJoined:
          payload.documentChunksSummaries.join("\n"),
        contentSize: payload.contentSize,
      }),
      schema: SyllabusSchema,
    });

    return syllabusResult.object;
  },
  retry: {
    maxAttempts: 3,
  },
});

export const GenerateSyllabusEmbeddingsTask = schemaTask({
  id: "generate-syllabus-embeddings",
  schema: z.object({
    syllabus: SyllabusSchema,
  }),
  run: async (payload) => {
    const units = payload.syllabus.units.map((unit) => ({
      title: unit.title,
      description: unit.description,
      unitOrder: unit.order,
    }));

    const modules = payload.syllabus.units.flatMap((unit) =>
      unit.modules.map((module) => ({
        title: module.title,
        description: module.description,
        moduleOrder: module.order,
        unitOrder: unit.order,
      }))
    );

    const lessons = payload.syllabus.units.flatMap((unit) =>
      unit.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          lessonOrder: lesson.order,
          moduleOrder: module.order,
          unitOrder: unit.order,
        }))
      )
    );

    const courseEmbeddingResult = await embedMany({
      model: openai.embedding("text-embedding-3-large", { dimensions: 1536 }),
      values: [
        `${payload.syllabus.title} ${payload.syllabus.description}`,
        ...units.map((unit) => `${unit.title} ${unit.description}`),
        ...modules.map((module) => `${module.title} ${module.description}`),
        ...lessons.map((lesson) => `${lesson.title} ${lesson.description}`),
      ],
    });

    return {
      courseEmbedding: courseEmbeddingResult.embeddings[0],
      unitEmbeddings: units.map((unit, index) => ({
        embedding: courseEmbeddingResult.embeddings[1 + index],
        unitOrder: unit.unitOrder,
      })),
      moduleEmbeddings: modules.map((module, index) => ({
        embedding: courseEmbeddingResult.embeddings[1 + units.length + index],
        moduleOrder: module.moduleOrder,
        unitOrder: module.unitOrder,
      })),
      lessonEmbeddings: lessons.map((lesson, index) => ({
        embedding:
          courseEmbeddingResult.embeddings[
            1 + units.length + modules.length + index
          ],
        lessonOrder: lesson.lessonOrder,
        moduleOrder: lesson.moduleOrder,
        unitOrder: lesson.unitOrder,
      })),
    };
  },
});

export const StoreSyllabusTask = schemaTask({
  id: "store-syllabus",
  schema: z.object({
    course: InsertCourseSchema,
    units: z.array(InsertUnitSchema),
    modules: z.array(InsertModuleSchema),
    lessons: z.array(InsertTaskSchema),
    sourceId: z.string(),
  }),
  run: async (payload) => {
    await db.insert(schema.courses).values(payload.course);
    await db.insert(schema.units).values(payload.units);
    await db.insert(schema.modules).values(payload.modules);
    await db.insert(schema.tasks).values(payload.lessons);
    await db
      .update(schema.sources)
      .set({
        courseId: payload.course.id,
      })
      .where(eq(schema.sources.id, payload.sourceId));
  },
});

export const GenerateLessonStepsTask = schemaTask({
  id: "generate-lesson-steps",
  schema: z.object({
    lesson: InsertTaskSchema,
    syllabus: SyllabusSchema,
    sourceId: z.string(),
    unitOrder: z.number(),
    moduleOrder: z.number(),
    unitTitle: z.string(),
    moduleTitle: z.string(),
  }),
  run: async ({
    lesson,
    syllabus,
    sourceId,
    unitOrder,
    moduleOrder,
    unitTitle,
    moduleTitle,
  }) => {
    const similarity = sql<number>`1 - (${cosineDistance(
      schema.chunks.embedding,
      lesson.embedding
    )})`;

    const chunks = await db
      .select()
      .from(schema.chunks)
      .where(and(eq(schema.chunks.sourceId, sourceId), gte(similarity, 0.5)))
      .orderBy(desc(similarity))
      .limit(5);

    const stepsResult = await generateObject({
      model: openai("o3-mini"),
      prompt: getGenerateLessonPrompt({
        lesson: {
          ...lesson,
          title: `${unitOrder}.${moduleOrder}.${lesson.order}. ${lesson.title}`,
        },
        chunks: chunks.map((chunk) => chunk.enrichedContent),
        syllabus: formatSyllabus(syllabus),
        unitTitle: `${unitOrder}. ${unitTitle}`,
        moduleTitle: `${unitOrder}.${moduleOrder}. ${moduleTitle}`,
      }),
      schema: z.object({
        steps: z.array(schema.StepContentSchema),
      }),
    });

    const steps = stepsResult.object.steps;

    await db
      .update(schema.tasks)
      .set({
        stepsCount: steps.length,
      })
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      .where(eq(schema.tasks.id, lesson.id!));

    await db.insert(schema.steps).values(
      steps.map((step, stepIndex) => ({
        order: stepIndex,
        content: step,
        type: step.type,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        taskId: lesson.id!,
      }))
    );
  },
});
