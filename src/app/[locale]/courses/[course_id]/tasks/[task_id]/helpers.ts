import { db } from '@/db';
import { type SelectStep, stepProgress, taskProgress } from '@/db/schema';

export async function getTaskProgress(userId: string, taskId: string) {
  const progress = await db.query.taskProgress.findFirst({
    where: (taskProgress, { and, eq }) =>
      and(eq(taskProgress.userId, userId), eq(taskProgress.taskId, taskId)),
  });

  return progress;
}

export async function getOrCreateTaskProgress(
  userId: string,
  taskId: string,
  startedAt: Date,
) {
  let progress = await getTaskProgress(userId, taskId);

  if (!progress) {
    [progress] = await db
      .insert(taskProgress)
      .values({
        userId: userId,
        taskId: taskId,
        startedAt,
      })
      .returning();
  }

  return progress;
}

export async function getLastStep(taskId: string) {
  const lastStep = await db.query.step.findFirst({
    where: (step, { eq }) => eq(step.taskId, taskId),
    orderBy: (step, { desc }) => desc(step.order),
  });
  return lastStep;
}

export async function getCurrentStep(
  taskId: string,
  lastCompletedStepId: string | null,
) {
  let step: SelectStep | undefined;
  if (lastCompletedStepId) {
    const lastCompletedStep = await db.query.step.findFirst({
      where: (step, { eq }) => eq(step.id, lastCompletedStepId),
    });

    // TODO: Handle this
    if (!lastCompletedStep) throw new Error('Last completed step not found');

    step = (await db.query.step.findFirst({
      where: (step, { and, eq }) =>
        and(
          eq(step.order, lastCompletedStep.order + 1),
          eq(step.taskId, taskId),
        ),
    })) as SelectStep | undefined;

    if (!step) {
      const lastStep = await getLastStep(taskId);

      if (lastStep?.id === lastCompletedStep.id) {
        step = lastStep as SelectStep;
      }
    }
  } else {
    step = (await db.query.step.findFirst({
      where: (step, { eq }) => eq(step.taskId, taskId),
      orderBy: (step, { asc }) => asc(step.order),
    })) as SelectStep | undefined;
  }
  // TODO: Handle this
  if (!step) throw new Error('No step found');

  return step;
}

export async function getStepProgress(
  userId: string,
  taskId: string,
  taskProgressId: string,
  stepId: string,
) {
  const progress = await db.query.stepProgress.findFirst({
    where: (stepProgress, { and, eq }) =>
      and(
        eq(stepProgress.taskId, taskId),
        eq(stepProgress.userId, userId),
        eq(stepProgress.taskProgressId, taskProgressId),
        eq(stepProgress.stepId, stepId),
      ),
  });

  return progress;
}

export async function getOrCreateStepProgress(
  userId: string,
  taskId: string,

  taskProgressId: string,

  stepId: string,
  startedAt: Date,
) {
  let progress = await getStepProgress(userId, taskId, taskProgressId, stepId);

  if (!progress) {
    [progress] = await db
      .insert(stepProgress)
      .values({
        taskId: taskId,
        userId: userId,
        taskProgressId: taskProgressId,
        stepId: stepId,
        startedAt,
      })
      .returning();
  }

  return progress;
}

export function calculateEarnedExperiencePoints(
  baseExperiencePoints: number,
  incorrectQuestionsCount: number,
  time: number,
) {
  let earnedExperiencePoints = 0;

  if (incorrectQuestionsCount > 3) {
    return earnedExperiencePoints;
  }

  earnedExperiencePoints = baseExperiencePoints;

  if (incorrectQuestionsCount === 0) {
    earnedExperiencePoints += 2;

    const timeThresholds = [
      1000 * 60 * 6, // 6 minutes
      1000 * 60 * 4, // 4 minutes
      1000 * 60 * 2, // 2 minutes
    ];

    for (const threshold of timeThresholds) {
      if (time < threshold) {
        earnedExperiencePoints += 1;
      }
    }
  }

  return earnedExperiencePoints;
}
