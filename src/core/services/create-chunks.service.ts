import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Chunk } from "../domain/chunk";
import type { ChunkRepo } from "../domain/chunk-repo";
import { createMultipleEmbeddings } from "./create-embedding";

export interface ICreateChunksService {
  execute(
    sourceId: string,
    chunksPayloads: {
      order: number;
      rawContent: string;
      summary: string;
      enrichedContent: string;
    }[]
  ): Promise<Chunk[]>;
}

export class CreateChunksService implements ICreateChunksService {
  constructor(private chunkRepo: ChunkRepo) {}

  async execute(
    sourceId: string,
    chunksPayloads: {
      order: number;
      rawContent: string;
      summary: string;
      enrichedContent: string;
    }[]
  ): Promise<Chunk[]> {
    const embeddingsResult = await createMultipleEmbeddings(
      chunksPayloads.map((chunk) => chunk.enrichedContent)
    );

    const chunks = chunksPayloads.map((chunkPayload, i) => {
      return new Chunk(
        uuidv4(),
        sourceId,
        chunkPayload.order,
        chunkPayload.summary,
        chunkPayload.rawContent,
        chunkPayload.enrichedContent,
        embeddingsResult.embeddings[i]
      );
    });

    await this.chunkRepo.storeMany(chunks);

    return chunks;
  }
}

export class CreateChunkServiceTask implements ICreateChunksService {
  constructor(private service: ICreateChunksService) {}

  async execute(
    sourceId: string,
    chunksPayloads: {
      order: number;
      rawContent: string;
      summary: string;
      enrichedContent: string;
    }[]
  ): Promise<Chunk[]> {
    const StoreChunksTask = schemaTask({
      id: "store-chunks",
      schema: z.object({
        sourceId: z.string(),
        chunks: z.array(
          z.object({
            order: z.number(),
            rawContent: z.string(),
            summary: z.string(),
            enrichedContent: z.string(),
          })
        ),
      }),
      run: async (payload) => {
        return await this.service.execute(payload.sourceId, payload.chunks);
      },
    });

    const storeChunksRun = await tasks.triggerAndWait<typeof StoreChunksTask>(
      "store-chunks",
      {
        sourceId,
        chunks: chunksPayloads,
      }
    );

    if (!storeChunksRun.ok) {
      throw new Error("Failed to store chunks");
    }

    return storeChunksRun.output;
  }
}
