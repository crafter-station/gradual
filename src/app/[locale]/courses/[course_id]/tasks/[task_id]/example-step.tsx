'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { completeExampleAction } from './example-step.action';

type ExampleStepProps = {
  id: string;
  isLastVisibleStep: boolean;

  stepIndex: number;
  body: string;
  answer: string;
};

export const ExampleStep = ({
  id,
  isLastVisibleStep,
  stepIndex,
  body,
  answer,
}: ExampleStepProps) => {
  const { course_id, task_id } = useParams<{
    course_id: string;
    task_id: string;
  }>();
  const [isBlurred, setIsBlurred] = React.useState(isLastVisibleStep);
  const [state, action, isSubmitting] = React.useActionState(
    completeExampleAction,
    undefined,
  );

  const router = useRouter();
  React.useEffect(() => {
    if (state?.success) {
      router.push(`/courses/${course_id}/tasks/${task_id}`);
    }
  }, [state, router, course_id, task_id]);

  return (
    <Card key={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
            {stepIndex + 1}
          </span>{' '}
          Example
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert mb-4">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
        {isBlurred ? (
          <Button
            onClick={() => setIsBlurred(false)}
            variant="outline"
            className="w-full"
          >
            Show Answer
          </Button>
        ) : (
          <div className="prose dark:prose-invert rounded-md border border-success bg-success/10 p-4">
            <div className="font-bold text-success">Answer</div>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
        {!state?.success && (
          <form action={action}>
            <input type="hidden" name="taskId" defaultValue={task_id} />

            {isLastVisibleStep && (
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
};
