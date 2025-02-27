import { getEnrichChunkPrompt } from '@/lib/prompts';
import { enrichChunkContentTask } from '@/trigger/enrich-chunk-content.task';
import { tasks } from '@trigger.dev/sdk/v3';
import { OpenAIGenerator } from '../domain/aigen';

export interface IEnrichChunkContentService {
  execute(
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number,
  ): Promise<{ enrichedContent: string }>;
}

export class EnrichChunkContentService implements IEnrichChunkContentService {
  async execute(
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number,
  ): Promise<{ enrichedContent: string }> {
    const enrichedContent = await new OpenAIGenerator().generateText({
      model: 'gpt-4o-mini',
      prompt: getEnrichChunkPrompt({
        chunk: rawContent,
        sourceSummary: sourceSummary,
        precedingChunkContent: precedingChunkContent,
        succeedingChunkContent: succeedingChunkContent,
        chunkSize: chunkSize,
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'enrich-chunk-prompt',
      },
    });

    return {
      enrichedContent: enrichedContent,
    };
  }
}

export class EnrichChunkContentServiceTask
  implements IEnrichChunkContentService
{
  async execute(
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number,
  ): Promise<{ enrichedContent: string }> {
    const run = await tasks.triggerAndWait<typeof enrichChunkContentTask>(
      enrichChunkContentTask.id,
      {
        rawContent: rawContent,
        sourceSummary: sourceSummary,
        precedingChunkContent: precedingChunkContent,
        succeedingChunkContent: succeedingChunkContent,
        chunkSize: chunkSize,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to enrich chunk!');
    }

    return {
      enrichedContent: run.output.enrichedContent,
    };
  }
}
