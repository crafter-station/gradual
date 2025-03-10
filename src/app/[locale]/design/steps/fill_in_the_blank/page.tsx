import { ActiveFillInTheBlankStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/fill-in-the-blank-step/active';
import { DoneFillInTheBlankStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/fill-in-the-blank-step/done';
import type { StepProgressState, StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'FILL_IN_THE_BLANK';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveFillInTheBlankStep
              body={step.content.body}
              alternatives={[
                ...step.content.blanks,
                ...step.content.distractors,
              ].sort((a, b) => a.localeCompare(b))}
            />

            {progress?.completedAt && (
              <DoneFillInTheBlankStep
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
