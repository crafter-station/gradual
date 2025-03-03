import { db } from '@/db';
import * as schema from '@/db/schema';
import type {
  SelectStep,
  SelectStepProgress,
  SelectTaskProgress,
} from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq, inArray } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
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

export default async function TaskPage({ params }: Readonly<PageProps>) {
  const params_ = await params;
  const { task_id, course_id } = params_;

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
        eq(schema.task.id, task_id),
        eq(schema.task.courseId, course_id),
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

  const steps: SelectStep[] = [];

  let currentTaskProgress: SelectTaskProgress | undefined;

  const stepProgress = (await db
    .select({
      id: schema.stepProgress.id,
      startedAt: schema.stepProgress.startedAt,
      completedAt: schema.stepProgress.completedAt,
      stepId: schema.stepProgress.stepId,
      taskProgressId: schema.stepProgress.taskProgressId,
      state: schema.stepProgress.state,
    })
    .from(schema.stepProgress)
    .where(
      and(
        eq(schema.stepProgress.userId, userId),
        eq(schema.stepProgress.taskId, task_id),
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
      .where(and(eq(schema.step.taskId, task_id), eq(schema.step.order, 1)))
      .limit(1);

    if (!step) {
      throw new Error('Step not found');
    }

    steps.push(step as SelectStep);

    const [enrollment] = await db
      .select()
      .from(schema.enrollment)
      .where(
        and(
          eq(schema.enrollment.userId, userId),
          eq(schema.enrollment.courseId, course_id),
        ),
      )
      .limit(1);

    if (!enrollment) {
      await db.insert(schema.enrollment).values({
        userId,
        courseId: course_id,
        startedAt: now,
      });
    }

    const taskProgressId = uuidv4();

    const [_taskProgress] = await db
      .insert(schema.taskProgress)
      .values({
        id: taskProgressId,
        userId,
        taskId: task_id,
        startedAt: now,
      })
      .returning();

    if (!_taskProgress) {
      throw new Error('Task progress not found');
    }

    currentTaskProgress = _taskProgress as SelectTaskProgress;

    const [_stepProgress] = await db
      .insert(schema.stepProgress)
      .values({
        userId,
        taskId: task_id,
        startedAt: now,
        stepId: step.id,
        taskProgressId: taskProgressId,
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
          stepProgress.map((step) => step.stepId),
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
          .where(eq(schema.step.order, lastStep.order + 1))
          .limit(1);

        if (!nextStep) {
          throw new Error('Next step not found');
        }

        steps.push(nextStep as SelectStep);

        const [_stepProgress] = await db
          .insert(schema.stepProgress)
          .values({
            userId,
            taskId: task_id,
            startedAt: now,
            stepId: nextStep.id,
            taskProgressId: lastStepProgress.taskProgressId,
          })
          .returning();

        if (!stepProgress) {
          throw new Error('Step progress not found');
        }

        stepProgress.push(_stepProgress as SelectStepProgress);
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
    stats = {
      incorrectQuestionsCount: steps.filter(
        (step) =>
          step.type === 'QUESTION' &&
          stepProgress?.find((progress) => progress.stepId === step.id)
            ?.isCorrect === false,
      ).length,
      time:
        lastVisibleStepProgress.completedAt.getTime() -
        lastVisibleStepProgress.startedAt.getTime(),
      questionsCount: steps.filter((step) => step.type === 'QUESTION').length,
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

          return <pre key={step.id}>{JSON.stringify(step, null, 2)}</pre>;
        })}

        <form action={submitStepAction}>
          <input type="hidden" name="taskId" value={task_id} />
          <input type="hidden" name="courseId" value={course_id} />

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
