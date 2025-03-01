'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import ReactMarkdown from 'react-markdown';

interface ActiveQuestionStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  questionBody: string;
  alternatives: string[];
}

export const ActiveQuestionStep = ({
  id,
  stepOrder,
  totalSteps,
  alternatives,
  questionBody,
}: ActiveQuestionStepProps) => {
  const status = useFormStatus();

  return (
    <Card className={cn('relative transition-all duration-300 ease-in-out')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>
            {stepOrder} / {totalSteps}{' '}
            <span className="font-bold">Question</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReactMarkdown>{questionBody}</ReactMarkdown>
        <RadioGroup
          className="gap-2"
          name="selectedAlternative"
          disabled={status.pending}
        >
          {alternatives.map((alternative, index) => (
            <div
              key={alternative}
              className={cn(
                'has-data-[state=checked]:!border-primary relative flex w-full items-center gap-2 rounded-lg border p-4 shadow-black/5 shadow-sm',
              )}
            >
              <RadioGroupItem
                value={alternative}
                id={`question-${id}-alternative-${index}`}
                className="after:absolute after:inset-0"
              />

              <Label
                htmlFor={`question-${id}-alternative-${index}`}
                className="flex grow cursor-pointer items-center justify-between text-[14px]"
              >
                {alternative}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {status.pending && (
          <div className="flex items-center justify-center">
            <p>Submitting...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
