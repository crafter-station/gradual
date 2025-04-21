'use client';

import { buttonVariants } from '@/components/ui/button';
import type { StepType } from '@/db/schema';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function StepButton({
  type,
}: Readonly<{
  type: StepType;
}>) {
  const pathname = usePathname();
  const isActive =
    pathname.replace('/design/steps/', '') === type.toLowerCase();

  return (
    <Link
      key={type}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'outline',
        }),
      )}
      href={`/design/steps/${type.toLowerCase()}`}
    >
      {type}
    </Link>
  );
}
