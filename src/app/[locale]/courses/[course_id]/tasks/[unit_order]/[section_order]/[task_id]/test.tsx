'use client';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';

export function Test({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pending } = useFormStatus();

  return (
    <div className={cn(pending && 'animate-pulse bg-muted')}>
      {children}
      {pending && <span>Loading...</span>}
    </div>
  );
}
