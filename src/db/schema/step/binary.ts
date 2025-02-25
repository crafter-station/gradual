import { z } from 'zod';
import type { StepContent } from '.';

// An evaluated step where we provide a question with a binary correct answer
export const BinaryQuestionStepContentSchema = z.object({
  type: z.literal('BINARY'),
  questionBody: z.string(),
  correctAnswer: z.boolean(),
  explanation: z.string(),
});

export const BinaryQuestionStepProgressStateSchema = z.object({
  type: z.literal('BINARY'),
  selectedAnswer: z.boolean(),
});

export const example1: StepContent = {
  type: 'BINARY',
  questionBody: 'Is Python a statically typed language?',
  correctAnswer: true,
  explanation:
    'Python is a dynamically typed language, not a statically typed language.',
};

export const example2: StepContent = {
  type: 'BINARY',
  questionBody: 'Is New York City the capital of the United States?',
  correctAnswer: false,
  explanation:
    'New York City is not the capital of the United States, the capital is Washington D.C.',
};
