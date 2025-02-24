import { z } from 'zod';

// A step where we provide a solved exercise
export const SolvedExerciseStepContentSchema = z.object({
  type: z.literal('SOLVED_EXERCISE'),
  title: z.string(),
  body: z.string(),
  solution: z.string(),
});

export type SolvedExerciseStepContent = z.infer<
  typeof SolvedExerciseStepContentSchema
>;
