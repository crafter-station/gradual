import { z } from 'zod';
import { BinaryQuestionStepProgressStateSchema } from '../step/binary';
import { FillInTheBlankStepProgressStateSchema } from '../step/fill-in-the-blank';
import { MultipleChoiceQuestionStepProgressStateSchema } from '../step/multiple-choice';
import { QuestionStepProgressStateSchema } from '../step/question';

export const StepProgressStateSchema = z.union([
  QuestionStepProgressStateSchema,
  BinaryQuestionStepProgressStateSchema,
  FillInTheBlankStepProgressStateSchema,
  MultipleChoiceQuestionStepProgressStateSchema,
]);

export type StepProgressState = z.infer<typeof StepProgressStateSchema>;
