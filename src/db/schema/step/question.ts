import { z } from 'zod';

// An evaluated step where we provide a question with a unique correct answer
export const QuestionStepContentSchema = z.object({
  type: z.literal('QUESTION'),
  questionBody: z.string(),
  correctAlternative: z.string(),
  correctAlternativeExplanation: z.string(),
  distractors: z.array(
    z.object({
      alternative: z.string(),
      explanation: z.string(),
    }),
  ),
});

export type QuestionStepContent = z.infer<typeof QuestionStepContentSchema>;
