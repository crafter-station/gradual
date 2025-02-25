'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="mt-4">
      {pending ? (
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
