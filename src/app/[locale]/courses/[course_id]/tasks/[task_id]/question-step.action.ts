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

export type SubmitAnswerForm = {
  taskId: string;
  selectedAlternativeOrder: number;
};

export type SubmitAnswerData = {
  isCorrect: boolean;
  explanation: string;
};

type State = ActionState<SubmitAnswerForm, SubmitAnswerData>;

export async function submitAnswerAction(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const form = Object.fromEntries(formData) as unknown as SubmitAnswerForm;
  console.log(form);
  try {
    const date = new Date();
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('User not found');
    }

    const { taskId, selectedAlternativeOrder } = z
      .object({
        taskId: z.string().uuid(),
        selectedAlternativeOrder: z.coerce.number(),
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

    if (currentStep.type !== 'QUESTION') {
      throw new Error('Step is not a question');
    }

    await db
      .update(stepProgress)
      .set({
        completedAt: date,
        isCorrect:
          selectedAlternativeOrder ===
          currentStep.content.correctAlternativeOrder,
        selectedAlternativeOrder,
      })

      .where(eq(stepProgress.id, currentStepProgress.id));

    await db
      .update(taskProgress)
      .set({
        lastCompletedStepId: currentStep.id,
        stepsCompletedCount: currentTaskProgress.stepsCompletedCount + 1,
      })
      .where(eq(taskProgress.id, currentTaskProgress.id));

    const explanation = currentStep.content.alternatives.find(
      (alternative) => alternative.order === selectedAlternativeOrder,
    )?.explanation;

    if (!explanation) {
      throw new Error('Explanation not found');
    }

    return {
      success: true,
      form: {
        taskId,
        selectedAlternativeOrder,
      },

      data: {
        isCorrect:
          selectedAlternativeOrder ===
          currentStep.content.correctAlternativeOrder,
        explanation,
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
