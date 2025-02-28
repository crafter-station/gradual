import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import type { StepProgressState } from '@/db/schema/step/progress-state';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';

interface DoneMultipleChoiceStepProps {
  id: string;
  content: StepContent & {
    type: 'MULTIPLE_CHOICE';
    questionBody: string;
    correctAlternatives: string[];
    distractors: string[];
    explanation: string;
  };
  progressState: StepProgressState & {
    type: 'MULTIPLE_CHOICE';
    selectedAlternatives: string[];
  };
}

export const DoneMultipleChoiceStep = ({
  id,
  content,
  progressState,
}: DoneMultipleChoiceStepProps) => {
  // Combine and sort alternatives
  const allAlternatives = [
    ...content.correctAlternatives,
    ...content.distractors,
  ].sort(() => Math.random() - 0.5);

  // Check if all selected answers are correct and no incorrect ones are selected
  const isAllCorrect =
    progressState.selectedAlternatives.every((alt) =>
      content.correctAlternatives.includes(alt),
    ) &&
    progressState.selectedAlternatives.length ===
      content.correctAlternatives.length;

  return (
    <StepCard stepType="Multiple Choice" isDone isCorrect={isAllCorrect}>
      {/* Question */}
      <div className="relative space-y-8">
        <h1 className="text-center font-medium text-2xl text-foreground/90 tracking-tight transition-colors duration-300 group-hover:text-success">
          {content.questionBody}
        </h1>

        {/* Result indicator */}
        <div className="mx-auto w-full max-w-[700px]">
          <div
            className={cn(
              'rounded-lg border px-4 py-3 transition-all duration-300',
              isAllCorrect
                ? 'border-success/10 bg-success/[0.02] group-hover:bg-success/[0.03]'
                : 'border-destructive/10 bg-destructive/[0.02] group-hover:bg-destructive/[0.03]',
            )}
          >
            <p
              className={cn(
                'font-medium text-sm',
                isAllCorrect ? 'text-success/70' : 'text-destructive/70',
              )}
            >
              {isAllCorrect
                ? 'All selected answers are correct!'
                : 'Some answers are incorrect'}
            </p>
          </div>
        </div>

        {/* Alternatives */}
        <div className="mx-auto w-full max-w-[700px]">
          <div className="grid grid-cols-1 gap-3">
            {allAlternatives.map((alternative) => {
              const isSelected =
                progressState.selectedAlternatives.includes(alternative);
              const isCorrect =
                content.correctAlternatives.includes(alternative);
              const showError = isSelected && !isCorrect;

              return (
                <div
                  key={alternative}
                  className={cn(
                    'group/option relative transition-all duration-200',
                    'rounded-xl border',
                    isSelected
                      ? isCorrect
                        ? 'border-success/40 bg-success/[0.03]'
                        : 'border-destructive/40 bg-destructive/[0.03]'
                      : isCorrect
                        ? 'border-success/20 bg-success/[0.01]'
                        : 'border-border/40 opacity-40',
                  )}
                >
                  <div className="relative flex items-center gap-3 p-4">
                    {/* Status icon */}
                    {isSelected ? (
                      isCorrect ? (
                        <CheckCircle2Icon className="h-5 w-5 shrink-0 text-success" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 shrink-0 text-destructive" />
                      )
                    ) : isCorrect ? (
                      <CheckCircle2Icon className="h-5 w-5 shrink-0 text-success/40" />
                    ) : (
                      <div className="h-5 w-5 shrink-0 rounded-md border-2 border-muted-foreground/30" />
                    )}

                    {/* Alternative text */}
                    <span
                      className={cn(
                        'font-medium text-base',
                        isSelected
                          ? isCorrect
                            ? 'text-success'
                            : 'text-destructive'
                          : isCorrect
                            ? 'text-success/60'
                            : 'text-muted-foreground',
                      )}
                    >
                      {alternative}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        <div
          className={cn(
            'mx-auto w-full max-w-[700px] rounded-lg border p-4 transition-all duration-300',
            isAllCorrect
              ? 'border-success/10 bg-success/[0.02]'
              : 'border-destructive/10 bg-destructive/[0.02]',
          )}
        >
          <h3
            className={cn(
              'mb-3 font-medium text-xs uppercase tracking-wide',
              isAllCorrect ? 'text-success/60' : 'text-destructive/60',
            )}
          >
            Explanation
          </h3>
          <p className="text-muted-foreground/90 text-sm">
            {content.explanation}
          </p>
          {!isAllCorrect && (
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground/60">
                Correct answers:{' '}
              </span>
              <span className="font-medium text-success/70">
                {content.correctAlternatives.join(', ')}
              </span>
            </p>
          )}
        </div>
      </div>
    </StepCard>
  );
};
