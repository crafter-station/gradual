import { getSummarizeChunkPrompt } from '@/lib/prompts';
import { openai } from '@ai-sdk/openai';
import { batch, schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { generateText } from 'ai';
import { z } from 'zod';

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
    const summary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeChunkPrompt({ chunk: rawContent }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'summarize-chunk-content',
      },
    });

    return {
      order: order,
      summary: summary.text,
    };
  }
}

export class SummarizeChunkContentServiceTask
  implements ISummarizeChunkContentService
{
  constructor(private service: SummarizeChunkContentService) {}

  async execute(
    rawContent: string,
    order: number,
  ): Promise<{ order: number; summary: string }> {
    const SummarizeChunkContentTask = schemaTask({
      id: 'summarize-chunk-content',
      schema: z.object({
        rawContent: z.string(),
        order: z.number(),
      }),
      run: async (payload) => {
        return this.service.execute(payload.rawContent, payload.order);
      },
    });

    const enrichedSummary = await tasks.triggerAndWait<
      typeof SummarizeChunkContentTask
    >('summarize-chunk-content', {
      order: order,
      rawContent: rawContent,
    });

    if (!enrichedSummary.ok) {
      throw new Error('Failed to summarize chunk!');
    }

    return enrichedSummary.output;
  }
}

export class SumarizeChunksContentsServiceTask
  implements ISumarizeChunksContentsService
{
  constructor(private service: SummarizeChunkContentService) {}

  async execute(chunks: string[]): Promise<
    {
      order: number;
      summary: string;
      rawContent: string;
    }[]
  > {
    const SummarizeChunkContentTask = schemaTask({
      id: 'summarize-chunk-content',
      schema: z.object({
        rawContent: z.string(),
        order: z.number(),
      }),
      run: async (payload) => {
        return this.service.execute(payload.rawContent, payload.order);
      },
    });

    const { runs } = await batch.triggerByTaskAndWait(
      chunks.map((chunk, index) => ({
        task: SummarizeChunkContentTask,
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
