import { ActiveBinaryStep } from '@/app/[locale]/(app)/learn/courses/[course_id]/tasks/[task_id]/binary-step/active';
import { DoneBinaryStep } from '@/app/[locale]/(app)/learn/courses/[course_id]/tasks/[task_id]/binary-step/done';
import type { StepProgressState, StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'BINARY';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveBinaryStep
              id={step.id}
              stepOrder={step.order}
              totalSteps={steps.length}
              questionBody={step.content.questionBody}
            />

            {progress?.completedAt && (
              <DoneBinaryStep
                id={step.id}
                stepOrder={step.order}
                totalSteps={steps.length}
                content={step.content}
                progressState={
                  progress.state as StepProgressState & { type: typeof type }
                }
              />
            )}
          </div>
        );
      })}
    </>
  );
}
