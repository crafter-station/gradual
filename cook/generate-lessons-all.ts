import { db } from '@/db';
import { StepContentSchema } from '@/db/schema';
import * as schema from '@/db/schema';
import { getGenerateLessonPrompt } from '@/lib/prompts/generate_lesson';
import { type Syllabus, formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { embedMany, generateObject } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { z } from 'zod';

const syllabus = (await Bun.file('cook/syllabus.json').json()) as Syllabus;

const flattenedTopics: {
  description: string;
  title: string;
  unitTitle: string;
  moduleTitle: string;
}[] = [];

for (const unit of syllabus.units) {
  for (const module of unit.modules) {
    for (const topic of module.topics) {
      flattenedTopics.push({
        description: topic.description,
        title: `${unit.order}.${module.order}.${topic.order}. ${topic.title}`,
        unitTitle: `${unit.order}. ${unit.title}`,
        moduleTitle: `${unit.order}.${module.order}. ${module.title}`,
      });
    }
  }
}

const topicDescriptionEmbeddings = await embedMany({
  model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
  values: flattenedTopics.map((topic) => topic.description),
});

await Promise.all(
  flattenedTopics.map(async (topic, index) => {
    const topicDescriptionEmbedding =
      topicDescriptionEmbeddings.embeddings[index];
    const similarity = sql<number>`1 - (${cosineDistance(
      schema.chunks.embedding,
      topicDescriptionEmbedding,
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
        topic,
        chunks: chunks.map((chunk) => chunk.enrichedContent),
        syllabus: formatSyllabus(syllabus),
        unitTitle: topic.unitTitle,
        moduleTitle: topic.moduleTitle,
      }),
      output: 'array',
      schema: z.array(StepContentSchema),
    });

    const filename = topic.title
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-zA-Z0-9]/g, '-');

    await Bun.write(
      `cook/lessons/${filename}.json`,
      JSON.stringify(result, null, 2),
    );
  }),
);
