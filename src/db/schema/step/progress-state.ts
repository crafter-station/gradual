import { z } from 'zod';
import { BinaryQuestionStepProgressStateSchema } from './binary';
import { FillInTheBlankStepProgressStateSchema } from './fill-in-the-blank';
import { MultipleChoiceQuestionStepProgressStateSchema } from './multiple-choice';
import { QuestionStepProgressStateSchema } from './question';

export const StepProgressStateSchema = z.union([
  QuestionStepProgressStateSchema,
  BinaryQuestionStepProgressStateSchema,
  FillInTheBlankStepProgressStateSchema,
  MultipleChoiceQuestionStepProgressStateSchema,
]);

export type StepProgressState = z.infer<typeof StepProgressStateSchema>;
