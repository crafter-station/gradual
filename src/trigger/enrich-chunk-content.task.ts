import { service } from '@/core/services/container';
import { EnrichChunkContentService } from '@/core/services/enrich-chunk-content.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const enrichChunkContentTask = schemaTask({
  id: 'enrich-chunk-content',
  schema: z.object({
    rawContent: z.string(),
    sourceSummary: z.string(),
    precedingChunkContent: z.string().nullable(),
    succeedingChunkContent: z.string().nullable(),
    chunkSize: z.number(),
  }),
  run: async (payload) => {
    return service(EnrichChunkContentService).execute(
      payload.rawContent,
      payload.sourceSummary,
      payload.precedingChunkContent,
      payload.succeedingChunkContent,
      payload.chunkSize,
    );
  },
});
