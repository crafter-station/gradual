'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

export const EnrollButton = () => {
  const searchParams = useSearchParams();
  const { pending } = useFormStatus();

  const enrollFirst = React.useMemo(
    () => searchParams.get('enroll-first'),
    [searchParams],
  );

  React.useEffect(() => {
    if (enrollFirst === 'true') {
      if (toast.getToasts().length === 0) {
        toast.success('You have to enroll first to take the lessons');
      }
    }
  }, [enrollFirst]);

  return (
    <Button disabled={pending} type="submit">
      {pending ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        'Enroll'
      )}
    </Button>
  );
};
