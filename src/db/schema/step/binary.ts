import { z } from 'zod';

// An evaluated step where we provide a question with a binary correct answer
export const BinaryQuestionStepContentSchema = z.object({
  type: z.literal('BINARY'),
  questionBody: z.string(),
  correctAnswer: z.boolean(),
  explanation: z.string(),
});

export type BinaryQuestionStepContent = z.infer<
  typeof BinaryQuestionStepContentSchema
>;
