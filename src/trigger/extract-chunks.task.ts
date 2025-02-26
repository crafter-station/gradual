import { extractChunkTexts } from '@/core/services/extract-chunks-texts';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const _extractChunkTextsTask = schemaTask({
  id: 'chunkenize-source-content',
  schema: z.object({
    content: z.string(),
    chunkSize: z.number(),
  }),
  run: async (payload) => {
    return extractChunkTexts(payload.content, payload.chunkSize);
  },
});
