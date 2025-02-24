import { getSummarizeDocumentPrompt } from "@/lib/prompts";
import { openai } from "@ai-sdk/openai";
import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { generateText } from "ai";
import { z } from "zod";

export interface ISummarizeSourceContentService {
  execute(chunkSummaries: string[]): Promise<string>;
}

export class SummarizeSourceContentService
  implements ISummarizeSourceContentService
{
  async execute(chunkSummaries: string[]): Promise<string> {
    const documentSummary = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: getSummarizeDocumentPrompt({
        content: chunkSummaries.join("\n"),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: "summarize-source-content",
      },
    });

    return documentSummary.text;
  }
}

export class SummarizeSourceContentServiceTask
  implements ISummarizeSourceContentService
{
  constructor(private service: SummarizeSourceContentService) {}

  async execute(chunkSummaries: string[]): Promise<string> {
    const SummarizeSourceContentTask = schemaTask({
      id: "summarize-source-content",
      schema: z.object({
        chunkSummaries: z.array(z.string()),
      }),
      run: async (payload) => {
        return this.service.execute(payload.chunkSummaries);
      },
    });

    const summarizeSourceTask = await tasks.triggerAndWait<
      typeof SummarizeSourceContentTask
    >("summarize-source-content", {
      chunkSummaries: chunkSummaries,
    });

    if (!summarizeSourceTask.ok) {
      throw new Error("Failed to summarize source");
    }

    return summarizeSourceTask.output;
  }
}
