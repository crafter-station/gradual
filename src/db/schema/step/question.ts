import { z } from 'zod';
import type { StepContent } from '.';

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

export const QuestionStepProgressStateSchema = z.object({
  type: z.literal('QUESTION'),
  selectedAlternative: z.string(),
});

export const example1: StepContent = {
  type: 'QUESTION',
  questionBody: 'What is the capital of France?',
  correctAlternative: 'Paris',
  correctAlternativeExplanation: 'Paris is the capital of France.',
  distractors: [
    {
      alternative: 'Rome',
      explanation: 'Rome is the capital of Italy, not France.',
    },
    {
      alternative: 'Marseille',
      explanation: 'Marseille is the capital of France, not Paris.',
    },
    {
      alternative: 'Lyon',
      explanation: 'Lyon is the capital of France, not Paris.',
    },
  ],
};

export const example2: StepContent = {
  type: 'QUESTION',
  questionBody: 'When was the Declaration of Independence signed?',
  correctAlternative: '1776',
  correctAlternativeExplanation:
    'The Declaration of Independence was signed in 1776 by the Continental Congress.',
  distractors: [
    {
      alternative: '1775',
      explanation:
        '1775 is the year the Declaration of Independence was proposed, but not signed.',
    },
    {
      alternative: '1789',
      explanation:
        '1789 is the year the French Revolution started, not the Declaration of Independence.',
    },
  ],
};
