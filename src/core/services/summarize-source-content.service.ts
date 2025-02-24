import { getSummarizeDocumentPrompt } from "@/lib/prompts";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export class SummarizeSourceContentService {
  async execute(chunkSummaries: string[]): Promise<{ summary: string }> {
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

    return {
      summary: documentSummary.text,
    };
  }
}
