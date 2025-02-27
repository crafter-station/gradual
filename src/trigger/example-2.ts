import { OpenAIGenerator } from '@/core/domain/aigen';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { InsertTaskSchema } from '@/db/schema';
import { getGenerateLessonPrompt } from '@/lib/prompts';
import { SyllabusSchema } from '@/lib/schemas';
import { formatSyllabus } from '@/lib/utils';
import { schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { z } from 'zod';

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

    const stepsResult = await new OpenAIGenerator().generateObject({
      model: 'o3-mini',
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
        functionId: 'genrate-lesson-prompt',
      },
    });

    const steps = stepsResult.steps;

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
