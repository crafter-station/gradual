import { db } from '@/db';

import {
  type SelectStep,
  stepProgress,
  steps,
  taskProgress,
} from '@/db/schema';
import { tasks } from '@/db/schema';
import { and, asc, eq, lte } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ExampleStep } from './example-step';
import {
  getCurrentStep,
  getLastStep,
  getOrCreateStepProgress,
  getOrCreateTaskProgress,
} from './helpers';
import { QuestionStep } from './question-step';
import { TutorialStep } from './tutorial-step';

type PageProps = {
  params: Promise<{ task_id: string; course_id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { task_id } = await params;
  return {
    title: `Task ${task_id}`,
  };
}

export default async function TaskPage({ params }: PageProps) {
  const { task_id, course_id } = await params;
  const startedAt = new Date();

  const [currentUser, currentTask] = await Promise.all([
    db.query.users.findFirst(),
    db.query.tasks.findFirst({ where: eq(tasks.id, task_id) }),
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
    db.query.steps.findMany({
      where: and(
        eq(steps.taskId, currentTask.id),
        lte(steps.order, currentStep.order),
      ),
      orderBy: [asc(steps.order)],
    }) as unknown as SelectStep[],
    db.query.stepProgress.findMany({
      where: and(
        eq(stepProgress.taskId, currentTask.id),
        eq(stepProgress.userId, currentUser.id),
        eq(stepProgress.taskProgressId, currentTaskProgress.id),
      ),
      orderBy: [asc(stepProgress.startedAt)],
    }),
  ]);

  const lastStep = await getLastStep(currentTask.id);
  const isLastStep = lastStep?.id === currentStep.id;

  let stats:
    | {
        incorrect: number;
        time: number;
      }
    | undefined;

  if (isLastStep && currentStepProgress.completedAt) {
    if (!currentTaskProgress.completedAt) {
      [currentTaskProgress] = await db
        .update(taskProgress)
        .set({
          completedAt: currentStepProgress.completedAt,
        })
        .where(eq(taskProgress.id, currentTaskProgress.id))
        .returning();
    }

    if (currentTaskProgress.completedAt) {
      stats = {
        incorrect: visibleSteps.filter(
          (step) =>
            step.type === 'QUESTION' &&
            stepsProgress.find((progress) => progress.stepId === step.id)
              ?.isCorrect === false,
        ).length,
        time:
          currentTaskProgress.completedAt.getTime() -
          currentTaskProgress.startedAt.getTime(),
      };
    }
  }

  return (
    <div className="flex flex-col">
      <h1>{currentTask.title}</h1>

      <div
        id="steps-container"
        className="mx-auto flex max-w-2xl flex-col gap-4"
      >
        {visibleSteps.map((step, stepIndex) => {
          const isLastVisibleStep = stepIndex === visibleSteps.length - 1;
          const isSecondLastVisibleStep = stepIndex === visibleSteps.length - 2;

          const stepProgress = stepsProgress.find(
            (progress) => progress.stepId === step.id,
          );

          if (step.type === 'TUTORIAL') {
            return (
              <TutorialStep
                key={step.id}
                id={step.id}
                isLastVisibleStep={isLastVisibleStep}
                isSecondLastVisibleStep={isSecondLastVisibleStep}
                stepIndex={stepIndex}
                title={step.content.title}
                body={step.content.body}
              />
            );
          }

          if (step.type === 'EXAMPLE') {
            return (
              <ExampleStep
                key={step.id}
                id={step.id}
                isLastVisibleStep={isLastVisibleStep}
                stepIndex={stepIndex}
                body={step.content.body}
                answer={step.content.answer}
              />
            );
          }
          return (
            <QuestionStep
              key={step.id}
              alternatives={step.content.alternatives}
              question={step.content.question}
              id={step.id}
              isLastVisibleStep={isLastVisibleStep}
              isCorrect={stepProgress?.isCorrect ?? undefined}
              stepIndex={stepIndex}
              explanation={
                stepProgress?.selectedAlternativeOrder
                  ? step.content.alternatives.find(
                      (alternative) =>
                        alternative.order ===
                        stepProgress?.selectedAlternativeOrder,
                    )?.explanation
                  : undefined
              }
              selectedAlternativeOrder={
                stepProgress?.selectedAlternativeOrder ?? undefined
              }
              isLastStep={isLastStep}
            />
          );
        })}
      </div>

      {stats && (
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div>
            <div>Incorrect: {stats.incorrect}</div>
            <div>Time: {formatTime(stats.time)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
