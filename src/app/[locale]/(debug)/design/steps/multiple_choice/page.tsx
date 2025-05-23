import { ActiveMultipleChoiceStep } from '@/app/[locale]/(app)/learn/courses/[course_id]/tasks/[task_id]/multiple-choice-step/active';
import { DoneMultipleChoiceStep } from '@/app/[locale]/(app)/learn/courses/[course_id]/tasks/[task_id]/multiple-choice-step/done';
import type { StepProgressState, StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'MULTIPLE_CHOICE';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveMultipleChoiceStep id={step.id} content={step.content} />

            {progress?.completedAt && (
              <DoneMultipleChoiceStep
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
