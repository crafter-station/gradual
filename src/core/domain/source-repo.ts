import { db } from "@/db";
import * as schema from "@/db/schema";
import type { Source } from "./source";

export class SourceRepo {
  async store(source: Source): Promise<void> {
    await db.insert(schema.sources).values({
      id: source.id,
      type: "URL",
      filePath: source.filePath,
      creatorId: source.creatorId,
      summary: source.summary,
      embedding: source.embedding,
      chunksCount: source.chunksCount,
    });
  }
}
