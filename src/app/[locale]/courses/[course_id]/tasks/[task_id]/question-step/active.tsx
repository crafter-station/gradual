'use client';

import { StepCard } from '@/components/step-card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';

interface ActiveQuestionStepProps {
  id: string;
  questionBody: string;
  alternatives: string[];
  correctAnswer?: string;
  selectedAnswer?: string;
  stepOrder: number;
  totalSteps: number;
}

export const ActiveQuestionStep = ({
  id,
  alternatives,
  questionBody,
  correctAnswer,
  selectedAnswer,
  stepOrder,
  totalSteps,
}: ActiveQuestionStepProps) => {
  const status = useFormStatus();

  const getAnswerState = (alternative: string) => {
    if (!selectedAnswer) return 'default';
    if (alternative === correctAnswer) return 'correct';
    if (alternative === selectedAnswer) return 'incorrect';
    return 'muted';
  };

  return (
    <StepCard stepType="Question">
      {/* Title */}
      <h1 className="text-center font-medium font-sans text-xl">
        {questionBody}
      </h1>

      {/* Alternatives */}
      <RadioGroup
        className="mt-8 space-y-3"
        name="selectedAlternative"
        disabled={status.pending || !!selectedAnswer}
      >
        {alternatives.map((alternative, index) => {
          const state = getAnswerState(alternative);
          return (
            <Label
              key={alternative}
              htmlFor={`question-${id}-alternative-${index}`}
              className={cn(
                'group/option relative cursor-pointer transition-all duration-300',
                'rounded-lg border',
                state === 'default' &&
                  'border-border/40 hover:border-border/60',
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
              </div>
            </Label>
          );
        })}
      </RadioGroup>

      {/* Loading state */}
      {status.pending && (
        <div className="mt-6 flex items-center justify-center gap-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30" />
        </div>
      )}
    </StepCard>
  );
};
