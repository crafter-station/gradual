import { service } from '@/core/services/container';
import { GenerateLessonStepsService } from '@/core/services/generate-lessons-steps.service';
import { SyllabusSchema } from '@/lib/schemas';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const generateLessonStepsTask = schemaTask({
  id: 'generate-lesson-steps-task',
  schema: z.object({
    lesson: z.object({
      id: z.string(),
      order: z.number(),
      title: z.string(),
      description: z.string(),
      type: z.enum(['LESSON', 'QUIZ', 'MULTISTEP']),
    }),
    syllabus: SyllabusSchema,
    sourceId: z.string(),
    unitOrder: z.number(),
    sectionOrder: z.number(),
    unitTitle: z.string(),
    sectionTitle: z.string(),
  }),
  run: async ({
    lesson,
    syllabus,
    sourceId,
    unitOrder,
    sectionOrder,
    unitTitle,
    sectionTitle,
  }) => {
    return await service(GenerateLessonStepsService).execute(
      lesson,
      syllabus,
      sourceId,
      unitOrder,
      sectionOrder,
      unitTitle,
      sectionTitle,
    );
  },
});
