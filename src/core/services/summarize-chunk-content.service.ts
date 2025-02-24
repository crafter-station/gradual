import { getSummarizeChunkPrompt } from "@/lib/prompts";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export class SummarizeChunkContentService {
  async execute(
    rawContent: string,
    order: number
  ): Promise<{ order: number; summary: string }> {
    const summary = await generateText({
      model: openai("o3-mini"),
      prompt: getSummarizeChunkPrompt({ chunk: rawContent }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: "summarize-chunk-content",
      },
    });

    return {
      order: order,
      summary: summary.text,
    };
  }
}
