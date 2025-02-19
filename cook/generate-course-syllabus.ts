import { db } from '@/db';
import * as schema from '@/db/schema';
import { getGenerateCourseSyllabusPrompt } from '@/lib/prompts/generate_course_syllabus';
import { formatSyllabus, syllabusSchema } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { eq } from 'drizzle-orm';

const sourceId = 'c55e8f1c-d1a8-4751-b282-51fccea96fea';
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
  schema: syllabusSchema,
});

await Bun.write('cook/syllabus.json', JSON.stringify(result.object, null, 2));

console.log(formatSyllabus(result.object));
