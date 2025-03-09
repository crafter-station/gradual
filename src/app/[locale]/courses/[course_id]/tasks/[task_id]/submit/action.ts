'use server';

import { db } from '@/db';
import type { SelectStep, StepProgressState } from '@/db/schema';
import * as schema from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, desc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type SubmitStepForm = {
  taskId: string;
};

export async function submitStepAction(formData: FormData) {
  const form = Object.fromEntries(formData) as unknown as SubmitStepForm;

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

    const taskId = z.string().uuid().parse(form.taskId);

    const [task] = await db
      .select()
      .from(schema.task)
      .where(eq(schema.task.id, taskId))
      .limit(1);

    if (!task) {
      throw new Error('Task not found');
    }

    const [currentStepProgress] = await db
      .select()
      .from(schema.stepProgress)
      .where(
        and(
          eq(schema.stepProgress.taskId, taskId),
          eq(schema.stepProgress.userId, userId),
        ),
      )
      .orderBy(desc(schema.stepProgress.startedAt))
      .limit(1);

    if (!currentStepProgress) {
      throw new Error('Step progress not found');
    }

    if (currentStepProgress.completedAt) {
      throw new Error('Step already completed');
    }

    const [currentStep] = await db
      .select()
      .from(schema.step)
      .where(eq(schema.step.id, currentStepProgress.stepId))
      .limit(1);

    if (!currentStep) {
      throw new Error('Step not found');
    }

    const { isCorrect, state } = getData(currentStep as SelectStep, formData);

    console.log(isCorrect, state);

    await db
      .update(schema.stepProgress)
      .set({
        completedAt: now,
        isCorrect,
        state,
      })
      .where(eq(schema.stepProgress.id, currentStepProgress.id));

    if (task.stepsCount === currentStep.order) {
      await db
        .update(schema.enrollment)
        .set({ completedTasks: sql`${schema.enrollment.completedTasks} + 1` })
        .where(
          and(
            eq(schema.enrollment.userId, userId),
            eq(schema.enrollment.courseId, task.courseId),
          ),
        );
    }

    await db
      .update(schema.taskProgress)
      .set({
        stepsCompletedCount: currentStep.order,
        incorrectStepsCount:
          isCorrect === false
            ? sql`${schema.taskProgress.incorrectStepsCount} + 1`
            : undefined,
        completedAt: task.stepsCount === currentStep.order ? now : undefined,
        earnedExperiencePoints:
          task.stepsCount === currentStep.order
            ? sql`GREATEST(${task.experiencePoints} - ${schema.taskProgress.incorrectStepsCount} * 2 - ${isCorrect === false ? 2 : 0}, 0)`
            : undefined,
      })
      .where(eq(schema.taskProgress.id, currentStepProgress.taskProgressId));

    revalidatePath(`/courses/${task.courseId}/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
  }
}

function getData(currentStep: SelectStep, formData: FormData) {
  let isCorrect: boolean | undefined;
  let state: StepProgressState | undefined;
  let correctAlternative: string | undefined;

  switch (currentStep.type) {
    case 'QUESTION':
      {
        const selectedAlternative = z
          .string()
          .parse(formData.get('selectedAlternative'));

        state = {
          type: 'QUESTION',
          selectedAlternative,
        };
        correctAlternative = currentStep.content.correctAlternative;

        isCorrect = correctAlternative === selectedAlternative;
      }
      break;
    case 'FILL_IN_THE_BLANK': {
      const filledBlanks = z
        .array(z.string())
        .parse(formData.getAll('filledBlanks'));

      console.log(filledBlanks);

      state = {
        type: 'FILL_IN_THE_BLANK',
        filledBlanks,
      };

      const correctBlanks = currentStep.content.blanks.join(',');

      isCorrect = filledBlanks.join(',') === correctBlanks;

      break;
    }
    case 'MULTIPLE_CHOICE': {
      const selectedAlternatives = z
        .array(z.string())
        .parse(formData.getAll('selectedAlternatives'));

      state = {
        type: 'MULTIPLE_CHOICE',
        selectedAlternatives,
      };

      isCorrect =
        selectedAlternatives
          .toSorted((a, b) => a.localeCompare(b))
          .join(',') ===
        currentStep.content.correctAlternatives
          .toSorted((a, b) => a.localeCompare(b))
          .join(',');

      break;
    }
    case 'BINARY': {
      const _selectedAnswer = z
        .enum(['true', 'false'])
        .parse(formData.getAll('selectedAnswer')[0]);

      const selectedAnswer = _selectedAnswer === 'true';

      state = {
        type: 'BINARY',
        selectedAnswer,
      };

      isCorrect = selectedAnswer === currentStep.content.correctAnswer;

      break;
    }
    default:
      break;
  }

  return {
    state,
    isCorrect,
    correctAlternative,
  };
}
