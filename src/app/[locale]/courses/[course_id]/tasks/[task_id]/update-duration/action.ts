'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

export type UpdateDurationForm = {
  stepId: string;
  taskId: string;
  partial?: string;
};

export async function updateDurationAction(formData: FormData) {
  const form = Object.fromEntries(formData) as unknown as UpdateDurationForm;

  try {
    const now = new Date();

    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const userId = user.privateMetadata.userId as string | undefined;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const stepId = z.string().uuid().parse(form.stepId);
    const taskId = z.string().uuid().parse(form.taskId);

    const [currentStepProgress] = await db
      .select()
      .from(schema.stepProgress)
      .where(
        and(
          eq(schema.stepProgress.stepId, stepId),
          eq(schema.stepProgress.userId, userId),
        ),
      )
      .limit(1);

    if (!currentStepProgress) {
      throw new Error('Step progress not found');
    }

    if (currentStepProgress.completedAt) {
      throw new Error('Step already completed');
    }

    const timeSinceLastUpdate =
      now.getTime() - currentStepProgress.updatedAt.getTime();

    if (timeSinceLastUpdate > 3.5 * 1000) {
      // 2 seconds buffer
      await db.transaction(async (tx) => {
        await Promise.all([
          tx
            .update(schema.step)
            .set({
              totalResponseDuration: sql`${schema.step.totalResponseDuration} + 5`,
            })
            .where(eq(schema.step.id, currentStepProgress.stepId)),

          tx
            .update(schema.stepProgress)
            .set({
              responseDuration: sql`${schema.stepProgress.responseDuration} + 5`,
              updatedAt: now,
            })
            .where(
              and(
                eq(schema.stepProgress.stepId, currentStepProgress.stepId),
                eq(schema.stepProgress.userId, userId),
              ),
            ),

          tx
            .update(schema.taskProgress)
            .set({
              totalResponseDuration: sql`${schema.taskProgress.totalResponseDuration} + 5`,
            })
            .where(
              and(
                eq(schema.taskProgress.userId, userId),
                eq(schema.taskProgress.taskId, taskId),
              ),
            ),
        ]);
      });
    }
  } catch (error) {
    console.error(error);
  }
}
