import { db } from '@/db';
import * as schema from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import { and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';

const data = (await Bun.file('cook/search-paragraphs.json').json()) as {
  paragraphs: string[];
};

const sourceId = '1b8d3c65-8b9c-4bcd-90e5-06b866a4dd48';
const embeddingsOfParagraphs = await embedMany({
  model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
  values: data.paragraphs,
});

console.log(embeddingsOfParagraphs);

const allSimilarChunks = await Promise.all(
  data.paragraphs.map(async (paragraph, index) => {
    const similarity = sql<number>`1 - (${cosineDistance(
      schema.chunks.embedding,
      embeddingsOfParagraphs.embeddings[index],
    )})`;

    const similarChunks = await db
      .select({
        similarity,
        order: schema.chunks.order,
        summary: schema.chunks.summary,
        enrichedContent: schema.chunks.enrichedContent,
      })
      .from(schema.chunks)
      .where(and(eq(schema.chunks.sourceId, sourceId), gte(similarity, 0.5)))
      .orderBy(desc(similarity))
      .limit(10);
    return similarChunks;
  }),
);

console.log(allSimilarChunks);

await Bun.write('cook/chunks.json', JSON.stringify(allSimilarChunks, null, 2));

// Create a map to count chunk occurrences by order
const chunkOccurrences = new Map<
  number,
  {
    count: number;
    chunk: (typeof allSimilarChunks)[0][0];
  }
>();

// Count occurrences of each chunk across all similar chunks
for (const similarChunks of allSimilarChunks) {
  for (const chunk of similarChunks) {
    const existing = chunkOccurrences.get(chunk.order);
    if (existing) {
      existing.count++;
    } else {
      chunkOccurrences.set(chunk.order, {
        count: 1,
        chunk,
      });
    }
  }
}

// Convert to array and sort by count descending
const mostRepeatedChunks = Array.from(chunkOccurrences.values())
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)
  .map(({ chunk }) => chunk);

console.log('Most repeated chunks:', mostRepeatedChunks);

await Bun.write(
  'cook/most-repeated-chunks.json',
  JSON.stringify(mostRepeatedChunks, null, 2),
);
