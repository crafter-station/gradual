import { ActiveQuoteStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/quote-step/active';
import { DoneQuoteStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/quote-step/done';
import type { StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'QUOTE';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveQuoteStep content={step.content} />

            {progress?.completedAt && <DoneQuoteStep content={step.content} />}
          </div>
        );
      })}
    </>
  );
}
