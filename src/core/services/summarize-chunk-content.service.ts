import { getSummarizeChunkPrompt } from '@/lib/prompts';
import { summarizeChunkContentTask } from '@/trigger/summarize-chunk-content.task';
import { batch, tasks } from '@trigger.dev/sdk/v3';
import { OpenAIGenerator } from '../domain/aigen';

export interface ISummarizeChunkContentService {
  execute(
    rawContent: string,
    order: number,
  ): Promise<{ order: number; summary: string }>;
}

export interface ISumarizeChunksContentsService {
  execute(chunks: string[]): Promise<
    {
      order: number;
      summary: string;
      rawContent: string;
    }[]
  >;
}

export class SummarizeChunkContentService
  implements ISummarizeChunkContentService
{
  async execute(
    rawContent: string,
    order: number,
  ): Promise<{ order: number; summary: string }> {
    const summary = await new OpenAIGenerator().generateText({
      model: 'gpt-4o-mini',
      prompt: getSummarizeChunkPrompt({ chunk: rawContent }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'summarize-chunk-prompt',
      },
    });

    return {
      order: order,
      summary,
    };
  }
}

export class SummarizeChunkContentServiceTask
  implements ISummarizeChunkContentService
{
  async execute(
    rawContent: string,
    order: number,
  ): Promise<{ order: number; summary: string }> {
    const run = await tasks.triggerAndWait<typeof summarizeChunkContentTask>(
      summarizeChunkContentTask.id,
      {
        order: order,
        rawContent: rawContent,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to summarize chunk!');
    }

    return run.output;
  }
}

export class SumarizeChunksContentsServiceTask
  implements ISumarizeChunksContentsService
{
  async execute(chunks: string[]): Promise<
    {
      order: number;
      summary: string;
      rawContent: string;
    }[]
  > {
    const { runs } = await batch.triggerByTaskAndWait(
      chunks.map((chunk, index) => ({
        task: summarizeChunkContentTask,
        payload: { rawContent: chunk, order: index },
      })),
    );

    const summarizedChunks: {
      order: number;
      summary: string;
      rawContent: string;
    }[] = [];

    for (const run of runs) {
      if (run.ok) {
        summarizedChunks.push({
          order: run.output.order,
          summary: run.output.summary,
          rawContent: chunks[run.output.order],
        });
      }
    }

    return summarizedChunks;
  }
}
