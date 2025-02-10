'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { completeTutorialAction } from './tutorial-step.action';

type TutorialStepProps = {
  id: string;
  isLastVisibleStep: boolean;
  isSecondLastVisibleStep: boolean;
  stepIndex: number;
  title: string;
  body: string;
};

export const TutorialStep = ({
  id,
  isLastVisibleStep,
  isSecondLastVisibleStep,
  stepIndex,
  title,
  body,
}: TutorialStepProps) => {
  const { course_id, task_id } = useParams<{
    course_id: string;
    task_id: string;
  }>();
  const [isBlurred, setIsBlurred] = React.useState(isSecondLastVisibleStep);
  const [state, action, isSubmitting] = React.useActionState(
    completeTutorialAction,
    undefined,
  );

  const router = useRouter();

  React.useEffect(() => {
    if (state?.success) {
      router.push(`/courses/${course_id}/tasks/${task_id}`);
    }
  }, [state, router, course_id, task_id]);

  return (
    <Card
      key={id}
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isLastVisibleStep && ['opacity-100 ring-2 ring-primary', 'my-14'],
      )}
    >
      {isBlurred && (
        <div className="">
          <div className="absolute inset-0 z-10 rounded-md bg-background/70 backdrop-blur-sm" />
          <Button
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-20"
            onClick={() => setIsBlurred(false)}
          >
            Show Section
          </Button>
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
            {stepIndex + 1}
          </span>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose dark:prose-invert">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
        {!state?.success && (
          <form action={action}>
            <input type="hidden" name="taskId" defaultValue={task_id} />
            {isLastVisibleStep && (
              <Button className="w-full" type="submit" disabled={isSubmitting}>
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
