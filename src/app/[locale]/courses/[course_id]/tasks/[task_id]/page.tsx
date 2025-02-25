import { db } from '@/db';

import { type SelectStep, taskProgress } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import {
  calculateEarnedExperiencePoints,
  getCurrentStep,
  getLastStep,
  getOrCreateStepProgress,
  getOrCreateTaskProgress,
} from './helpers';
import { ActiveIntroductionStep } from './introduction-step/active';
import { DoneIntroductionStep } from './introduction-step/done';
import { ActiveQuestionStep } from './question-step/active';
import { DoneQuestionStep } from './question-step/done';
import StatsCard from './stats';
import { submitStepAction } from './submit/action';
import { SubmitButton } from './submit/button';
import { Test } from './test';

type PageProps = {
  params: Promise<{ task_id: string; course_id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function TaskPage({ params }: Readonly<PageProps>) {
  const { task_id, course_id } = await params;
  const startedAt = new Date();

  const [currentUser, currentTask] = await Promise.all([
    db.query.user.findFirst(),
    db.query.task.findFirst({
      where: (task, { eq }) => eq(task.id, task_id),
      with: {
        module: {
          with: { unit: true },
        },
      },
    }),
  ]);

  if (!currentUser) return notFound();
  if (!currentTask) return notFound();

  // Get or create task progress
  let currentTaskProgress = await getOrCreateTaskProgress(
    currentUser.id,
    task_id,
    startedAt,
  );

  // Get current step
  const currentStep = await getCurrentStep(
    currentTask.id,
    currentTaskProgress.lastCompletedStepId,
  );

  // Get or create step progress
  const currentStepProgress = await getOrCreateStepProgress(
    currentUser.id,
    currentTask.id,
    currentTaskProgress.id,
    currentStep.id,
    startedAt,
  );

  // Get visible steps and their progress
  const [visibleSteps, stepsProgress] = await Promise.all([
    db.query.step.findMany({
      where: (step, { and, eq, lte }) =>
        and(
          eq(step.taskId, currentTask.id),
          lte(step.order, currentStep.order),
        ),
      orderBy: (step, { asc }) => asc(step.order),
    }) as unknown as SelectStep[],
    db.query.stepProgress.findMany({
      where: (stepProgress, { and, eq }) =>
        and(
          eq(stepProgress.taskId, currentTask.id),
          eq(stepProgress.userId, currentUser.id),
          eq(stepProgress.taskProgressId, currentTaskProgress.id),
        ),
      orderBy: (stepProgress, { asc }) => asc(stepProgress.startedAt),
    }),
  ]);

  const lastStep = await getLastStep(currentTask.id);
  const isLastStep = lastStep?.id === currentStep.id;

  let stats:
    | {
        incorrectQuestionsCount: number;
        questionsCount: number;
        time: number;
      }
    | undefined;

  if (isLastStep && currentStepProgress.completedAt) {
    stats = {
      incorrectQuestionsCount: visibleSteps.filter(
        (step) =>
          step.type === 'QUESTION' &&
          stepsProgress.find((progress) => progress.stepId === step.id)
            ?.isCorrect === false,
      ).length,
      time:
        currentStepProgress.completedAt.getTime() -
        currentTaskProgress.startedAt.getTime(),
      questionsCount: visibleSteps.filter((step) => step.type === 'QUESTION')
        .length,
    };

    const earnedExperiencePoints = calculateEarnedExperiencePoints(
      currentTask.experiencePoints,
      stats.incorrectQuestionsCount,
      stats.time,
    );

    if (
      !currentTaskProgress.completedAt ||
      !currentTaskProgress.earnedExperiencePoints
    ) {
      [currentTaskProgress] = await db
        .update(taskProgress)
        .set({
          completedAt: currentStepProgress.completedAt,
          earnedExperiencePoints,
        })
        .where(eq(taskProgress.id, currentTaskProgress.id))
        .returning();
    }
  }

  const lastVisibleStep = visibleSteps.slice(-1)[0];
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const lastVisibleStepProgress = stepsProgress.find(
    (progress) => progress.stepId === lastVisibleStep.id,
  )!;

  return (
    <div className="mt-2 flex flex-col">
      <h1 className="mt-2 text-center font-bold text-2xl">
        {currentTask.module.unit.order}.{currentTask.module.order}.
        {currentTask.order} {currentTask.title}
      </h1>

      <div
        id="done-steps-container"
        className="mx-auto flex max-w-2xl flex-col gap-4"
      >
        {visibleSteps.slice(0, -1).map((step, stepIndex) => {
          const stepProgress = stepsProgress.find(
            (progress) => progress.stepId === step.id,
          );

          if (!stepProgress?.completedAt) return null;

          if (step.type === 'INTRODUCTION') {
            return (
              <DoneIntroductionStep
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={currentTask.stepsCount}
              />
            );
          }

          if (
            step.type === 'QUESTION' &&
            stepProgress.state?.type === 'QUESTION'
          ) {
            return (
              <DoneQuestionStep
                id={step.id}
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={currentTask.stepsCount}
                progressState={stepProgress.state}
              />
            );
          }

          return <pre key={step.id}>{JSON.stringify(step, null, 2)}</pre>;
        })}

        <form action={submitStepAction}>
          <input type="hidden" name="taskId" value={task_id} />
          <input type="hidden" name="courseId" value={course_id} />

          {lastVisibleStep?.type === 'QUESTION' &&
            (lastVisibleStepProgress.state?.type === 'QUESTION' ? (
              <DoneQuestionStep
                id={lastVisibleStep.id}
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={visibleSteps.length}
                totalSteps={currentTask.stepsCount}
                progressState={lastVisibleStepProgress.state}
              />
            ) : (
              <ActiveQuestionStep
                id={lastVisibleStep.id}
                alternatives={[
                  lastVisibleStep.content.correctAlternative,
                  ...lastVisibleStep.content.distractors.map(
                    (distractor) => distractor.alternative,
                  ),
                ].sort(() => Math.random() - 0.5)}
                questionBody={lastVisibleStep.content.questionBody}
                stepOrder={visibleSteps.length}
                totalSteps={currentTask.stepsCount}
              />
            ))}
          {lastVisibleStep?.type === 'INTRODUCTION' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneIntroductionStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={visibleSteps.length}
                totalSteps={currentTask.stepsCount}
              />
            ) : (
              <ActiveIntroductionStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={visibleSteps.length}
                totalSteps={currentTask.stepsCount}
              />
            ))}
          {!['QUESTION', 'INTRODUCTION'].includes(
            lastVisibleStep?.type ?? '',
          ) && (
            <Test>
              <pre key={lastVisibleStep?.id}>
                {JSON.stringify(lastVisibleStep, null, 2)}
              </pre>
            </Test>
          )}
          <SubmitButton />
        </form>
      </div>

      {stats && (
        <StatsCard
          xp={currentTaskProgress.earnedExperiencePoints ?? 0}
          time={stats.time}
          precision={1 - stats.incorrectQuestionsCount / stats.questionsCount}
        />
      )}
    </div>
  );
}
