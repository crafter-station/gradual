import type { Course } from '@/core/domain/course';
import type { Section } from '@/core/domain/section';
import type { Task } from '@/core/domain/task';
import type { Unit } from '@/core/domain/unit';
import { service } from '@/core/services/container';
import { StoreCourseService } from '@/core/services/store-course.service';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

const EmbeddingSchema = z.array(z.number());

// Define the Syllabus schema according to your interface
const SyllabusSchema = z.object({
  title: z.string(),
  description: z.string(),
  units: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      sections: z.array(
        z.object({
          order: z.number(),
          title: z.string(),
          description: z.string(),
          lessons: z.array(
            z.object({
              order: z.number(),
              title: z.string(),
              description: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export const storeSyllabusTask = schemaTask({
  id: 'store-syllabus',
  schema: z.object({
    course: z.any(),
    units: z.array(z.any()),
    sections: z.array(z.any()),
    tasks: z.array(z.any()),
    sourceId: z.string(),
  }),
  run: async (payload) => {
    return await service(StoreCourseService).execute(
      payload.course as Course,
      payload.units as Unit[],
      payload.sections as Section[],
      payload.tasks as Task[],
      payload.sourceId,
    );
  },
});
