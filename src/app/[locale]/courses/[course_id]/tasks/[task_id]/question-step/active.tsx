'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';

interface ActiveQuestionStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  questionBody: string;
  alternatives: string[];
}

const shapes = [
  {
    name: 'triangle',
    color: 'var(--color-flexoki-red)',
    bgClass: 'bg-flexoki-red',
    textClass: 'text-flexoki-red',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Triangle shape"
      >
        <title>Triangle</title>
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
    ),
  },
  {
    name: 'diamond',
    color: 'var(--color-flexoki-blue)',
    bgClass: 'bg-flexoki-blue',
    textClass: 'text-flexoki-blue',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Diamond shape"
      >
        <title>Diamond</title>
        <rect x="0" y="0" width="20" height="20" transform="rotate(45 12 12)" />
      </svg>
    ),
  },
  {
    name: 'circle',
    color: 'var(--color-flexoki-yellow)',
    bgClass: 'bg-flexoki-yellow',
    textClass: 'text-flexoki-yellow',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Circle shape"
      >
        <title>Circle</title>
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    name: 'square',
    color: 'var(--color-flexoki-green)',
    bgClass: 'bg-flexoki-green',
    textClass: 'text-flexoki-green',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Square shape"
      >
        <title>Square</title>
        <rect x="2" y="2" width="20" height="20" />
      </svg>
    ),
  },
];

export const ActiveQuestionStep = ({
  id,
  stepOrder,
  totalSteps,
  alternatives,
  questionBody,
}: ActiveQuestionStepProps) => {
  const status = useFormStatus();

  return (
    <div className="relative w-full">
      <div className="group relative w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-background to-background/80 transition-all duration-500 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.075] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />

        {/* Task type indicator */}
        <div className="-translate-x-1/2 absolute top-4 left-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-0.5 font-medium text-primary/70 text-xs">
            Question
          </span>
        </div>

        <div className="relative px-8 pt-14 pb-12">
          <div className="relative space-y-10">
            {/* Question body */}
            <div className="mx-auto max-w-[700px] text-center">
              <h1 className="font-medium text-2xl text-foreground/90 tracking-tight md:text-3xl">
                {questionBody}
              </h1>
            </div>

            {/* Alternatives */}
            <RadioGroup
              className="mx-auto w-full max-w-[700px]"
              name="selectedAlternative"
              disabled={status.pending}
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {alternatives.map((alternative, index) => {
                  const shape = shapes[index % shapes.length];
                  return (
                    <div
                      key={alternative}
                      className={cn(
                        'group/option relative transition-all duration-300',
                        'data-[state=checked]:ring-2',
                        'data-[state=checked]:ring-current',
                        'data-[state=checked]:bg-current/[0.03]',
                      )}
                      style={
                        {
                          '--shape-color': shape.color,
                          color: shape.color,
                        } as React.CSSProperties
                      }
                    >
                      {/* Content */}
                      <div className="relative flex h-full items-center gap-3 rounded-lg border border-current/10 p-4 transition-all duration-300 hover:bg-current/[0.02] group-data-[state=checked]/option:bg-current/[0.03]">
                        <div className="shrink-0 opacity-40 transition-opacity duration-300 group-hover/option:opacity-60 group-data-[state=checked]/option:opacity-80">
                          {shape.icon}
                        </div>
                        <RadioGroupItem
                          value={alternative}
                          id={`question-${id}-alternative-${index}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`question-${id}-alternative-${index}`}
                          className="grow cursor-pointer font-medium text-base"
                        >
                          {alternative}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Loading state */}
            {status.pending && (
              <div className="flex items-center justify-center gap-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30" />
              </div>
            )}

            {/* Decorative divider */}
            <div className="relative mt-8 opacity-20 transition-opacity duration-300 group-hover:opacity-30">
              <svg
                className="h-6 w-full text-primary/30"
                viewBox="0 0 400 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M180 12h-160c-.6 0-1-.4-1-1s.4-1 1-1h160c.6 0 1 .4 1 1s-.4 1-1 1zm200 0h-160c-.6 0-1-.4-1-1s.4-1 1-1h160c.6 0 1 .4 1 1s-.4 1-1 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
