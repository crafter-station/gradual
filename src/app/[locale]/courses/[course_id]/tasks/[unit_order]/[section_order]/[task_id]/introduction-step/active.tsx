import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StepContent } from '@/db/schema/step';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ActiveIntroductionStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'INTRODUCTION';
  };
}

export const ActiveIntroductionStep = ({
  stepOrder,
  totalSteps,
  content,
}: ActiveIntroductionStepProps) => {
  return (
    <Card className={cn('relative transition-all duration-300 ease-in-out')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>
            {stepOrder} / {totalSteps}{' '}
            <span className="font-bold">Introduction</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReactMarkdown>{content.body}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};
