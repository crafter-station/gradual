import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { StepContent } from '@/db/schema/step';
import type { StepProgressState } from '@/db/schema/step/progress-state';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DoneQuestionStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  progressState: StepProgressState & {
    type: 'QUESTION';
  };
  content: StepContent & {
    type: 'QUESTION';
  };
}

export const DoneQuestionStep = ({
  id,
  stepOrder,
  totalSteps,
  progressState,
  content,
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

  return (
    <Card className={cn('relative transition-all duration-300 ease-in-out')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>
            {stepOrder} / {totalSteps}{' '}
            <span className="font-bold">Question</span>
          </span>
          {isCorrect && (
            <span className="text-sm text-success">You got it right!</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReactMarkdown>{content.questionBody}</ReactMarkdown>
        <RadioGroup
          className="gap-2"
          name="selectedAlternativeOrder"
          defaultValue={progressState.selectedAlternative}
          disabled={true}
        >
          {alternatives.map(({ alternative }, index) => (
            <div
              key={alternative}
              className={cn(
                'has-data-[state=checked]:!border-primary relative flex w-full items-center gap-2 rounded-lg border p-4 shadow-black/5 shadow-sm',
                progressState.selectedAlternative === alternative &&
                  (isCorrect
                    ? 'border-success bg-success/10'
                    : 'border-destructive bg-destructive/10'),
              )}
            >
              <RadioGroupItem
                id={`question-${id}-answer-${index}`}
                value={alternative}
                className="after:absolute after:inset-0"
              />

              <Label
                htmlFor={`question-${id}-answer-${index}`}
                className="flex grow cursor-pointer items-center justify-between text-[14px]"
              >
                {alternative}

                {progressState.selectedAlternative === alternative &&
                  (isCorrect ? (
                    <CheckIcon className="h-4 w-4 text-success" />
                  ) : (
                    <XIcon className="h-4 w-4 text-destructive" />
                  ))}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 border-t pt-4">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-bold text-sm uppercase">Explanation</h3>
          </div>
          <div className="prose dark:prose-invert">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
          {!isCorrect && (
            <p className="mt-2 text-sm">
              Correct answer:{' '}
              <span className="font-bold">{content.correctAlternative}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
