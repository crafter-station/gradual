'use client';

import { StepCard } from '@/components/step-card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import React from 'react';
import { useFormStatus } from 'react-dom';

interface ActiveQuestionStepProps {
  questionBody: string;
  alternatives: string[];
}

export const ActiveQuestionStep = ({
  alternatives,
  questionBody,
}: ActiveQuestionStepProps) => {
  const status = useFormStatus();

  const id = React.useId();

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
        disabled={status.pending}
      >
        {alternatives.map((alternative, index) => {
          return (
            <div key={alternative} className="relative flex items-center">
              <RadioGroupItem
                value={alternative}
                id={`question-${id}-alternative-${index}`}
                className="peer absolute opacity-0"
              />
              <Label
                htmlFor={`question-${id}-alternative-${index}`}
                className={cn(
                  'w-full cursor-pointer transition-all duration-300',
                  'rounded-lg border',
                  'border-border/40 hover:border-border/60',
                  'peer-data-[state=checked]:border-primary/50',
                  'peer-data-[state=checked]:bg-primary/10',
                )}
              >
                <div className="relative flex h-full items-center gap-3 px-4 py-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-primary">
                    <div className="h-2 w-2 rounded-full bg-primary opacity-0 peer-data-[state=checked]:opacity-100" />
                  </div>
                  <div className={cn('flex-1 font-medium leading-6')}>
                    {alternative}
                  </div>
                </div>
              </Label>
            </div>
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
