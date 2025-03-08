import type { StepContent } from '@/db/schema';

export class AlternativeStep {
  constructor(
    private readonly id: string,
    private readonly content: StepContent,
    private readonly stepId: string,
    // TODO: maybe add new fields
  ) {}
}
