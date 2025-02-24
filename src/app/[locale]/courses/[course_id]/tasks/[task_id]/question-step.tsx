'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { submitAnswerAction } from './question-step.action';

interface Alternative {
  text: string;
  explanation: string;
  isCorrect: boolean;
  order: number;
}

interface QuestionStepProps {
  id: string;
  type: 'QUESTION';
  question: string;
  alternatives: Alternative[];
  isLastVisibleStep: boolean;
  isCorrect?: boolean;
  stepIndex: number;
  explanation?: string;
  selectedAlternativeOrder?: number;
  isLastStep: boolean;
  correctAlternativeOrder?: number;
}

export const QuestionStep = ({
  id,
  alternatives,
  question,
  selectedAlternativeOrder,
  stepIndex,
  explanation: initialExplanation,
  isCorrect: initialIsCorrect,
  correctAlternativeOrder,
  isLastStep,
  isLastVisibleStep,
}: QuestionStepProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { task_id, course_id } = useParams<{
    task_id: string;

    course_id: string;
  }>();

  const [state, action, isSubmitting] = React.useActionState(
    submitAnswerAction,
    undefined,
  );

  const [explanation, setExplanation] = React.useState<string | undefined>(
    initialExplanation,
  );

  const [isCorrect, setIsCorrect] = React.useState<boolean | undefined>(
    initialIsCorrect,
  );

  const router = useRouter();

  React.useEffect(() => {
    if (state?.success) {
      setExplanation(state.data.explanation);
      setIsCorrect(state.data.isCorrect);
    }
  }, [state]);

  React.useEffect(() => {
    if (state?.success) {
      if (isLastStep) {
        router.push(`/courses/${course_id}/tasks/${task_id}`);
      }
    }
  }, [state, isLastStep, course_id, task_id, router]);

  React.useEffect(() => {
    if (isLastVisibleStep) {
      const container = containerRef.current;
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isLastVisibleStep]);

  return (
    <Card
      key={id}
      ref={containerRef}
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isLastVisibleStep && ['opacity-100 ring-2 ring-primary', 'my-14'],
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Question {stepIndex + 1}</span>
          {isCorrect && (
            <span className="text-sm text-success">You got it right!</span>
          )}
        </CardTitle>
      </CardHeader>
      <form action={action}>
        <input type="hidden" name="taskId" defaultValue={task_id} />
        <CardContent className="space-y-4">
          <ReactMarkdown>{question}</ReactMarkdown>
          <RadioGroup
            className="gap-2"
            name="selectedAlternativeOrder"
            key={
              state?.form?.selectedAlternativeOrder.toString() +
              String(state?.success)
            }
            defaultValue={
              selectedAlternativeOrder?.toString() ??
              state?.form?.selectedAlternativeOrder?.toString()
            }
            disabled={!!explanation}
          >
            {alternatives
              .toSorted((a, b) => a.order - b.order)
              .map((alternative, index) => (
                <div
                  key={alternative.order}
                  className={cn(
                    'has-data-[state=checked]:!border-primary relative flex w-full items-center gap-2 rounded-lg border p-4 shadow-black/5 shadow-sm',
                    (selectedAlternativeOrder ??
                      state?.form?.selectedAlternativeOrder) ===
                      alternative.order &&
                      (isCorrect
                        ? 'border-success bg-success/10'
                        : 'border-destructive bg-destructive/10'),
                  )}
                >
                  <RadioGroupItem
                    value={alternative.order.toString()}
                    id={`question-${id}-answer-${index}`}
                    className="after:absolute after:inset-0"
                  />

                  <Label
                    htmlFor={`question-${id}-answer-${index}`}
                    className="flex grow cursor-pointer items-center justify-between text-[14px]"
                  >
                    {alternative.text}

                    {(selectedAlternativeOrder ??
                      state?.form?.selectedAlternativeOrder) ===
                      alternative.order &&
                      (isCorrect ? (
                        <CheckIcon className="h-4 w-4 text-success" />
                      ) : (
                        <XIcon className="h-4 w-4 text-destructive" />
                      ))}
                  </Label>
                </div>
              ))}
          </RadioGroup>

          {explanation && (
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
                  <span className="font-bold">
                    {
                      alternatives.find(
                        (alternative) =>
                          alternative.order === correctAlternativeOrder,
                      )?.text
                    }
                  </span>
                </p>
              )}
            </div>
          )}
          {isLastVisibleStep && (
            <>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn('w-full', explanation && 'hidden')}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
              <Link
                href={`/courses/${course_id}/tasks/${task_id}`}
                className={cn(
                  buttonVariants({
                    variant: 'default',
                  }),
                  'w-full',
                  !explanation && 'hidden',
                  isLastStep && 'hidden',
                )}
                prefetch={false}
              >
                Next
              </Link>
            </>
          )}
        </CardContent>
      </form>
    </Card>
  );
};
