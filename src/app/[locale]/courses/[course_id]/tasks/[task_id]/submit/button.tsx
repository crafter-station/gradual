'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { submitStepAction } from './action';

export function SubmitButton() {
  const [state, formAction, isSubmitting] = React.useActionState(
    submitStepAction,
    undefined,
  );

  React.useEffect(() => {
    if (state?.success) {
      if (state.data.isCorrect === undefined) {
        toast.info("Let's move on!");
      } else {
        if (state.data.isCorrect) {
          toast.success('Correct!');
        } else {
          toast.error('Incorrect!');
        }
        state.data.explanation &&
          toast.info(`Explanation: ${state.data.explanation}`);
        state.data.correctAlternative &&
          toast.info(`Correct answer: ${state.data.correctAlternative}`);
      }
    }
  }, [state]);

  return (
    <Button type="submit" formAction={formAction} disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </Button>
  );
}
