'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { FileTextIcon } from 'lucide-react';

export const ViewSourceButton = ({
  sourceUrl,
}: Readonly<{ sourceUrl: string }>) => {
  const t = useI18n();
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(buttonVariants({ variant: 'default' }))}
    >
      <FileTextIcon className="h-5 w-4" />
      {t('course.syllabus.viewSource')}
    </a>
  );
};
