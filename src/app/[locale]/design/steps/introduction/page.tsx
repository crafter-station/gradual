import { ActiveIntroductionStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/introduction-step/active';
import { DoneIntroductionStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/introduction-step/done';
import type { StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'INTRODUCTION';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveIntroductionStep
              content={step.content}
              totalSteps={10}
              stepOrder={step.order}
            />

            {progress?.completedAt && (
              <DoneIntroductionStep
                content={step.content}
                totalSteps={10}
                stepOrder={step.order}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
