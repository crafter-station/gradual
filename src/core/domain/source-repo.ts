import { db } from "@/db";
import * as schema from "@/db/schema";
import type { Source } from "./source";

export class SourceRepo {
  async store(source: Source): Promise<string> {
    const [sourceRecord] = await db
      .insert(schema.sources)
      .values({
        type: "URL",
        filePath: source.filePath,
        creatorId: source.creatorId,
        summary: source.summary,
        embedding: source.embedding,
        chunksCount: source.chunksCount,
      })
      .returning({ id: schema.sources.id });

    source.changeId(sourceRecord.id);

    return sourceRecord.id;
  }
}
