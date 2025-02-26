import { service } from '@/core/services/container';
import { GenerateCourseSyllabusService } from '@/core/services/generate-course-syllabus.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const generateCourseSyllabusTask = schemaTask({
  id: 'generate-course-syllabus',
  schema: z.object({
    documentSummary: z.string(),
    documentChunksSummaries: z.array(z.string()),
    contentSize: z.enum(['small', 'medium', 'large']),
  }),
  run: async (payload) => {
    return await service(GenerateCourseSyllabusService).execute(
      payload.documentSummary,
      payload.documentChunksSummaries,
      payload.contentSize,
    );
  },
  retry: {
    maxAttempts: 3,
  },
});
