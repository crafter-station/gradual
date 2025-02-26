import { service } from '@/core/services/container';
import { GenerateSyllabusEmbeddingsServiceTask } from '@/core/services/generate-syllabus-embeddings.service';
import { SyllabusSchema } from '@/lib/schemas';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const generateSyllabusEmbeddingsTask = schemaTask({
  id: 'generate-syllabus-embeddings',
  schema: z.object({
    syllabus: SyllabusSchema,
  }),
  run: async (payload) => {
    return await service(GenerateSyllabusEmbeddingsServiceTask).execute(
      payload.syllabus,
    );
  },
});
