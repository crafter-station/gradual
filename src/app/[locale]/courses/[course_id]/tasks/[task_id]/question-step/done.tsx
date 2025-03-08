import { StepCard } from '@/components/step-card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { StepContent } from '@/db/schema/step';
import type { StepProgressState } from '@/db/schema/step-progress/progress-state';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DoneQuestionStepProps {
  id: string;
  progressState: StepProgressState & {
    type: 'QUESTION';
  };
  content: StepContent & {
    type: 'QUESTION';
  };
  stepOrder: number;
  totalSteps: number;
}

export const DoneQuestionStep = ({
  id,
  progressState,
  content,
  stepOrder,
  totalSteps,
}: DoneQuestionStepProps) => {
  const alternatives = [
    {
      alternative: content.correctAlternative,
      explanation: content.correctAlternativeExplanation,
    },
    ...content.distractors,
  ].sort(() => Math.random() - 0.5);

  const isCorrect =
    progressState.selectedAlternative === content.correctAlternative;

  const explanation = alternatives.find(
    ({ alternative }) => alternative === progressState.selectedAlternative,
  )?.explanation;

  const getAnswerState = (alternative: string) => {
    if (alternative === content.correctAlternative) return 'correct';
    if (alternative === progressState.selectedAlternative) return 'incorrect';
    return 'muted';
  };

  return (
    <StepCard stepType="Question" isDone={true} isCorrect={isCorrect}>
      {/* Title */}
      <h1 className="text-center font-medium font-sans text-xl">
        {content.questionBody}
      </h1>

      {/* Alternatives */}
      <RadioGroup
        className="mt-6 space-y-3"
        name="selectedAlternative"
        defaultValue={progressState.selectedAlternative}
        disabled
      >
        {alternatives.map(({ alternative }, index) => {
          const state = getAnswerState(alternative);
          return (
            <Label
              key={alternative}
              htmlFor={`question-${id}-alternative-${index}`}
              className={cn(
                'group/option relative cursor-pointer transition-all duration-300',
                'rounded-lg border',
                state === 'correct' &&
                  'border-flexoki-green/40 bg-flexoki-green/5',
                state === 'incorrect' &&
                  'border-flexoki-red/40 bg-flexoki-red/5',
                state === 'muted' && 'border-border/20 opacity-50',
              )}
            >
              <div className="relative flex h-full items-center gap-3 px-4 py-3">
                <RadioGroupItem
                  value={alternative}
                  id={`question-${id}-alternative-${index}`}
                  index={index}
                  className={cn(
                    state === 'correct' && 'text-flexoki-green',
                    state === 'incorrect' && 'text-flexoki-red',
                    state === 'muted' && 'text-muted-foreground',
                  )}
                />
                <div
                  className={cn(
                    'flex-1 font-medium leading-6',
                    state === 'correct' && 'text-flexoki-green',
                    state === 'incorrect' && 'text-flexoki-red',
                    state === 'muted' && 'text-muted-foreground',
                  )}
                >
                  {alternative}
                </div>
                {(state === 'correct' || state === 'incorrect') && (
                  <div className="shrink-0">
                    {state === 'correct' ? (
                      <CheckIcon className="h-4 w-4 text-flexoki-green/70" />
                    ) : (
                      <XIcon className="h-4 w-4 text-flexoki-red/70" />
                    )}
                  </div>
                )}
              </div>
            </Label>
          );
        })}
      </RadioGroup>

      {/* Explanation */}
      {explanation && (
        <div
          className={cn(
            'mt-6 rounded-lg border p-4 transition-all duration-300',
            isCorrect
              ? 'border-flexoki-green/10 bg-flexoki-green/[0.02]'
              : 'border-flexoki-red/10 bg-flexoki-red/[0.02]',
          )}
        >
          <p
            className={cn(
              'mb-3 flex items-center gap-2 border-flexoki-red border-b pb-4 font-medium text-sm',
              isCorrect ? 'text-flexoki-green' : 'text-flexoki-red',
            )}
          >
            {isCorrect ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Correct
              </>
            ) : (
              <>
                <XIcon className="h-4 w-4" />
                Incorrect
              </>
            )}
          </p>
          <h3
            className={cn(
              'mb-3 font-medium text-flexoki-blue text-xs uppercase tracking-wide',
            )}
          >
            Explanation
          </h3>
          <div className="prose prose-sm prose-neutral dark:prose-invert">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
          {!isCorrect && (
            <p className="mt-3 text-sm">
              <span className="text-muted-foreground">Correct answer: </span>
              <span className="font-medium text-flexoki-green">
                {content.correctAlternative}
              </span>
            </p>
          )}
        </div>
      )}
    </StepCard>
  );
};
