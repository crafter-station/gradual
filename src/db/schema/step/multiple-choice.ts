import { z } from 'zod';

// An evaluated step where we provide a question with multiple choices
export const MultipleChoiceQuestionStepContentSchema = z.object({
  type: z.literal('MULTIPLE_CHOICE'),
  questionBody: z.string(),
  correctAlternatives: z.array(z.string()),
  distractors: z.array(z.string()),
  explanation: z.string(),
});

export type MultipleChoiceQuestionStepContent = z.infer<
  typeof MultipleChoiceQuestionStepContentSchema
>;
