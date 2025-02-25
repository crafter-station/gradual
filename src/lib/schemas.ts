import { z } from 'zod';

export const SyllabusSchema = z.object({
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
export type Syllabus = typeof SyllabusSchema._type;
