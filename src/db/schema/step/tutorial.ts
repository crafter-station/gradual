import { z } from 'zod';

// A step where we go deeper into the concept
export const TutorialStepContentSchema = z.object({
  type: z.literal('TUTORIAL'),
  title: z.string(),
  body: z.string(),
});

export type TutorialStepContent = z.infer<typeof TutorialStepContentSchema>;
