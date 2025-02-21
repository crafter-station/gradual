import { db } from '@/db';
import { StepContentSchema } from '@/db/schema';
import * as schema from '@/db/schema';
import { getGenerateLessonPrompt } from '@/lib/prompts/generate_lesson';
import { type Syllabus, formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { embed, embedMany, generateObject } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { z } from 'zod';

const syllabus = (await Bun.file('cook/syllabus.json').json()) as Syllabus;

const topicDescriptionEmbeddings = await embedMany({
  model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
  values: syllabus.units[0].modules[0].topics.map((topic) => topic.description),
});

await Promise.all(
  syllabus.units[0].modules[0].topics.map(async (topic, index) => {
    const topicDescriptionEmbedding = await embed({
      model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
      value: topic.description,
    });
    const similarity = sql<number>`1 - (${cosineDistance(
      schema.chunks.embedding,
      topicDescriptionEmbedding.embedding,
    )})`;

    const chunks = await db
      .select()
      .from(schema.chunks)
      .where(
        and(
          eq(schema.chunks.sourceId, 'b8e626d1-74d5-4e76-871e-a207aa0fb241'),
          gte(similarity, 0.5),
        ),
      )
      .orderBy(desc(similarity))
      .limit(5);

    const result = await generateObject({
      model: openai('o3-mini'),
      prompt: getGenerateLessonPrompt({
        topic: {
          description: topic.description,
          title: `1.1.${topic.order}. ${topic.title}`,
        },
        chunks: chunks.map((chunk) => chunk.enrichedContent),
        syllabus: formatSyllabus(syllabus),
        unitTitle: `1. ${syllabus.units[0].title}`,
        moduleTitle: `1.1. ${syllabus.units[0].modules[0].title}`,
      }),
      output: 'array',
      schema: z.array(StepContentSchema),
    });

    await Bun.write(
      `cook/lessons/${index}.json`,
      JSON.stringify(result, null, 2),
    );
  }),
);
