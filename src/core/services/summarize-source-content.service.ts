import { getSummarizeDocumentPrompt } from '@/lib/prompts';
import { summarizeSourceContentTask } from '@/trigger/summarize-source-content.task';
import { tasks } from '@trigger.dev/sdk/v3';
import { OpenAIGenerator } from '../domain/aigen';

export interface ISummarizeSourceContentService {
  execute(chunkSummaries: string[]): Promise<string>;
}

export class SummarizeSourceContentService
  implements ISummarizeSourceContentService
{
  async execute(chunkSummaries: string[]): Promise<string> {
    const documentSummary = await new OpenAIGenerator().generateText({
      model: 'gpt-4o-mini',
      prompt: getSummarizeDocumentPrompt({
        content: chunkSummaries.join('\n'),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'summarize-source-content',
      },
    });

    return documentSummary;
  }
}

export class SummarizeSourceContentServiceTask
  implements ISummarizeSourceContentService
{
  async execute(chunkSummaries: string[]): Promise<string> {
    const run = await tasks.triggerAndWait<typeof summarizeSourceContentTask>(
      summarizeSourceContentTask.id,
      {
        chunkSummaries: chunkSummaries,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to summarize source');
    }

    return run.output;
  }
}
