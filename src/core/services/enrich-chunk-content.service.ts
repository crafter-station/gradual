import { getEnrichChunkPrompt } from "@/lib/prompts";
import { openai } from "@ai-sdk/openai";
import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { generateText } from "ai";
import { z } from "zod";

export interface IEnrichChunkContentService {
  execute(
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number
  ): Promise<{ enrichedContent: string }>;
}

export class EnrichChunkContentService implements IEnrichChunkContentService {
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

export class EnrichChunkContentServiceTask
  implements IEnrichChunkContentService
{
  constructor(private service: EnrichChunkContentService) {}

  async execute(
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number
  ): Promise<{ enrichedContent: string }> {
    const EnrichChunkContentTask = schemaTask({
      id: "enrich-chunk-content",
      schema: z.object({
        rawContent: z.string(),
        sourceSummary: z.string(),
        precedingChunkContent: z.string().nullable(),
        succeedingChunkContent: z.string().nullable(),
      }),
      run: async (payload) => {
        return this.service.execute(
          payload.rawContent,
          payload.sourceSummary,
          payload.precedingChunkContent,
          payload.succeedingChunkContent,
          chunkSize
        );
      },
    });

    const enrichedChunkContent = await tasks.triggerAndWait<
      typeof EnrichChunkContentTask
    >("enrich-chunk-content", {
      rawContent: rawContent,
      sourceSummary: sourceSummary,
      precedingChunkContent: precedingChunkContent,
      succeedingChunkContent: succeedingChunkContent,
    });

    if (!enrichedChunkContent.ok) {
      throw new Error("Failed to enrich chunk!");
    }

    return {
      enrichedContent: enrichedChunkContent.output.enrichedContent,
    };
  }
}
