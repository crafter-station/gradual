'use server';

import { db } from '@/db';
import { stepProgress, taskProgress } from '@/db/schema';
import type { ActionState } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import {
  getCurrentStep,
  getCurrentUser,
  getStepProgress,
  getTaskProgress,
} from './helpers';

export type CompleteExampleForm = {
  taskId: string;
};

type State = ActionState<CompleteExampleForm>;

export async function completeExampleAction(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const form = Object.fromEntries(formData) as unknown as CompleteExampleForm;
  console.log(form);

  try {
    const date = new Date();
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not found');
    }

    const { taskId } = z
      .object({
        taskId: z.string().uuid(),
      })

      .parse(form);

    const currentTaskProgress = await getTaskProgress(currentUser.id, taskId);

    if (!currentTaskProgress) {
      throw new Error('Task progress not found');
    }

    const currentStep = await getCurrentStep(
      taskId,
      currentTaskProgress.lastCompletedStepId,
    );

    const currentStepProgress = await getStepProgress(
      currentUser.id,
      taskId,
      currentTaskProgress.id,
      currentStep.id,
    );

    if (!currentStepProgress) {
      throw new Error('Step progress not found');
    }

    if (currentStepProgress.completedAt) {
      throw new Error('Step already completed');
    }

    if (currentStep.type !== 'EXAMPLE') {
      throw new Error('Step is not an example');
    }

    await db
      .update(stepProgress)
      .set({
        completedAt: date,
      })
      .where(eq(stepProgress.id, currentStepProgress.id));

    await db
      .update(taskProgress)
      .set({
        lastCompletedStepId: currentStep.id,
        stepsCompletedCount: currentTaskProgress.stepsCompletedCount + 1,
      })
      .where(eq(taskProgress.id, currentTaskProgress.id));

    return {
      success: true,
      form: {
        taskId,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      form,
    };
  }
}
