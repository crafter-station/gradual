import { db } from '@/db';
import * as schema from '@/db/schema';
import { getGenerateCourseSyllabusPrompt } from '@/lib/prompts/generate_course_syllabus';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const sourceId = 'a3cf464e-41c4-47f1-a764-d8ab7a104205';
const source = await db.query.sources.findFirst({
  where: eq(schema.sources.id, sourceId),
});

if (!source) {
  throw new Error('Source not found');
}
if (!source.summary) {
  throw new Error('Source summary not found');
}

const chunks = await db.query.chunks.findMany({
  where: eq(schema.chunks.sourceId, sourceId),
});

if (!chunks) {
  throw new Error('Chunks not found');
}

const result = await generateObject({
  model: openai('gpt-4o-mini'),
  prompt: getGenerateCourseSyllabusPrompt({
    documentSummary: source.summary,
    documentChunksSummariesJoined: chunks
      .map((chunk) => chunk.summary)
      .join('\n'),
  }),
  schema: z.object({
    title: z.string(),
    units: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        modules: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            topics: z.array(z.string()),
          }),
        ),
      }),
    ),
  }),
});

console.log(result.object);

await Bun.write('output.json', JSON.stringify(result.object, null, 2));
