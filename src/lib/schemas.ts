import { z } from 'zod';

export const SyllabusSchema = z.object({
  title: z.string(),
  description: z.string(),
  units: z.array(
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      modules: z.array(
        z.object({
          order: z.number(),
          title: z.string(),
          description: z.string(),
          topics: z.array(
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
