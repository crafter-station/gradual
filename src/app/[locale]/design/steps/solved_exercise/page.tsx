import { ActiveSolvedExerciseStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/solved-exercise-step/active';
import { DoneSolvedExerciseStep } from '@/app/[locale]/courses/[course_id]/tasks/[task_id]/solved-exercise-step/done';
import type { StepType } from '@/db/schema';
import { getStepProgress, getSteps } from '../helpers';

export default async function StepsPage() {
  const type: StepType = 'SOLVED_EXERCISE';

  const steps = await getSteps(type);
  const stepProgress = await getStepProgress(steps.map((s) => s.id));

  return (
    <>
      {steps.map((step) => {
        const progress = stepProgress.find((p) => p.stepId === step.id);

        return (
          <div key={step.id} className="space-y-4">
            <ActiveSolvedExerciseStep content={step.content} />

            {progress?.completedAt && (
              <DoneSolvedExerciseStep content={step.content} />
            )}
          </div>
        );
      })}
    </>
  );
}
