import { z } from 'zod';

// A step where we provide an analogy to help the user understand the concept
export const AnalogyStepContentSchema = z.object({
  type: z.literal('ANALOGY'),
  title: z.string(),
  body: z.string(),
});

export type AnalogyStepContent = z.infer<typeof AnalogyStepContentSchema>;
