import { z } from 'zod';

// An evaluated step where we provide a question with some blanks to fill
export const FillInTheBlankStepContentSchema = z.object({
  type: z.literal('FILL_IN_THE_BLANK'),
  body: z.string(),
  blanks: z.array(z.string()),
  distractors: z.array(z.string()),
});

export type FillInTheBlankStepContent = z.infer<
  typeof FillInTheBlankStepContentSchema
>;
