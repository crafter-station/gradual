import { getSummarizeDocumentPrompt } from '@/lib/prompts';
import { summarizeSourceContentTask } from '@/trigger/summarize-source-content.task';
import { openai } from '@ai-sdk/openai';
import { tasks } from '@trigger.dev/sdk/v3';
import { generateText } from 'ai';

export interface ISummarizeSourceContentService {
  execute(chunkSummaries: string[]): Promise<string>;
}

export class SummarizeSourceContentService
  implements ISummarizeSourceContentService
{
  async execute(chunkSummaries: string[]): Promise<string> {
    const documentSummary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeDocumentPrompt({
        content: chunkSummaries.join('\n'),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'summarize-source-content',
      },
    });

    return documentSummary.text;
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
