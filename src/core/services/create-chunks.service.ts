import { storeChunksTask } from '@/trigger/store-chunks.task';
import { tasks } from '@trigger.dev/sdk/v3';
import { v4 as uuidv4 } from 'uuid';
import { Chunk } from '../domain/chunk';
import type { ChunkRepo } from '../domain/chunk-repo';
import { createMultipleEmbeddings } from './create-embedding';

export interface ICreateChunksService {
  execute(
    sourceId: string,
    chunksPayloads: {
      order: number;
      rawContent: string;
      summary: string;
      enrichedContent: string;
    }[],
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
    }[],
  ): Promise<Chunk[]> {
    const embeddingsResult = await createMultipleEmbeddings(
      chunksPayloads.map((chunk) => chunk.enrichedContent),
    );

    const chunks = chunksPayloads.map((chunkPayload, i) => {
      return new Chunk(
        uuidv4(),
        sourceId,
        chunkPayload.order,
        chunkPayload.summary,
        chunkPayload.rawContent,
        chunkPayload.enrichedContent,
        embeddingsResult.embeddings[i],
      );
    });

    await this.chunkRepo.storeMany(chunks);

    return chunks;
  }
}

export class CreateChunksServiceTask implements ICreateChunksService {
  async execute(
    sourceId: string,
    chunksPayloads: {
      order: number;
      rawContent: string;
      summary: string;
      enrichedContent: string;
    }[],
  ): Promise<Chunk[]> {
    const run = await tasks.triggerAndWait<typeof storeChunksTask>(
      storeChunksTask.id,
      {
        sourceId,
        chunks: chunksPayloads,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to store chunks');
    }

    return run.output;
  }
}
