'use client';

import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

interface ActiveMultipleChoiceStepProps {
  id: string;
  content: StepContent & {
    type: 'MULTIPLE_CHOICE';
  };
}

export const ActiveMultipleChoiceStep = ({
  id,
  content,
}: ActiveMultipleChoiceStepProps) => {
  const status = useFormStatus();

  // Combine and randomize alternatives
  const [allAlternatives] = useState(() =>
    [...content.correctAlternatives, ...content.distractors].sort(
      () => Math.random() - 0.5,
    ),
  );

  // Track selected alternatives
  const [selectedAlternatives, setSelectedAlternatives] = useState<string[]>(
    [],
  );

  const toggleAlternative = (alternative: string) => {
    if (status.pending) return;

    setSelectedAlternatives((prev) =>
      prev.includes(alternative)
        ? prev.filter((a) => a !== alternative)
        : [...prev, alternative],
    );
  };

  return (
    <StepCard stepType="Multiple Choice">
      <div className="relative space-y-8">
        {/* Question */}
        <h1 className="text-center font-medium text-2xl text-foreground/90 tracking-tight">
          {content.questionBody}
        </h1>

        {/* Alternatives */}
        <div className="mx-auto w-full max-w-[700px]">
          <div className="grid grid-cols-1 gap-3">
            {allAlternatives.map((alternative) => {
              const isSelected = selectedAlternatives.includes(alternative);

              return (
                <button
                  key={alternative}
                  type="button"
                  onClick={() => toggleAlternative(alternative)}
                  disabled={status.pending}
                  className={cn(
                    'group/option relative transition-all duration-200',
                    'rounded-xl border text-left',
                    isSelected
                      ? 'border-primary/40 bg-primary/[0.03]'
                      : 'border-border hover:border-border/80 hover:bg-muted/40',
                    status.pending && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <div className="relative flex items-center gap-3 p-4">
                    {/* Checkbox */}
                    <div
                      className={cn(
                        'h-5 w-5 shrink-0 rounded-md border-2 transition-colors duration-200',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-muted-foreground/30 group-hover/option:border-muted-foreground/50',
                      )}
                    />

                    {/* Alternative text */}
                    <span
                      className={cn(
                        'font-medium text-base transition-colors duration-200',
                        isSelected
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover/option:text-foreground/80',
                      )}
                    >
                      {alternative}
                    </span>

                    {/* Loading indicator */}
                    {status.pending && isSelected && (
                      <Loader2Icon className="absolute right-4 h-5 w-5 animate-spin text-muted-foreground/40" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hidden input for form submission */}
        {selectedAlternatives.map((alternative) => (
          <input
            key={alternative}
            type="hidden"
            name="selectedAlternatives"
            value={alternative}
          />
        ))}
      </div>
    </StepCard>
  );
};
