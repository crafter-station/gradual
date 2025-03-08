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
  ): Promise<{ rating: string; alternativeSteps: AlternativeStep[] }> {
    const step = await this.stepRepo.findById(originalStepId);
    if (step === null) {
      throw new Error('Step not found');
    }

    if (step.type === QUESTION_STEP_TYPE) {
      const content = step.content as QuestionStepContent;
      const prompt = this.promptToGenerateNewAlternatives(
        content.correctAlternative === answer,
        answeredSeconds,
        step,
      );

      // TODO: refactor schema to a constant
      const aiResponse = await this.aiGenerator.generateObject({
        model: 'o3-mini',
        prompt: prompt,
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
          new AlternativeStep(uuidv4(), content, originalStepId),
        );
      }

      await this.alternativeStepRepo.storeMany(alternativeSteps);

      // TODO: store rating into the answered question by the user

      return {
        rating: aiResponse.rating,
        alternativeSteps,
      };
    }

    throw new Error('Not supported yet');
  }

  private promptToGenerateNewAlternatives(
    hasAnsweredOk: boolean,
    answeredSeconds: number,
    step: Step,
  ): string {
    // TODO: add prompt
    return '';
  }
}
