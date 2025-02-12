import { Button } from '@/components/ui/button';
import { UnitsWithConnector } from '@/components/units-with-connector';
import type { CourseWithRelations } from '@/db/types';
import type { TFunction } from '@/locales/types';
import { FileTextIcon } from 'lucide-react';

interface SyllabusTabProps {
  course: CourseWithRelations;
  t: TFunction;
}

export function SyllabusTab({ course, t }: SyllabusTabProps) {
  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between px-6">
        <div className="space-y-1">
          <h2 className="animate-fade-up font-semibold text-2xl">
            {t('course.syllabus.title')}
          </h2>
          <p className="animate-fade-up text-muted-foreground delay-100">
            {t('course.syllabus.description')}
          </p>
        </div>
        <Button variant="outline" className="animate-fade-left gap-2">
          <FileTextIcon className="h-4 w-4" />
          {t('course.syllabus.download')}
        </Button>
      </div>

      <div className="relative min-h-[400px] w-full">
        <div className="mx-auto max-w-4xl">
          <UnitsWithConnector units={course.units} />
        </div>
      </div>
    </div>
  );
}
