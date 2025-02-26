import { service } from '@/core/services/container';
import { ParseSourceService } from '@/core/services/parse-source.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const parseSourceTask = schemaTask({
  id: 'parse-source',
  schema: z.object({
    url: z.string().url(),
  }),
  run: async (payload) => {
    return await service(ParseSourceService).execute(payload.url);
  },
});
