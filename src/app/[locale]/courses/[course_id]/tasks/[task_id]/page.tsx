import { db } from '@/db';
import * as schema from '@/db/schema';
import type {
  SelectStep,
  SelectStepProgress,
  SelectTaskProgress,
} from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq, inArray } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { ActiveIntroductionStep } from './introduction-step/active';
import { DoneIntroductionStep } from './introduction-step/done';
import { ActiveQuestionStep } from './question-step/active';
import { DoneQuestionStep } from './question-step/done';
import { ActiveMultipleChoiceStep } from './multiple-choice-step/active';
import { DoneMultipleChoiceStep } from './multiple-choice-step/done';
import { ActiveBinaryStep } from './binary-step/active';
import { DoneBinaryStep } from './binary-step/done';
import { ActiveFillInTheBlankStep } from './fill-in-the-blank-step/active';
import { DoneFillInTheBlankStep } from './fill-in-the-blank-step/done';
import { ActiveDefinitionStep } from './definition-step/active';
import { DoneDefinitionStep } from './definition-step/done';
import { ActiveQuoteStep } from './quote-step/active';
import { DoneQuoteStep } from './quote-step/done';
import { ActiveFunFactStep } from './fun-fact-step/active';
import { DoneFunFactStep } from './fun-fact-step/done';
import { ActiveAnalogyStep } from './analogy-step/active';
import { DoneAnalogyStep } from './analogy-step/done';
import { ActiveSolvedExerciseStep } from './solved-exercise-step/active';
import { DoneSolvedExerciseStep } from './solved-exercise-step/done';
import { ActiveTutorialStep } from './tutorial-step/active';
import { DoneTutorialStep } from './tutorial-step/done';
import StatsCard from './stats';
import { submitStepAction } from './submit/action';
import { SubmitButton } from './submit/button';
import { Test } from './test';

type PageProps = {
  params: Promise<{ task_id: string; course_id: string }>;
};

export default async function TaskPage({ params }: Readonly<PageProps>) {
  const params_ = await params;
  const { task_id: taskId, course_id: courseId } = params_;

  const now = new Date();

  const [user, task] = await Promise.all([
    currentUser(),
    db.query.task.findFirst({
      columns: {
        id: true,
        title: true,
        description: true,
        stepsCount: true,
        order: true,
      },
      where: and(
        eq(schema.task.id, taskId),
        eq(schema.task.courseId, courseId),
      ),
      with: {
        section: {
          columns: {
            id: true,
            title: true,
            order: true,
          },
          with: {
            unit: {
              columns: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!user) return notFound();

  const userId = user.privateMetadata.userId as string | undefined;

  if (!userId) return notFound();

  if (!task) return notFound();

  const [enrollment] = await db
    .select()
    .from(schema.enrollment)
    .where(
      and(
        eq(schema.enrollment.userId, userId),
        eq(schema.enrollment.courseId, courseId),
      ),
    )
    .limit(1);

  if (!enrollment) {
    return redirect(`/courses/${courseId}?enroll-first=true`);
  }

  const steps: SelectStep[] = [];

  let currentTaskProgress: SelectTaskProgress | undefined;

  const stepProgress = (await db
    .select({
      id: schema.stepProgress.id,

      userId: schema.stepProgress.userId,
      stepId: schema.stepProgress.stepId,
      taskId: schema.stepProgress.taskId,

      taskProgressId: schema.stepProgress.taskProgressId,

      startedAt: schema.stepProgress.startedAt,
      completedAt: schema.stepProgress.completedAt,
      state: schema.stepProgress.state,
    })
    .from(schema.stepProgress)
    .where(
      and(
        eq(schema.stepProgress.userId, userId),
        eq(schema.stepProgress.taskId, taskId),
      ),
    )) as SelectStepProgress[];

  if (stepProgress.length === 0) {
    const [step] = await db
      .select({
        id: schema.step.id,
        type: schema.step.type,
        content: schema.step.content,
        order: schema.step.order,
      })
      .from(schema.step)
      .where(and(eq(schema.step.taskId, taskId), eq(schema.step.order, 1)))
      .limit(1);

    if (!step) {
      throw new Error('Step not found');
    }

    steps.push(step as SelectStep);

    const taskProgressId = uuidv4();

    const [_taskProgress] = await db
      .insert(schema.taskProgress)
      .values({
        id: taskProgressId,
        userId,
        taskId,
        startedAt: now,
      })
      .returning();

    currentTaskProgress = _taskProgress as SelectTaskProgress;

    const [_stepProgress] = await db
      .insert(schema.stepProgress)
      .values({
        userId,
        taskId,
        startedAt: now,
        stepId: step.id,
        taskProgressId,
      })
      .returning();

    if (!_stepProgress) {
      throw new Error('Step progress not found');
    }

    stepProgress.push(_stepProgress as SelectStepProgress);
  } else {
    const [_taskProgress] = await db
      .select()
      .from(schema.taskProgress)
      .where(eq(schema.taskProgress.id, stepProgress[0].taskProgressId))
      .limit(1);

    if (!_taskProgress) {
      throw new Error('Task progress not found');
    }

    currentTaskProgress = _taskProgress as SelectTaskProgress;

    const _steps = await db
      .select({
        id: schema.step.id,
        type: schema.step.type,
        content: schema.step.content,
        order: schema.step.order,
      })
      .from(schema.step)
      .where(
        inArray(
          schema.step.id,
          stepProgress.map((p) => p.stepId),
        ),
      );

    if (!_steps.length) {
      throw new Error('Steps not found');
    }

    steps.push(...(_steps as SelectStep[]));
    steps.sort((a, b) => a.order - b.order);

    const lastStep = steps[steps.length - 1];
    const lastStepProgress = stepProgress.find(
      (step) => step.stepId === lastStep.id,
    );

    if (!lastStepProgress) {
      throw new Error('Last step progress not found');
    }

    if (lastStep.order === task.stepsCount) {
    } else {
      if (lastStepProgress.completedAt) {
        const [nextStep] = await db
          .select({
            id: schema.step.id,
            type: schema.step.type,
            content: schema.step.content,
            order: schema.step.order,
          })
          .from(schema.step)
          .where(
            and(
              eq(schema.step.order, lastStep.order + 1),
              eq(schema.step.taskId, taskId),
            ),
          )
          .limit(1);

        if (!nextStep) {
          throw new Error('Next step not found');
        }

        steps.push(nextStep as SelectStep);

        const [_nextStepProgress] = await db
          .insert(schema.stepProgress)
          .values({
            userId,
            stepId: nextStep.id,
            taskId,
            taskProgressId: lastStepProgress.taskProgressId,

            startedAt: now,
          })
          .returning();

        if (!stepProgress) {
          throw new Error('Step progress not found');
        }

        stepProgress.push(_nextStepProgress as SelectStepProgress);
      }
    }
  }

  const lastVisibleStep = steps[steps.length - 1];
  const lastVisibleStepProgress = stepProgress[stepProgress.length - 1];

  let stats:
    | {
        incorrectQuestionsCount: number;
        questionsCount: number;
        time: number;
      }
    | undefined;

  if (
    lastVisibleStepProgress.completedAt &&
    lastVisibleStep.order === task.stepsCount
  ) {
    if (!currentTaskProgress.completedAt) {
      throw new Error('Current task progress not found');
    }

    stats = {
      incorrectQuestionsCount: currentTaskProgress.incorrectStepsCount ?? 0,
      time:
        currentTaskProgress.completedAt.getTime() -
        currentTaskProgress.startedAt.getTime(),
      questionsCount: steps.filter((step) =>
        ['QUESTION', 'FILL_IN_THE_BLANK', 'MULTIPLE_CHOICE', 'BINARY'].includes(
          step.type,
        ),
      ).length,
    };
  }

  return (
    <div className="mt-2 flex flex-col">
      <h1 className="mt-2 text-center font-bold text-2xl">
        {task.section.unit.order}.{task.section.order}.{task.order} {task.title}
      </h1>

      <div
        id="done-steps-container"
        className="mx-auto flex max-w-2xl flex-col gap-4"
      >
        {steps.slice(0, -1).map((step, stepIndex) => {
          const progress = stepProgress.find(
            (progress) => progress.stepId === step.id,
          );

          if (!progress?.completedAt) return null;

          if (step.type === 'INTRODUCTION') {
            return (
              <DoneIntroductionStep
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={task.stepsCount}
              />
            );
          }

          if (step.type === 'QUESTION' && progress.state?.type === 'QUESTION') {
            return (
              <DoneQuestionStep
                id={step.id}
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={task.stepsCount}
                progressState={progress.state}
              />
            );
          }

          if (
            step.type === 'MULTIPLE_CHOICE' &&
            progress.state?.type === 'MULTIPLE_CHOICE'
          ) {
            return (
              <DoneMultipleChoiceStep
                id={step.id}
                key={step.id}
                content={step.content}
                progressState={progress.state}
              />
            );
          }

          if (step.type === 'BINARY' && progress.state?.type === 'BINARY') {
            return (
              <DoneBinaryStep
                id={step.id}
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={task.stepsCount}
                progressState={progress.state}
              />
            );
          }

          if (
            step.type === 'FILL_IN_THE_BLANK' &&
            progress.state?.type === 'FILL_IN_THE_BLANK'
          ) {
            return (
              <DoneFillInTheBlankStep
                id={step.id}
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={task.stepsCount}
                progressState={progress.state}
              />
            );
          }

          if (step.type === 'DEFINITION') {
            return (
              <DoneDefinitionStep
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={task.stepsCount}
              />
            );
          }

          if (step.type === 'QUOTE') {
            return <DoneQuoteStep key={step.id} content={step.content} />;
          }

          if (step.type === 'FUN_FACT') {
            return <DoneFunFactStep key={step.id} content={step.content} />;
          }

          if (step.type === 'ANALOGY') {
            return <DoneAnalogyStep key={step.id} content={step.content} />;
          }

          if (step.type === 'SOLVED_EXERCISE') {
            return (
              <DoneSolvedExerciseStep key={step.id} content={step.content} />
            );
          }

          if (step.type === 'TUTORIAL') {
            return (
              <DoneTutorialStep
                key={step.id}
                content={step.content}
                stepOrder={stepIndex + 1}
                totalSteps={task.stepsCount}
              />
            );
          }

          return <pre key={step.id}>{JSON.stringify(step, null, 2)}</pre>;
        })}

        <form action={submitStepAction}>
          <input type="hidden" name="taskId" value={taskId} />

          {lastVisibleStep?.type === 'QUESTION' &&
            (lastVisibleStepProgress?.state?.type === 'QUESTION' ? (
              <DoneQuestionStep
                id={lastVisibleStep.id}
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={steps.length}
                totalSteps={task.stepsCount}
                progressState={lastVisibleStepProgress?.state}
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
                stepOrder={lastVisibleStep.order}
                totalSteps={task.stepsCount}
              />
            ))}
          {lastVisibleStep?.type === 'INTRODUCTION' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneIntroductionStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={steps.length}
                totalSteps={task.stepsCount}
              />
            ) : (
              <ActiveIntroductionStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={lastVisibleStep.order}
                totalSteps={task.stepsCount}
              />
            ))}
          {lastVisibleStep?.type === 'MULTIPLE_CHOICE' &&
            (lastVisibleStepProgress?.state?.type === 'MULTIPLE_CHOICE' ? (
              <DoneMultipleChoiceStep
                id={lastVisibleStep.id}
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                progressState={lastVisibleStepProgress?.state}
              />
            ) : (
              <ActiveMultipleChoiceStep
                id={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ))}
          {lastVisibleStep?.type === 'BINARY' &&
            (lastVisibleStepProgress?.state?.type === 'BINARY' ? (
              <DoneBinaryStep
                id={lastVisibleStep.id}
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={steps.length}
                totalSteps={task.stepsCount}
                progressState={lastVisibleStepProgress?.state}
              />
            ) : (
              <ActiveBinaryStep
                id={lastVisibleStep.id}
                stepOrder={lastVisibleStep.order}
                totalSteps={task.stepsCount}
                questionBody={lastVisibleStep.content.questionBody}
              />
            ))}
          {lastVisibleStep?.type === 'FILL_IN_THE_BLANK' &&
            (lastVisibleStepProgress?.state?.type === 'FILL_IN_THE_BLANK' ? (
              <DoneFillInTheBlankStep
                id={lastVisibleStep.id}
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={steps.length}
                totalSteps={task.stepsCount}
                progressState={lastVisibleStepProgress?.state}
              />
            ) : (
              <ActiveFillInTheBlankStep
                id={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={lastVisibleStep.order}
                totalSteps={task.stepsCount}
              />
            ))}
          {lastVisibleStep?.type === 'DEFINITION' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneDefinitionStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={steps.length}
                totalSteps={task.stepsCount}
              />
            ) : (
              <ActiveDefinitionStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={lastVisibleStep.order}
                totalSteps={task.stepsCount}
              />
            ))}
          {lastVisibleStep?.type === 'QUOTE' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneQuoteStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ) : (
              <ActiveQuoteStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ))}
          {lastVisibleStep?.type === 'FUN_FACT' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneFunFactStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ) : (
              <ActiveFunFactStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ))}
          {lastVisibleStep?.type === 'ANALOGY' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneAnalogyStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ) : (
              <ActiveAnalogyStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ))}
          {lastVisibleStep?.type === 'SOLVED_EXERCISE' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneSolvedExerciseStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ) : (
              <ActiveSolvedExerciseStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ))}
          {lastVisibleStep?.type === 'TUTORIAL' &&
            (lastVisibleStepProgress.completedAt ? (
              <DoneTutorialStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
                stepOrder={steps.length}
                totalSteps={task.stepsCount}
              />
            ) : (
              <ActiveTutorialStep
                key={lastVisibleStep.id}
                content={lastVisibleStep.content}
              />
            ))}
          {![
            'QUESTION',
            'INTRODUCTION',
            'MULTIPLE_CHOICE',
            'BINARY',
            'FILL_IN_THE_BLANK',
            'DEFINITION',
            'QUOTE',
            'FUN_FACT',
            'ANALOGY',
            'SOLVED_EXERCISE',
            'TUTORIAL',
          ].includes(lastVisibleStep?.type ?? '') && (
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
