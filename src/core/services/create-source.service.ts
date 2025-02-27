import { storeSourceTask } from '@/trigger/store-source.task';
import { tasks } from '@trigger.dev/sdk/v3';
import { v4 as uuidv4 } from 'uuid';
import { Source } from '../domain/source';
import type { SourceRepo } from '../domain/source-repo';
import { createSingleEmbedding } from './create-embedding';

export interface ICreateSourceService {
  execute(
    url: string,
    userId: string,
    sourceSummary: string,
    chunksCount: number,
  ): Promise<Source>;
}

export class CreateSourceService implements ICreateSourceService {
  constructor(private sourceRepo: SourceRepo) {}

  async execute(
    url: string,
    userId: string,
    sourceSummary: string,
    chunksCount: number,
  ): Promise<Source> {
    const sourceEmbedding = await createSingleEmbedding(sourceSummary);

    const source = new Source(
      uuidv4(),
      'URL',
      url,
      userId,
      sourceSummary,
      sourceEmbedding.embedding,
      chunksCount,
    );

    await this.sourceRepo.store(source);

    return source;
  }
}

export class CreateSourceServiceTask implements ICreateSourceService {
  async execute(
    url: string,
    userId: string,
    sourceSummary: string,
    chunksCount: number,
  ): Promise<Source> {
    const run = await tasks.triggerAndWait<typeof storeSourceTask>(
      storeSourceTask.id,
      {
        url: url,
        userId: userId,
        sourceSummary,
        chunksCount: chunksCount,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to store source');
    }

    return run.output;
  }
}
