import { useCase } from '@/core/usecases/container';
import { CreateCourseUseCase } from '@/core/usecases/create-course.usecase';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const CreateCourseTask = schemaTask({
  id: 'create-course',
  schema: z.object({
    url: z.string().url(),
    userId: z.string().uuid(),
  }),
  run: async (payload) => {
    return await useCase(CreateCourseUseCase).execute(payload);
  },
});
