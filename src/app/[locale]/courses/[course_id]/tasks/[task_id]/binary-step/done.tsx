import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import type { StepProgressState } from '@/db/schema/step/progress-state';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';

interface DoneBinaryStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  progressState: StepProgressState & {
    type: 'BINARY';
  };
  content: StepContent & {
    type: 'BINARY';
  };
}

export const DoneBinaryStep = ({
  id,
  stepOrder,
  totalSteps,
  progressState,
  content,
}: DoneBinaryStepProps) => {
  const isCorrect = progressState.selectedAnswer === content.correctAnswer;

  return (
    <StepCard stepType="True or False" isDone isCorrect={isCorrect}>
      {/* Question body */}
      <div className="mx-auto max-w-[700px] text-center">
        <h1 className="font-medium text-2xl text-foreground/90 tracking-tight md:text-3xl">
          {content.questionBody}
        </h1>
      </div>

      {/* Result indicator */}
      <div className="mx-auto w-full max-w-[700px]">
        <div
          className={cn(
            'rounded-lg border px-4 py-3 transition-all duration-300',
            isCorrect
              ? 'border-flexoki-green/10 bg-flexoki-green/[0.02] group-hover:bg-flexoki-green/[0.03]'
              : 'border-flexoki-red/10 bg-flexoki-red/[0.02] group-hover:bg-flexoki-red/[0.03]',
          )}
        >
          <p
            className={cn(
              'font-medium text-sm',
              isCorrect ? 'text-flexoki-green/70' : 'text-flexoki-red/70',
            )}
          >
            {isCorrect ? 'Correct answer' : 'Incorrect answer'}
          </p>
        </div>
      </div>

      {/* Binary options */}
      <div className="mx-auto w-full max-w-[700px]">
        <div className="grid grid-cols-2 gap-4">
          <div
            className={cn(
              'group/option relative flex items-center justify-center gap-3 p-6',
              'rounded-xl border transition-all duration-300',
              progressState.selectedAnswer === true
                ? content.correctAnswer
                  ? 'border-flexoki-green/20 bg-flexoki-green/[0.03]'
                  : 'border-flexoki-red/20 bg-flexoki-red/[0.03]'
                : 'border-border/10 opacity-40',
            )}
          >
            <CheckIcon
              className={cn(
                'h-8 w-8',
                progressState.selectedAnswer === true
                  ? content.correctAnswer
                    ? 'text-flexoki-green'
                    : 'text-flexoki-red'
                  : 'text-muted-foreground',
              )}
            />
            <span
              className={cn(
                'font-medium text-xl',
                progressState.selectedAnswer === true
                  ? content.correctAnswer
                    ? 'text-flexoki-green'
                    : 'text-flexoki-red'
                  : 'text-muted-foreground',
              )}
            >
              True
            </span>
          </div>
          <div
            className={cn(
              'group/option relative flex items-center justify-center gap-3 p-6',
              'rounded-xl border transition-all duration-300',
              progressState.selectedAnswer === false
                ? content.correctAnswer === false
                  ? 'border-flexoki-green/20 bg-flexoki-green/[0.03]'
                  : 'border-flexoki-red/20 bg-flexoki-red/[0.03]'
                : 'border-border/10 opacity-40',
            )}
          >
            <XIcon
              className={cn(
                'h-8 w-8',
                progressState.selectedAnswer === false
                  ? content.correctAnswer === false
                    ? 'text-flexoki-green'
                    : 'text-flexoki-red'
                  : 'text-muted-foreground',
              )}
            />
            <span
              className={cn(
                'font-medium text-xl',
                progressState.selectedAnswer === false
                  ? content.correctAnswer === false
                    ? 'text-flexoki-green'
                    : 'text-flexoki-red'
                  : 'text-muted-foreground',
              )}
            >
              False
            </span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div
        className={cn(
          'mx-auto w-full max-w-[700px] rounded-lg border p-4 transition-all duration-300',
          isCorrect
            ? 'border-flexoki-green/10 bg-flexoki-green/[0.02]'
            : 'border-flexoki-red/10 bg-flexoki-red/[0.02]',
        )}
      >
        <h3
          className={cn(
            'mb-3 font-medium text-xs uppercase tracking-wide',
            isCorrect ? 'text-flexoki-green/60' : 'text-flexoki-red/60',
          )}
        >
          Explanation
        </h3>
        <p className="text-muted-foreground/90 text-sm">
          {content.explanation}
        </p>
        {!isCorrect && (
          <p className="mt-3 text-sm">
            <span className="text-muted-foreground/60">Correct answer: </span>
            <span className="font-medium text-flexoki-green/70">
              {content.correctAnswer ? 'True' : 'False'}
            </span>
          </p>
        )}
      </div>
    </StepCard>
  );
};
