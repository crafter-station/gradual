import { ActiveDefinitionStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/definition-step/active';
import { DoneDefinitionStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/definition-step/done';
import type { StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'DEFINITION';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveDefinitionStep
              content={step.content}
              totalSteps={10}
              stepOrder={step.order}
            />

            {progress?.completedAt && (
              <DoneDefinitionStep
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
