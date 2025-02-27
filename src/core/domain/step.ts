import type { StepContent } from '@/db/schema';

export class Step {
  constructor(
    public readonly id: string,
    public readonly order: number,
    public readonly content: StepContent,
    public readonly type:
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
      | 'BINARY',
    public readonly taskId: string,
  ) {}
}
