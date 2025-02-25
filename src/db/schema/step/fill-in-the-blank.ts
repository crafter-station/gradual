import { z } from 'zod';
import type { StepContent } from '.';

// An evaluated step where we provide a question with some blanks to fill
export const FillInTheBlankStepContentSchema = z.object({
  type: z.literal('FILL_IN_THE_BLANK'),
  body: z.string(),
  blanks: z.array(z.string()),
  distractors: z.array(z.string()),
});

export const FillInTheBlankStepProgressStateSchema = z.object({
  type: z.literal('FILL_IN_THE_BLANK'),
  filledBlanks: z.array(z.string()),
});

export const example1: StepContent = {
  type: 'FILL_IN_THE_BLANK',
  body: 'The capital of [0] is [1].',
  blanks: ['France', 'Paris'],
  distractors: ['London', 'Germany', 'Berlin', 'Spain', 'Italy', 'Portugal'],
};

export const example2: StepContent = {
  type: 'FILL_IN_THE_BLANK',
  body: 'A quadratic equation has [0] solutions',
  blanks: ['two'],
  distractors: ['one', 'three', 'four', 'many'],
};
