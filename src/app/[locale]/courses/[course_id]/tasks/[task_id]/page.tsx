import { db } from '@/db';

import { type SelectStep, taskProgress } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ExampleStep } from './example-step';
import {
  calculateEarnedExperiencePoints,
  getCurrentStep,
  getLastStep,
  getOrCreateStepProgress,
  getOrCreateTaskProgress,
} from './helpers';
import { QuestionStep } from './question-step';
import StatsCard from './stats';
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

export default async function TaskPage({ params }: Readonly<PageProps>) {
  const { task_id } = await params;
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

  return (
    <div className="mt-2 flex flex-col">
      <h1 className="mt-2 text-center font-bold text-2xl">
        {currentTask.module.unit.order}.{currentTask.module.order}.
        {currentTask.order} {currentTask.title}
      </h1>

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

          if (step.type === 'ANALOGY') {
            return (
              <div key={step.id}>
                <h2>{step.content.title}</h2>
                <p>{step.content.body}</p>
              </div>
            );
          }

          if (step.type === 'BINARY') {
            return (
              <div key={step.id}>
                <h2>{step.content.questionBody}</h2>
              </div>
            );
          }

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

          if (step.type === 'SOLVED_EXERCISE') {
            return (
              <ExampleStep
                key={step.id}
                id={step.id}
                isLastVisibleStep={isLastVisibleStep}
                stepIndex={stepIndex}
                body={step.content.body}
                answer={step.content.solution}
                title={step.content.title}
              />
            );
          }

          // Handle different question types
          if (step.type === 'QUESTION') {
            return (
              <QuestionStep
                key={step.id}
                type={step.type}
                question={step.content.questionBody}
                id={step.id}
                isLastVisibleStep={isLastVisibleStep}
                isCorrect={stepProgress?.isCorrect ?? undefined}
                stepIndex={stepIndex}
                alternatives={[
                  {
                    text: step.content.correctAlternative,
                    explanation: step.content.correctAlternativeExplanation,
                    isCorrect: true,
                    order: 0,
                  },
                  ...step.content.distractors.map((distractor, index) => ({
                    text: distractor.alternative,
                    explanation: distractor.explanation,
                    isCorrect: false,
                    order: index + 1,
                  })),
                ]}
                explanation={
                  stepProgress?.selectedAlternativeOrder !== undefined
                    ? stepProgress.selectedAlternativeOrder === 0
                      ? step.content.correctAlternativeExplanation
                      : step.content.distractors[
                          stepProgress.selectedAlternativeOrder - 1
                        ]?.explanation
                    : undefined
                }
                selectedAlternativeOrder={
                  stepProgress?.selectedAlternativeOrder ?? undefined
                }
                isLastStep={isLastStep}
                correctAlternativeOrder={0} // For QUESTION type, correct is always first alternative
              />
            );
          }

          if (step.type === 'MULTIPLE_CHOICE') {
            // TODO: Implement MultipleChoiceStep component
            return null;
          }

          if (step.type === 'BINARY') {
            // TODO: Implement BinaryStep component
            return null;
          }

          if (step.type === 'FILL_IN_THE_BLANK') {
            // TODO: Implement FillInTheBlankStep component
            return null;
          }

          // Handle theoretical steps
          if (
            step.type === 'INTRODUCTION' ||
            step.type === 'DEFINITION' ||
            step.type === 'ANALOGY' ||
            step.type === 'FUN_FACT' ||
            step.type === 'QUOTE'
          ) {
            return (
              <TutorialStep
                key={step.id}
                id={step.id}
                isLastVisibleStep={isLastVisibleStep}
                isSecondLastVisibleStep={isSecondLastVisibleStep}
                stepIndex={stepIndex}
                title={
                  'title' in step.content
                    ? step.content.title
                    : step.content.term
                }
                body={
                  'body' in step.content
                    ? step.content.body
                    : step.content.definition
                }
                author={
                  'author' in step.content ? step.content.author : undefined
                }
              />
            );
          }

          return null;
        })}
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
