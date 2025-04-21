'use client';

import { StepCard } from '@/components/step-card';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface ActiveBinaryStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  questionBody: string;
}

export const ActiveBinaryStep = ({
  id,
  stepOrder,
  totalSteps,
  questionBody,
}: ActiveBinaryStepProps) => {
  const status = useFormStatus();

  return (
    <StepCard stepType="True or False">
      {/* Question body */}
      <div className="mx-auto max-w-[700px] text-center">
        <h1 className="font-medium text-2xl text-foreground/90 tracking-tight md:text-3xl">
          {questionBody}
        </h1>
      </div>

      {/* Binary options */}
      <div className="mx-auto w-full max-w-[700px]">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            name="binaryAnswer"
            value="true"
            disabled={status.pending}
            className={cn(
              'group/option relative flex items-center justify-center gap-3 p-6',
              'rounded-xl border border-flexoki-green/10 transition-all duration-300',
              'hover:border-flexoki-green/20 hover:bg-flexoki-green/[0.02]',
              'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            <CheckIcon className="h-8 w-8 text-flexoki-green/60" />
            <span className="font-medium text-flexoki-green/80 text-xl">
              True
            </span>
          </button>
          <button
            type="submit"
            name="binaryAnswer"
            value="false"
            disabled={status.pending}
            className={cn(
              'group/option relative flex items-center justify-center gap-3 p-6',
              'rounded-xl border border-flexoki-red/10 transition-all duration-300',
              'hover:border-flexoki-red/20 hover:bg-flexoki-red/[0.02]',
              'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
            )}
          >
            <XIcon className="h-8 w-8 text-flexoki-red/60" />
            <span className="font-medium text-flexoki-red/80 text-xl">
              False
            </span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {status.pending && (
        <div className="flex items-center justify-center gap-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30" />
        </div>
      )}
    </StepCard>
  );
};
