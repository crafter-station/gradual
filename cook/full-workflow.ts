import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/db/utils';
import { WebPageDoc } from '@/lib/doc/web';
import { getGenerateCourseSyllabusPrompt } from '@/lib/prompts/generate_course_syllabus';
import { getGenerateLessonPrompt } from '@/lib/prompts/generate_lesson';
import { SyllabusSchema } from '@/lib/schemas';
import { formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { embed, embedMany, generateObject } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { z } from 'zod';

console.log('Starting full workflow');
console.log(new Date().toISOString());

const user = await getCurrentUser();
if (!user) {
  throw new Error('User not found');
}

const document = new WebPageDoc('https://www.rfc-editor.org/rfc/rfc959.html');

await document.init();

const syllabusResult = await generateObject({
  model: openai('o3-mini'),
  prompt: getGenerateCourseSyllabusPrompt({
    documentSummary: document.summary,
    documentChunksSummariesJoined: document.enrichedChunks
      .map((chunk) => chunk.enrichedSummary)
      .join('\n'),
  }),
  schema: SyllabusSchema,
});

console.log('Syllabus generated');
const syllabus = syllabusResult.object;

const courseEmbeddingResult = await embed({
  model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
  value: `${syllabus.title} ${syllabus.description}`,
});

const [course] = await db
  .insert(schema.courses)
  .values({
    title: syllabus.title,
    description: syllabus.description,
    embedding: courseEmbeddingResult.embedding,
    creatorId: user.id,
  })
  .returning();

const unitEmbeddings = await embedMany({
  model: openai.embedding('text-embedding-3-large', {
    dimensions: 1536,
  }),
  values: syllabus.units.map((unit) => `${unit.title} ${unit.description}`),
});

await Promise.all(
  syllabus.units.map(async (unit, unitIndex) => {
    const [createdUnit] = await db
      .insert(schema.units)
      .values({
        title: unit.title,
        description: unit.description,
        embedding: unitEmbeddings.embeddings[unitIndex],
        courseId: course.id,
        order: unitIndex,
      })
      .returning();

    const moduleEmbeddings = await embedMany({
      model: openai.embedding('text-embedding-3-large', {
        dimensions: 1536,
      }),
      values: unit.modules.map(
        (module) => `${module.title} ${module.description}`,
      ),
    });

    await Promise.all(
      unit.modules.map(async (module, moduleIndex) => {
        const [createdModule] = await db
          .insert(schema.modules)
          .values({
            title: module.title,
            description: module.description,
            embedding: moduleEmbeddings.embeddings[moduleIndex],
            unitId: createdUnit.id,
            order: moduleIndex,
          })
          .returning();

        const topicEmbeddings = await embedMany({
          model: openai.embedding('text-embedding-3-large', {
            dimensions: 1536,
          }),
          values: module.topics.map(
            (topic) => `${topic.title} ${topic.description}`,
          ),
        });

        await Promise.all(
          module.topics.map(async (topic, topicIndex) => {
            const topicEmbedding = topicEmbeddings.embeddings[topicIndex];
            const similarity = sql<number>`1 - (${cosineDistance(
              schema.chunks.embedding,
              topicEmbedding,
            )})`;

            const chunks = await db
              .select()
              .from(schema.chunks)
              .where(
                and(
                  eq(schema.chunks.sourceId, document.sourceId),
                  gte(similarity, 0.5),
                ),
              )
              .orderBy(desc(similarity))
              .limit(5);

            const stepsResult = await generateObject({
              model: openai('o3-mini'),
              prompt: getGenerateLessonPrompt({
                topic: {
                  ...topic,
                  title: `${unit.order}.${module.order}.${topic.order}. ${topic.title}`,
                },
                chunks: chunks.map((chunk) => chunk.enrichedContent),
                syllabus: formatSyllabus(syllabus),
                unitTitle: `${unit.order}. ${unit.title}`,
                moduleTitle: `${unit.order}.${module.order}. ${module.title}`,
              }),
              schema: z.object({
                steps: z.array(schema.StepContentSchema),
              }),
            });

            const steps = stepsResult.object.steps;

            const [createdTask] = await db
              .insert(schema.tasks)
              .values({
                title: topic.title,
                description: topic.description,
                embedding: topicEmbeddings.embeddings[topicIndex],
                moduleId: createdModule.id,
                order: topicIndex,
                type: 'LESSON',
                stepsCount: steps.length,
              })
              .returning();

            await db.insert(schema.steps).values(
              steps.map((step, stepIndex) => ({
                order: stepIndex,
                content: step,
                type: step.type,
                taskId: createdTask.id,
              })),
            );
          }),
        );
      }),
    );
  }),
);

console.log('Course created');
console.log(new Date().toISOString());
