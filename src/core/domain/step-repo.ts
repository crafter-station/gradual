import { db } from '@/db';
import * as schema from '@/db/schema';
import { Step } from './step';
import { eq } from 'drizzle-orm';

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

  async findById(id: string): Promise<Step | null> {
    const existing = await db
      .select()
      .from(schema.step)
      .where(eq(schema.step.id, id));

    if (existing.length === 0) {
      return null;
    }

    return new Step(
      existing[0].id,
      existing[0].order,
      existing[0].content,
      existing[0].type,
      existing[0].taskId,
    );
  }
}
