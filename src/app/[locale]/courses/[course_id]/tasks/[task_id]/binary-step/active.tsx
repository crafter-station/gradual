'use client';

import { StepCard } from '@/components/step-card';
import { CheckIcon, XIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ActiveBinaryStepProps {
  questionBody: string;
}

export const ActiveBinaryStep = ({ questionBody }: ActiveBinaryStepProps) => {
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
        <RadioGroup
          name="selectedAnswer"
          className="grid grid-cols-2 gap-4"
          disabled={status.pending}
          required
        >
          <div className="relative flex items-center">
            <RadioGroupItem
              value="true"
              id="true"
              className="peer absolute opacity-0"
            />
            <Label
              htmlFor="true"
              className="flex h-32 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-flexoki-green/10 transition-all duration-300 hover:border-flexoki-green/20 hover:bg-flexoki-green/20 peer-data-[state=checked]:border-flexoki-green/20 peer-data-[state=checked]:bg-flexoki-green/20"
            >
              <CheckIcon className="h-8 w-8 text-flexoki-green/60" />
              <span className="font-medium text-flexoki-green/80 text-xl">
                True
              </span>
            </Label>
          </div>

          <div className="relative flex items-center">
            <RadioGroupItem
              value="false"
              id="false"
              className="peer absolute opacity-0"
            />
            <Label
              htmlFor="false"
              className="flex h-32 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-flexoki-red/10 transition-all duration-300 hover:border-flexoki-red/20 hover:bg-flexoki-red/20 peer-data-[state=checked]:border-flexoki-red/20 peer-data-[state=checked]:bg-flexoki-red/20"
            >
              <XIcon className="h-8 w-8 text-flexoki-red/60" />
              <span className="font-medium text-flexoki-red/80 text-xl">
                False
              </span>
            </Label>
          </div>
        </RadioGroup>
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
