import { db } from '@/db';
import * as schema from '@/db/schema';
import type { AlternativeStep } from './alternative-step';

export class AlternativeStepRepo {
  async storeMany(alternativeSteps: AlternativeStep[]) {
    await db.insert(schema.alternativeStep).values(
      alternativeSteps.map((alternativeStep: AlternativeStep) => ({
        id: alternativeStep.id,
        type: alternativeStep.type,
        content: alternativeStep.content,
        stepId: alternativeStep.stepId,
      })),
    );
  }
}
