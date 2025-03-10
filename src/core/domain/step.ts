export const INTRODUCTION_STEP_TYPE = 'INTRODUCTION';
export const DEFINITION_STEP_TYPE = 'DEFINITION';
export const ANALOGY_STEP_TYPE = 'ANALOGY';
export const TUTORIAL_STEP_TYPE = 'TUTORIAL';
export const SOLVED_EXERCISE_STEP_TYPE = 'SOLVED_EXERCISE';
export const FUN_FACT_STEP_TYPE = 'FUN_FACT';
export const QUOTE_STEP_TYPE = 'QUOTE';
export const FILL_IN_THE_BLANK_STEP_TYPE = 'FILL_IN_THE_BLANK';
export const MULTIPLE_CHOICE_STEP_TYPE = 'MULTIPLE_CHOICE';
export const BINARY_STEP_TYPE = 'BINARY';
export const QUESTION_STEP_TYPE = 'QUESTION';

export class Step {
  constructor(
    public readonly id: string,
    public readonly order: number,
    public readonly content: StepContent,
    public readonly type: StepType,
    public readonly taskId: string,
  ) {}
}

export interface IntroductionStepContent {
  type: 'INTRODUCTION';
  title: string;
  body: string;
}

export interface DefinitionStepContent {
  type: 'DEFINITION';
  term: string;
  definition: string;
}

export interface AnalogyStepContent {
  type: 'ANALOGY';
  title: string;
  body: string;
}

export interface TutorialStepContent {
  type: 'TUTORIAL';
  title: string;
  body: string;
}

export interface SolvedExerciseStepContent {
  type: 'SOLVED_EXERCISE';
  title: string;
  body: string;
  solution: string;
}

export interface FunFactStepContent {
  type: 'FUN_FACT';
  title: string;
  body: string;
}

export interface QuoteStepContent {
  type: 'QUOTE';
  body: string;
  author: string;
}

export interface QuestionStepContent {
  type: 'QUESTION';
  questionBody: string;
  correctAlternative: string;
  correctAlternativeExplanation: string;
  distractors: {
    alternative: string;
    explanation: string;
  }[];
}

export interface FillInTheBlankStepContent {
  type: 'FILL_IN_THE_BLANK';
  body: string;
  blanks: string[];
  distractors: string[];
}

export interface MultipleChoiceQuestionStepContent {
  type: 'MULTIPLE_CHOICE';
  questionBody: string;
  correctAlternatives: string[];
  distractors: string[];
  explanation: string;
}

export interface BinaryQuestionStepContent {
  type: 'BINARY';
  questionBody: string;
  correctAnswer: boolean;
  explanation: string;
}

export type StepContent =
  | IntroductionStepContent
  | DefinitionStepContent
  | AnalogyStepContent
  | TutorialStepContent
  | SolvedExerciseStepContent
  | FunFactStepContent
  | QuoteStepContent
  | QuestionStepContent
  | FillInTheBlankStepContent
  | MultipleChoiceQuestionStepContent
  | BinaryQuestionStepContent;

export type StepType =
  | 'INTRODUCTION'
  | 'DEFINITION'
  | 'ANALOGY'
  | 'TUTORIAL'
  | 'SOLVED_EXERCISE'
  | 'FUN_FACT'
  | 'QUOTE'
  | 'QUESTION'
  | 'FILL_IN_THE_BLANK'
  | 'MULTIPLE_CHOICE'
  | 'BINARY';
