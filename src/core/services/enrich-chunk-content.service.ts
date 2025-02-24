import { getEnrichChunkPrompt } from "@/lib/prompts";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export class EnrichChunkContentService {
  async execute(
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number
  ): Promise<{ enrichedContent: string }> {
    const enrichedContent = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: getEnrichChunkPrompt({
        chunk: rawContent,
        sourceSummary: sourceSummary,
        precedingChunkContent: precedingChunkContent,
        succeedingChunkContent: succeedingChunkContent,
        chunkSize: chunkSize,
      }),
    });

    return {
      enrichedContent: enrichedContent.text,
    };
  }
}
