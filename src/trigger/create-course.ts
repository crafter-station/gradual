import { service } from '@/core/services/container';
import { CreateChunksServiceTask } from '@/core/services/create-chunks.service';
import { CreateCourseService } from '@/core/services/create-course.service';
import { CreateSourceServiceTask } from '@/core/services/create-source.service';
import { EnrichChunksServiceTask } from '@/core/services/enrich-chunk.service';
import { extractChunkTextsTask } from '@/core/services/extract-chunks-texts';
import { GenerateCourseSyllabusServiceTask } from '@/core/services/generate-course-syllabus.service';
import { GenerateSyllabusEmbeddingsServiceTask } from '@/core/services/generate-syllabus-embeddings.service';
import { ParseSourceServiceTask } from '@/core/services/parse-source.service';
import { SumarizeChunksContentsServiceTask } from '@/core/services/summarize-chunk-content.service';
import { SummarizeSourceContentServiceTask } from '@/core/services/summarize-source-content.service';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { InsertTaskSchema } from '@/db/schema';
import { CHUNK_SIZE } from '@/lib/constants';
import { getGenerateLessonPrompt } from '@/lib/prompts';
import { SyllabusSchema } from '@/lib/schemas';
import { formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { batch, schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { generateObject } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
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

    await service(CreateChunksServiceTask).execute(
      sourceId,
      enrichedChunks.map((chunk) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        summary: chunk.enrichedSummary,
        enrichedContent: chunk.enrichedContent,
      })),
    );

    const contentSize = getContentSize(sourceContent.length);

    const syllabus = await service(GenerateCourseSyllabusServiceTask).execute(
      sourceSummary,
      enrichedChunks.map((chunk) => chunk.enrichedSummary),
      contentSize,
    );

    const {
      courseEmbedding,
      unitEmbeddings,
      sectionEmbeddings,
      lessonEmbeddings,
    } = await service(GenerateSyllabusEmbeddingsServiceTask).execute(syllabus);

    const { units, sections, lessons } = await service(
      CreateCourseService,
    ).execute(
      syllabus,
      courseEmbedding,
      unitEmbeddings,
      sectionEmbeddings,
      lessonEmbeddings,
      payload.userId,
      sourceId,
    );

    const firstSectionLessons = lessons.filter(
      (lesson) =>
        lesson.unitOrder(sections, units) === 1 &&
        lesson.sectionOrder(sections) === 1,
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
            unitId: lesson.unitId(sections, units),
          },
          syllabus,
          sourceId,
          unitOrder: lesson.unitOrder(sections, units),
          sectionOrder: lesson.sectionOrder(sections),
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          unitTitle: units.find(
            (u) => u.order === lesson.unitOrder(sections, units),
          )!.title,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          sectionTitle: sections.find(
            (m) => m.order === lesson.sectionOrder(sections),
          )!.title,
        },
      })),
    );
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
