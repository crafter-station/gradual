import { ActiveAnalogyStep } from '@/app/[locale]/(app)/learn/courses/[course_id]/tasks/[task_id]/analogy-step/active';
import { DoneAnalogyStep } from '@/app/[locale]/(app)/learn/courses/[course_id]/tasks/[task_id]/analogy-step/done';
import type { StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'ANALOGY';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveAnalogyStep content={step.content} />

            {progress?.completedAt && (
              <DoneAnalogyStep content={step.content} />
            )}
          </div>
        );
      })}
    </>
  );
}
