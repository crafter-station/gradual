import { Scrapper } from "@/core/domain/scrapper";
import { SourceRepo } from "@/core/domain/source-repo";
import { UserRepo } from "@/core/domain/user-repo";
import { createMultipleEmbeddings } from "@/core/services/create-embedding";
import {
  CreateSourceService,
  CreateSourceServiceTask,
} from "@/core/services/create-source.service";
import {
  EnrichChunkContentService,
  EnrichChunkContentServiceTask,
} from "@/core/services/enrich-chunk-content.service";
import {
  EnrichChunkService,
  EnrichChunksServiceTask,
} from "@/core/services/enrich-chunk.service";
import { extractChunkTextsTask } from "@/core/services/extract-chunks-texts";
import {
  ParseSourceService,
  ParseSourceServiceTask,
} from "@/core/services/parse-source.service";
import {
  SumarizeChunksContentsServiceTask,
  SummarizeChunkContentService,
  SummarizeChunkContentServiceTask,
} from "@/core/services/summarize-chunk-content.service";
import {
  SummarizeSourceContentService,
  SummarizeSourceContentServiceTask,
} from "@/core/services/summarize-source-content.service";
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
import { generateObject } from "ai";
import { and, cosineDistance, desc, eq, gte, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const scrapper = new Scrapper(process.env.FIRECRAWL_API_KEY as string);

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

    const chunks = await extractChunkTextsTask(sourceContent, CHUNK_SIZE);
    let summarizedChunks = await new SumarizeChunksContentsServiceTask(
      new SummarizeChunkContentService()
    ).execute(chunks);

    let sourceSummary = await new SummarizeSourceContentServiceTask(
      new SummarizeSourceContentService()
    ).execute(summarizedChunks.map((chunk) => chunk.summary));

    const enrichedChunks = await new EnrichChunksServiceTask(
      new EnrichChunkService(
        new SummarizeChunkContentServiceTask(
          new SummarizeChunkContentService()
        ),
        new EnrichChunkContentServiceTask(new EnrichChunkContentService())
      )
    ).execute(
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
      CHUNK_SIZE
    );

    for (let i = 0; i < enrichedChunks.length; i++) {
      enrichedChunks[i].rawContent =
        summarizedChunks[enrichedChunks[i].order].rawContent;
    }

    summarizedChunks = [];

    // enriched source summary
    sourceSummary = await new SummarizeSourceContentServiceTask(
      new SummarizeSourceContentService()
    ).execute(enrichedChunks.map((chunk) => chunk.enrichedSummary));

    const source = await new CreateSourceServiceTask(
      new CreateSourceService(new SourceRepo())
    ).execute(payload.url, user.id, sourceSummary, enrichedChunks.length);

    const sourceId = source.id;

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
    const embeddingsResult = await createMultipleEmbeddings(
      payload.chunks.map((chunk) => chunk.enrichedContent)
    );

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

    const courseEmbeddingResult = await createMultipleEmbeddings([
      `${payload.syllabus.title} ${payload.syllabus.description}`,
      ...units.map((unit) => `${unit.title} ${unit.description}`),
      ...modules.map((module) => `${module.title} ${module.description}`),
      ...lessons.map((lesson) => `${lesson.title} ${lesson.description}`),
    ]);

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
