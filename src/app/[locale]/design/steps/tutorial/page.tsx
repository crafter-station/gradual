import { ActiveTutorialStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/tutorial-step/active';
import type { StepContent, StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'TUTORIAL';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveTutorialStep
              stepOrder={step.order}
              totalSteps={steps.length}
              content={step.content as StepContent & { type: 'TUTORIAL' }}
            />

            {progress?.completedAt && (
              <ActiveTutorialStep
                stepOrder={step.order}
                totalSteps={steps.length}
                content={step.content as StepContent & { type: 'TUTORIAL' }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
