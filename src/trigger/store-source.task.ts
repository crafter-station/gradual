import { service } from '@/core/services/container';
import { CreateSourceService } from '@/core/services/create-source.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const storeSourceTask = schemaTask({
  id: 'store-source',
  schema: z.object({
    url: z.string(),
    userId: z.string(),
    sourceSummary: z.string(),
    chunksCount: z.number(),
  }),

  run: async (payload) => {
    return await service(CreateSourceService).execute(
      payload.url,
      payload.userId,
      payload.sourceSummary,
      payload.chunksCount,
    );
  },
});
