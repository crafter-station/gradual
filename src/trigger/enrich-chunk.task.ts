import { service } from '@/core/services/container';
import { EnrichChunkService } from '@/core/services/enrich-chunk.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const enrichChunkTask = schemaTask({
  id: 'enrich-chunk',
  schema: z.object({
    order: z.number(),
    rawContent: z.string(),
    sourceSummary: z.string(),
    precedingChunkContent: z.string().nullable(),
    succeedingChunkContent: z.string().nullable(),
    chunkSize: z.number(),
  }),
  run: async (payload) => {
    return await service(EnrichChunkService).execute(
      payload.order,
      payload.rawContent,
      payload.sourceSummary,
      payload.precedingChunkContent,
      payload.succeedingChunkContent,
      payload.chunkSize,
    );
  },
});
