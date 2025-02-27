import { service } from '@/core/services/container';
import { SummarizeSourceContentService } from '@/core/services/summarize-source-content.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const summarizeSourceContentTask = schemaTask({
  id: 'summarize-source-content',
  schema: z.object({
    chunkSummaries: z.array(z.string()),
  }),
  run: async (payload) => {
    return await service(SummarizeSourceContentService).execute(
      payload.chunkSummaries,
    );
  },
});
