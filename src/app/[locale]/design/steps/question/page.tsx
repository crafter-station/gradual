import type { StepProgressState, StepType } from '@/db/schema';
import { ActiveQuestionStep } from '../../../courses/[course_id]/tasks/[task_id]/question-step/active';
import { DoneQuestionStep } from '../../../courses/[course_id]/tasks/[task_id]/question-step/done';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'QUESTION';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveQuestionStep
              id={step.id}
              questionBody={step.content.questionBody}
              alternatives={[
                ...step.content.distractors.map((d) => d.alternative),
                step.content.correctAlternative,
              ].toSorted((a, b) => a.localeCompare(b))}
            />

            {progress?.completedAt && (
              <DoneQuestionStep
                id={step.id}
                progressState={
                  progress.state as StepProgressState & { type: typeof type }
                }
                content={step.content}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
