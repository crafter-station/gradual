'use server';

import { db } from '@/db';
import { type SelectStep, stepProgress, taskProgress } from '@/db/schema';
import * as schema from '@/db/schema';
import type { StepProgressState } from '@/db/schema/step/progress-state';
import { currentUser } from '@clerk/nextjs/server';
import { and, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
export type SubmitStepForm = {
  taskId: string;
  courseId: string;
};

export async function submitStepAction(formData: FormData) {
  const form = Object.fromEntries(formData) as unknown as SubmitStepForm;

  try {
    const date = new Date();
    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const userId = user.privateMetadata.userId as string | undefined;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const { taskId, courseId } = z
      .object({
        taskId: z.string().uuid(),
        courseId: z.string().uuid(),
      })
      .parse(form);

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

    await db
      .update(stepProgress)
      .set({
        completedAt: date,
        isCorrect,
        state,
      })
      .where(eq(stepProgress.id, currentStepProgress.id));

    await db
      .update(taskProgress)
      .set({
        stepsCompletedCount: currentStep.order,
      })
      .where(eq(taskProgress.id, currentStepProgress.taskProgressId));

    revalidatePath(`/courses/${courseId}/tasks/${taskId}`);
  } catch (error) {
    console.log(error);
  }
}

function getData(currentStep: SelectStep, formData: FormData) {
  let isCorrect: boolean | undefined;
  let state: StepProgressState | undefined;
  let explanation: string | undefined;
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

        explanation = isCorrect
          ? currentStep.content.correctAlternativeExplanation
          : currentStep.content.distractors.find(
              (distractor) => distractor.alternative === selectedAlternative,
            )?.explanation;
      }
      break;
    case 'FILL_IN_THE_BLANK': {
      const filledBlanks = ['test1', 'test2'];

      state = {
        type: 'FILL_IN_THE_BLANK',
        filledBlanks,
      };

      isCorrect = filledBlanks.length === currentStep.content.blanks.length;
      if (isCorrect) {
        for (let i = 0; i < filledBlanks.length; i++) {
          if (filledBlanks[i] !== currentStep.content.blanks[i]) {
            isCorrect = false;
            break;
          }
        }
      }

      correctAlternative = currentStep.content.body;
      for (const blank of currentStep.content.blanks) {
        correctAlternative = correctAlternative.replace('____', blank);
      }
      break;
    }
    case 'MULTIPLE_CHOICE': {
      const selectedAlternatives = ['test1', 'test2'];

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

      explanation = currentStep.content.explanation;

      break;
    }
    case 'BINARY': {
      const selectedAnswer = true;

      state = {
        type: 'BINARY',
        selectedAnswer,
      };

      isCorrect = selectedAnswer === currentStep.content.correctAnswer;
      explanation = currentStep.content.explanation;

      break;
    }
    default:
      break;
  }

  return {
    state,
    isCorrect,
    explanation,
    correctAlternative,
  };
}
