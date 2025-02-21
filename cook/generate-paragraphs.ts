import { db } from '@/db';
import * as schema from '@/db/schema';
import { getGenerateSearchParagraphsPrompt } from '@/lib/prompts/generate_search_paragraphs';
import { type Syllabus, formatSyllabus } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const syllabus = (await Bun.file('cook/syllabus.json').json()) as Syllabus;

const sourceId = '1b8d3c65-8b9c-4bcd-90e5-06b866a4dd48';
const source = await db.query.sources.findFirst({
  where: eq(schema.sources.id, sourceId),
});

if (!source) {
  throw new Error('Source not found');
}
if (!source.summary) {
  throw new Error('Source summary not found');
}

if (syllabus.units.length > 0) {
  const firstUnit = syllabus.units[0];
  const firstModule = firstUnit.modules[0];
  const firstTopic = firstModule.topics[0];

  const prompt = getGenerateSearchParagraphsPrompt({
    documentSummary: source.summary,
    syllabus: formatSyllabus(syllabus),
    currentModule: firstModule,
    currentUnit: firstUnit,
    currentTopic: firstTopic,
  });

  console.log(prompt);
  await Bun.write('cook/search-paragraphs-prompt.txt', prompt);

  const searchParagraphs = await generateObject({
    model: openai('gpt-4o-mini'),
    prompt,
    schema: z.object({
      paragraphs: z.array(z.string()),
    }),
  });

  console.log(searchParagraphs.object.paragraphs);

  await Bun.write(
    'cook/search-paragraphs.json',
    JSON.stringify(searchParagraphs.object, null, 2),
  );
}
