import type {
  BinaryQuestionStepContent,
  FillInTheBlankStepContent,
  MultipleChoiceQuestionStepContent,
  QuestionStepContent,
} from './step';

export type AlternativeStepContent =
  | QuestionStepContent
  | FillInTheBlankStepContent
  | MultipleChoiceQuestionStepContent
  | BinaryQuestionStepContent;

export type AlternativeStepType =
  | 'QUESTION'
  | 'FILL_IN_THE_BLANK'
  | 'MULTIPLE_CHOICE'
  | 'BINARY';

export class AlternativeStep {
  constructor(
    public readonly id: string,
    public readonly type: AlternativeStepType,
    public readonly content: AlternativeStepContent,
    public readonly stepId: string,
  ) {}
}
