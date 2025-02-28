import { ActiveFunFactStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/fun-fact-step/active';
import { DoneFunFactStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/fun-fact-step/done';
import type { StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'FUN_FACT';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveFunFactStep content={step.content} />

            {progress?.completedAt && (
              <DoneFunFactStep content={step.content} />
            )}
          </div>
        );
      })}
    </>
  );
}
