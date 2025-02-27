import { db } from '@/db';
import * as schema from '@/db/schema';
import type { Step } from './step';

export class StepRepo {
  async storeMany(steps: Step[]): Promise<void> {
    await db.insert(schema.step).values(
      steps.map((step) => ({
        id: step.id,
        order: step.order,
        content: step.content,
        type: step.type,
        taskId: step.taskId,
      })),
    );
  }
}
