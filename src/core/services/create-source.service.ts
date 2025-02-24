import { schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { Source } from "../domain/source";
import type { SourceRepo } from "../domain/source-repo";
import { createSingleEmbedding } from "./create-embedding";

export interface ICreateSourceService {
  execute(
    url: string,
    userId: string,
    sourceSummary: string,
    chunksCount: number
  ): Promise<Source>;
}

export class CreateSourceService implements ICreateSourceService {
  constructor(private sourceRepo: SourceRepo) {}

  async execute(
    url: string,
    userId: string,
    sourceSummary: string,
    chunksCount: number
  ): Promise<Source> {
    const sourceEmbedding = await createSingleEmbedding(sourceSummary);

    const source = new Source(
      "",
      "URL",
      url,
      userId,
      sourceSummary,
      sourceEmbedding.embedding,
      chunksCount
    );

    const id = await this.sourceRepo.store(source);
    source.changeId(id);

    return source;
  }
}

export class CreateSourceServiceTask implements ICreateSourceService {
  constructor(private service: ICreateSourceService) {}

  async execute(
    url: string,
    userId: string,
    sourceSummary: string,
    chunksCount: number
  ): Promise<Source> {
    const StoreSourceTask = schemaTask({
      id: "store-source",
      schema: z.object({
        url: z.string(),
        userId: z.string(),
        sourceSummary: z.string(),
        chunksCount: z.number(),
      }),

      run: async (payload) => {
        return await this.service.execute(
          payload.url,
          payload.userId,
          payload.sourceSummary,
          payload.chunksCount
        );
      },
    });

    const storeSourceRun = await tasks.triggerAndWait<typeof StoreSourceTask>(
      "store-source",
      {
        url: url,
        userId: userId,
        sourceSummary,
        chunksCount: chunksCount,
      }
    );

    if (!storeSourceRun.ok) {
      throw new Error("Failed to store source");
    }

    return storeSourceRun.output;
  }
}
