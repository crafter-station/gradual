import { db } from '@/db';
import { type SelectStep, taskProgress } from '@/db/schema';
import { sql } from 'drizzle-orm';

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
  return lastStep as unknown as SelectStep | undefined;
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
        step = lastStep;
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

export const getFullTask = db.query.task
  .findFirst({
    where: (task, { eq }) => eq(task.id, sql.placeholder('taskId')),
    with: {
      section: {
        with: {
          unit: true,
        },
      },
    },
  })
  .prepare('getFullTask');

export const getTask = db.query.task
  .findFirst({
    where: (task, { eq }) => eq(task.id, sql.placeholder('taskId')),
  })
  .prepare('getTask');

export const getSection = db.query.section
  .findFirst({
    where: (section, { eq }) => eq(section.id, sql.placeholder('sectionId')),
  })
  .prepare('getSection');

export const getUnit = db.query.unit
  .findFirst({
    where: (unit, { eq }) => eq(unit.id, sql.placeholder('unitId')),
  })
  .prepare('getUnit');

export const getVisibleSteps = db.query.step
  .findMany({
    where: (step, { and, eq, lte }) =>
      and(
        eq(step.taskId, sql.placeholder('taskId')),
        lte(step.order, sql.placeholder('lastStepOrder')),
      ),
    orderBy: (step, { asc }) => asc(step.order),
  })
  .prepare('getVisibleSteps');

export const getTaskStepsProgress = db.query.stepProgress
  .findMany({
    where: (stepProgress, { eq }) =>
      eq(stepProgress.taskProgressId, sql.placeholder('taskProgressId')),
    orderBy: (stepProgress, { asc }) => asc(stepProgress.startedAt),
  })
  .prepare('getTaskStepsProgress');
