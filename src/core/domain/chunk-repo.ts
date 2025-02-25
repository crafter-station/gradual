import { db } from "@/db";
import * as schema from "@/db/schema";
import type { Chunk } from "./chunk";

export class ChunkRepo {
  async storeMany(chunks: Chunk[]) {
    await db.insert(schema.chunks).values(
      chunks.map((chunk: Chunk) => ({
        id: chunk.id,
        order: chunk.order,
        rawContent: chunk.rawContent,
        enrichedContent: chunk.enrichedContent,
        summary: chunk.summary,
        embedding: chunk.embedding,
        sourceId: chunk.sourceId,
      }))
    );
  }
}
