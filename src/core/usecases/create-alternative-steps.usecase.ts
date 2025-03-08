import { z } from 'zod';
import type { AIGenerator } from '@/core/domain/aigen';
import type { AlternativeStepRepo } from '@/core/domain/alternative-step-repo';
import {
  QUESTION_STEP_TYPE,
  type QuestionStepContent,
  type Step,
} from '@/core/domain/step';
import type { StepRepo } from '@/core/domain/step-repo';
import { AlternativeStep } from '../domain/alternative-step';
import { v4 as uuidv4 } from 'uuid';
import { generateAlternativesWithRatingPromptForQuestionStep } from '@/lib/prompts/generate-alternative-steps';

export interface CreateAlternativeStepsUseCaseResp {
  rating: string;
  alternativeSteps: AlternativeStep[];
}

export class CreateAlternativeStepsUseCase {
  constructor(
    private stepRepo: StepRepo,
    private alternativeStepRepo: AlternativeStepRepo,
    private aiGenerator: AIGenerator,
  ) {}

  async execute(
    originalStepId: string,
    answeredSeconds: number,
    answer: string,
  ): Promise<CreateAlternativeStepsUseCaseResp> {
    const step = await this.stepRepo.findById(originalStepId);
    if (step === null) {
      throw new Error('Step not found');
    }

    switch (step.type) {
      case QUESTION_STEP_TYPE:
        return await this.handleQuestionStep(step, answeredSeconds, answer);
    }

    throw new Error('Not supported yet');
  }

  async handleQuestionStep(
    step: Step,
    answeredSeconds: number,
    answer: string,
  ): Promise<CreateAlternativeStepsUseCaseResp> {
    const content = step.content as QuestionStepContent;

    const aiResponse = await this.aiGenerator.generateObject({
      model: 'o3-mini',
      prompt: generateAlternativesWithRatingPromptForQuestionStep(
        content.correctAlternative === answer,
        answeredSeconds,
        step,
      ),
      schema: z.object({
        rating: z.string(),
        contents: z.array(
          z.object({
            type: z.literal(QUESTION_STEP_TYPE),
            questionBody: z.string(),
            correctAlternative: z.string(),
            correctAlternativeExplanation: z.string(),
            distractors: z.array(
              z.object({
                alternative: z.string(),
                explanation: z.string(),
              }),
            ),
          }),
        ),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'generate-alternative-steps',
      },
    });

    const alternativeSteps: AlternativeStep[] = [];
    for (const content of aiResponse.contents) {
      alternativeSteps.push(
        new AlternativeStep(uuidv4(), QUESTION_STEP_TYPE, content, step.id),
      );
    }

    await this.alternativeStepRepo.storeMany(alternativeSteps);

    return {
      rating: aiResponse.rating,
      alternativeSteps,
    };
  }
}
