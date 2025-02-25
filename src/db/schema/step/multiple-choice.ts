import { z } from 'zod';
import type { StepContent } from '.';

// An evaluated step where we provide a question with multiple choices
export const MultipleChoiceQuestionStepContentSchema = z.object({
  type: z.literal('MULTIPLE_CHOICE'),
  questionBody: z.string(),
  correctAlternatives: z.array(z.string()),
  distractors: z.array(z.string()),
  explanation: z.string(),
});

export const MultipleChoiceQuestionStepProgressStateSchema = z.object({
  type: z.literal('MULTIPLE_CHOICE'),
  selectedAlternatives: z.array(z.string()),
});

export const example1: StepContent = {
  type: 'MULTIPLE_CHOICE',
  questionBody: 'Which of the following are cities in France?',
  correctAlternatives: ['Paris', 'Nantes', 'Bordeaux'],
  distractors: ['London', 'Rome', 'Marseille'],
  explanation:
    'Paris is the capital of France, Nantes is a city in France, and Bordeaux is a city in France.',
};

export const example2: StepContent = {
  type: 'MULTIPLE_CHOICE',
  questionBody: 'Which of the following options are true about Python?',
  correctAlternatives: [
    'Python is a dynamically typed language',
    'Python uses indentation for code blocks',
  ],
  distractors: [
    'Python requires semicolons at the end of statements',
    'All variables in Python must be declared before use',
    'Python supports multiple inheritance',
    'Python arrays are immutable by default',
  ],
  explanation:
    'Python is a dynamically typed language, uses indentation for code blocks, and arrays are mutable by default.',
};
