import { batch, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import type { IEnrichChunkContentService } from "./enrich-chunk-content.service";
import type { ISummarizeChunkContentService } from "./summarize-chunk-content.service";

export interface IEnrichChunksService {
  execute(
    chunks: {
      order: number;
      rawContent: string;
      sourceSummary: string;
      precedingChunkContent: string | null;
      succeedingChunkContent: string | null;
    }[],
    chunkSize: number
  ): Promise<
    {
      order: number;
      enrichedContent: string;
      enrichedSummary: string;
      rawContent: string;
    }[]
  >;
}

export class EnrichChunkService {
  constructor(
    private summarizeChunkContentService: ISummarizeChunkContentService,
    private enrichChunkContentService: IEnrichChunkContentService
  ) {}

  async execute(
    order: number,
    rawContent: string,
    sourceSummary: string,
    precedingChunkContent: string | null,
    succeedingChunkContent: string | null,
    chunkSize: number
  ): Promise<{
    order: number;
    enrichedContent: string;
    enrichedSummary: string;
  }> {
    const { enrichedContent } = await this.enrichChunkContentService.execute(
      rawContent,
      sourceSummary,
      precedingChunkContent,
      succeedingChunkContent,
      chunkSize
    );

    const { summary } = await this.summarizeChunkContentService.execute(
      enrichedContent,
      order
    );

    return {
      order: order,
      enrichedContent: enrichedContent,
      enrichedSummary: summary,
    };
  }
}

export class EnrichChunksServiceTask implements IEnrichChunksService {
  constructor(private service: EnrichChunkService) {}

  async execute(
    chunks: {
      order: number;
      rawContent: string;
      sourceSummary: string;
      precedingChunkContent: string | null;
      succeedingChunkContent: string | null;
    }[],
    chunkSize: number
  ): Promise<
    {
      order: number;
      enrichedContent: string;
      enrichedSummary: string;
      rawContent: string;
    }[]
  > {
    const EnrichChunkTask = schemaTask({
      id: "enrich-chunk",
      schema: z.object({
        order: z.number(),
        rawContent: z.string(),
        sourceSummary: z.string(),
        precedingChunkContent: z.string().nullable(),
        succeedingChunkContent: z.string().nullable(),
      }),
      run: async (payload) => {
        return await this.service.execute(
          payload.order,
          payload.rawContent,
          payload.sourceSummary,
          payload.precedingChunkContent,
          payload.succeedingChunkContent,
          chunkSize
        );
      },
    });

    const enrichedChunks: {
      order: number;
      enrichedContent: string;
      enrichedSummary: string;
      rawContent: string;
    }[] = [];

    const { runs: enrichChunksRuns } = await batch.triggerByTaskAndWait(
      chunks.map((chunk) => ({
        task: EnrichChunkTask,
        payload: {
          order: chunk.order,
          rawContent: chunk.rawContent,
          sourceSummary: chunk.sourceSummary,
          precedingChunkContent: chunk.precedingChunkContent,
          succeedingChunkContent: chunk.succeedingChunkContent,
        },
      }))
    );

    for (const run of enrichChunksRuns) {
      if (run.ok) {
        enrichedChunks.push({
          order: run.output.order,
          enrichedContent: run.output.enrichedContent,
          enrichedSummary: run.output.enrichedSummary,
          rawContent: "",
          // rawContent: summarizedChunks[run.output.order].rawContent,
        });
      }
    }

    return enrichedChunks;
  }
}
