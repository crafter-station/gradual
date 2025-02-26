import { service } from '@/core/services/container';
import { SummarizeChunkContentService } from '@/core/services/summarize-chunk-content.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const summarizeChunkContentTask = schemaTask({
  id: 'summarize-chunk-content',
  schema: z.object({
    rawContent: z.string(),
    order: z.number(),
  }),
  run: async (payload) => {
    return await service(SummarizeChunkContentService).execute(
      payload.rawContent,
      payload.order,
    );
  },
});
