'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StepNavigationProps {
  totalSteps: number;
  visibleSteps: Array<{ id: string }>;
  currentStepIndex: number;
}

export function StepNavigation({
  totalSteps,
  visibleSteps,
  currentStepIndex,
}: StepNavigationProps) {
  const router = useRouter();

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < visibleSteps.length) {
      router.push(`?step=${stepIndex}`);
    }
  };

  return (
    <div className="mb-4 flex w-full max-w-[640px] items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => goToStep(currentStepIndex - 1)}
        disabled={currentStepIndex === 0}
        type="button"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>
      <div className="flex gap-1.5">
        {visibleSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => goToStep(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              index === currentStepIndex
                ? 'bg-primary'
                : 'bg-muted-foreground/20 hover:bg-muted-foreground/30',
            )}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => goToStep(currentStepIndex + 1)}
        disabled={currentStepIndex === visibleSteps.length - 1}
        type="button"
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
