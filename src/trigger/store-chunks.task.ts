import { service } from '@/core/services/container';
import { CreateChunksService } from '@/core/services/create-chunks.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const storeChunksTask = schemaTask({
  id: 'store-chunks',
  schema: z.object({
    sourceId: z.string(),
    chunks: z.array(
      z.object({
        order: z.number(),
        rawContent: z.string(),
        summary: z.string(),
        enrichedContent: z.string(),
      }),
    ),
  }),
  run: async (payload) => {
    return await service(CreateChunksService).execute(
      payload.sourceId,
      payload.chunks,
    );
  },
});
