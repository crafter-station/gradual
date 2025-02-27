import { db } from '@/db';
import * as schema from '@/db/schema';
import { type SQL, and, cosineDistance, desc, eq, gte, sql } from 'drizzle-orm';
import { Chunk } from './chunk';
import type { Embedding } from './embedding';

export class ChunkRepo {
  async storeMany(chunks: Chunk[]) {
    await db.insert(schema.chunk).values(
      chunks.map((chunk: Chunk) => ({
        id: chunk.id,
        order: chunk.order,
        rawContent: chunk.rawContent,
        enrichedContent: chunk.enrichedContent,
        summary: chunk.summary,
        embedding: chunk.embedding,
        sourceId: chunk.sourceId,
      })),
    );
  }

  async findBySourceIdWithEmbedding(
    sourceId: string,
    embedding: Embedding,
    limit: number,
  ): Promise<Chunk[]> {
    const similarity = this.similarity(embedding);

    const chunks = await db
      .select()
      .from(schema.chunk)
      .where(and(eq(schema.chunk.sourceId, sourceId), gte(similarity, 0.5)))
      .orderBy(desc(similarity))
      .limit(limit);

    return chunks.map(
      (c) =>
        new Chunk(
          c.id,
          c.sourceId,
          c.order,
          c.summary,
          c.rawContent,
          c.enrichedContent,
          c.embedding,
        ),
    );
  }

  private similarity(embedding: Embedding): SQL<number> {
    return sql<number>`1 - (${cosineDistance(
      schema.chunk.embedding,
      embedding,
    )})`;
  }
}
