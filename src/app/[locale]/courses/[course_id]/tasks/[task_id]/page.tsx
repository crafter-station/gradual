export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

import { db } from '@/db';
import { type SelectStep, taskProgress } from '@/db/schema';
import { getCurrentUser } from '@/db/utils';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ActiveBinaryStep } from './binary-step/active';
import { DoneBinaryStep } from './binary-step/done';
import { ActiveDefinitionStep } from './definition-step/active';
import { DoneDefinitionStep } from './definition-step/done';
import { ActiveFillInTheBlankStep } from './fill-in-the-blank-step/active';
import { DoneFillInTheBlankStep } from './fill-in-the-blank-step/done';
import { ActiveFunFactStep } from './fun-fact-step/active';
import { DoneFunFactStep } from './fun-fact-step/done';
import {
  calculateEarnedExperiencePoints,
  getCurrentStep,
  getFullTask,
  getLastStep,
  getOrCreateStepProgress,
  getOrCreateTaskProgress,
  getTaskStepsProgress,
  getVisibleSteps,
} from './helpers';
import { ActiveIntroductionStep } from './introduction-step/active';
import { DoneIntroductionStep } from './introduction-step/done';
import { ActiveMultipleChoiceStep } from './multiple-choice-step/active';
import { DoneMultipleChoiceStep } from './multiple-choice-step/done';
import { ActiveQuestionStep } from './question-step/active';
import { DoneQuestionStep } from './question-step/done';
import { ActiveQuoteStep } from './quote-step/active';
import { DoneQuoteStep } from './quote-step/done';
import { ActiveSolvedExerciseStep } from './solved-exercise-step/active';
import { DoneSolvedExerciseStep } from './solved-exercise-step/done';
import StatsCard from './stats';
import { StepNavigation } from './step-navigation';
import { submitStepAction } from './submit/action';
import { SubmitButton } from './submit/button';
import { TaskContainer } from './task-container';
import { Test } from './test';
import { ActiveTutorialStep } from './tutorial-step/active';
import { DoneTutorialStep } from './tutorial-step/done';

type PageProps = {
  params: Promise<{ task_id: string; course_id: string }>;
  searchParams: { step?: string };
};

export default async function TaskPage({
  params,
  searchParams,
}: Readonly<PageProps>) {
  const params_ = await params;
  const { task_id, course_id } = params_;
  console.log('TaskPage', { task_id, course_id });

  const startedAt = new Date();

  const [currentUser, currentTask] = await Promise.all([
    getCurrentUser.execute(),
    getFullTask.execute({ taskId: task_id }),
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
    getVisibleSteps.execute({
      taskId: task_id,
      lastStepOrder: currentStep.order,
    }) as unknown as SelectStep[],
    getTaskStepsProgress.execute({
      taskProgressId: currentTaskProgress.id,
    }),
  ]);

  const currentStepIndex = Number.parseInt(searchParams?.step ?? '0');
  const currentVisibleStep =
    visibleSteps[currentStepIndex] ?? visibleSteps.slice(-1)[0];
  const currentVisibleStepProgress = stepsProgress?.find(
    (progress) => progress.stepId === currentVisibleStep.id,
  );

  console.log({ currentVisibleStep });
  if (!currentVisibleStep || !currentVisibleStepProgress) return null;

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
          stepsProgress?.find((progress) => progress.stepId === step.id)
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

  console.log(lastStep);

  return (
    <TaskContainer
      currentStep={visibleSteps.length}
      totalSteps={currentTask.stepsCount}
    >
      <div className="flex flex-col gap-4">
        {stats ? (
          <StatsCard
            xp={currentTaskProgress.earnedExperiencePoints ?? 0}
            time={stats.time}
            precision={1 - stats.incorrectQuestionsCount / stats.questionsCount}
          />
        ) : (
          <form
            className="flex flex-col items-center gap-4"
            action={submitStepAction}
          >
            <input type="hidden" name="taskId" value={task_id} />
            <input type="hidden" name="courseId" value={course_id} />

            <StepNavigation
              totalSteps={currentTask.stepsCount}
              visibleSteps={visibleSteps}
              currentStepIndex={currentStepIndex}
            />

            {currentVisibleStep.type === 'QUESTION' &&
              (currentVisibleStepProgress.state?.type === 'QUESTION' ? (
                <DoneQuestionStep
                  id={currentVisibleStep.id}
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                  progressState={currentVisibleStepProgress.state}
                />
              ) : (
                <ActiveQuestionStep
                  id={currentVisibleStep.id}
                  alternatives={[
                    currentVisibleStep.content.correctAlternative,
                    ...currentVisibleStep.content.distractors.map(
                      (distractor) => distractor.alternative,
                    ),
                  ].sort(() => Math.random() - 0.5)}
                  questionBody={currentVisibleStep.content.questionBody}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ))}
            {currentVisibleStep.type === 'INTRODUCTION' &&
              (currentVisibleStepProgress?.completedAt ? (
                <DoneIntroductionStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ) : (
                <ActiveIntroductionStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ))}
            {currentVisibleStep.type === 'DEFINITION' &&
              (currentVisibleStepProgress?.completedAt ? (
                <DoneDefinitionStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ) : (
                <ActiveDefinitionStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ))}
            {currentVisibleStep.type === 'FILL_IN_THE_BLANK' &&
              (currentVisibleStepProgress?.state?.type ===
              'FILL_IN_THE_BLANK' ? (
                <DoneFillInTheBlankStep
                  id={currentVisibleStep.id}
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                  progressState={currentVisibleStepProgress.state}
                />
              ) : (
                <ActiveFillInTheBlankStep
                  id={currentVisibleStep.id}
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ))}
            {currentVisibleStep.type === 'TUTORIAL' &&
              (currentVisibleStepProgress?.completedAt ? (
                <DoneTutorialStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ) : (
                <ActiveTutorialStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ))}
            {currentVisibleStep.type === 'BINARY' &&
              (currentVisibleStepProgress.state?.type === 'BINARY' ? (
                <DoneBinaryStep
                  id={currentVisibleStep.id}
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                  progressState={currentVisibleStepProgress.state}
                />
              ) : (
                <ActiveBinaryStep
                  id={currentVisibleStep.id}
                  key={currentVisibleStep.id}
                  questionBody={currentVisibleStep.content.questionBody}
                  stepOrder={currentStepIndex + 1}
                  totalSteps={currentTask.stepsCount}
                />
              ))}
            {currentVisibleStep.type === 'MULTIPLE_CHOICE' &&
              (currentVisibleStepProgress.state?.type === 'MULTIPLE_CHOICE' ? (
                <DoneMultipleChoiceStep
                  id={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                  progressState={currentVisibleStepProgress.state}
                />
              ) : (
                <ActiveMultipleChoiceStep
                  id={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ))}
            {currentVisibleStep.type === 'QUOTE' &&
              (currentVisibleStepProgress?.completedAt ? (
                <DoneQuoteStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ) : (
                <ActiveQuoteStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ))}
            {currentVisibleStep.type === 'FUN_FACT' &&
              (currentVisibleStepProgress?.completedAt ? (
                <DoneFunFactStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ) : (
                <ActiveFunFactStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ))}
            {currentVisibleStep.type === 'SOLVED_EXERCISE' &&
              (currentVisibleStepProgress?.completedAt ? (
                <DoneSolvedExerciseStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ) : (
                <ActiveSolvedExerciseStep
                  key={currentVisibleStep.id}
                  content={currentVisibleStep.content}
                />
              ))}

            {![
              'QUESTION',
              'INTRODUCTION',
              'FILL_IN_THE_BLANK',
              'MULTIPLE_CHOICE',
              'DEFINITION',
              'TUTORIAL',
              'BINARY',
              'QUOTE',
              'FUN_FACT',
              'SOLVED_EXERCISE',
            ].includes(currentVisibleStep.type) && (
              <Test>
                <pre key={currentVisibleStep.id}>
                  {JSON.stringify(currentVisibleStep, null, 2)}
                </pre>
              </Test>
            )}
            <SubmitButton />
          </form>
        )}
      </div>
    </TaskContainer>
  );
}
