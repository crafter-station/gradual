import { service } from '@/core/services/container';
import { CreateCourseService } from '@/core/services/create-course.service';
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
    syllabus: SyllabusSchema,
    courseEmbedding: EmbeddingSchema,
    unitEmbeddings: z.array(
      z.object({
        embedding: EmbeddingSchema,
        unitOrder: z.number(),
      }),
    ),
    sectionEmbeddings: z.array(
      z.object({
        embedding: EmbeddingSchema,
        sectionOrder: z.number(),
        unitOrder: z.number(),
      }),
    ),
    lessonEmbeddings: z.array(
      z.object({
        embedding: EmbeddingSchema,
        lessonOrder: z.number(),
        sectionOrder: z.number(),
        unitOrder: z.number(),
      }),
    ),
    userId: z.string(),
    sourceId: z.string(),
  }),
  run: async (payload) => {
    return await service(CreateCourseService).execute(
      payload.syllabus,
      payload.courseEmbedding,
      payload.unitEmbeddings,
      payload.sectionEmbeddings,
      payload.lessonEmbeddings,
      payload.userId,
      payload.sourceId,
    );
  },
});
