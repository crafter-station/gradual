import { UnitsWithConnector } from '@/components/units-with-connector';
import type { CourseWithRelations } from '@/db/types';
import { getFullCourse } from '@/db/utils';
import { getI18n } from '@/locales/server';
import type { TFunction } from '@/locales/types';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { ViewSourceButton } from '../components/tabs/view-source-button';

interface SyllabusTabProps {
  course: CourseWithRelations;
  t: TFunction;
}

export default async function SyllabusPage({
  params,
}: Readonly<{
  params: Promise<{
    course_id: string;
    locale: string;
  }>;
}>) {
  const { course_id, locale } = await params;

  setStaticParamsLocale(locale);
  const t = await getI18n();

  const course = await getFullCourse.execute({ courseId: course_id });

  if (!course) {
    notFound();
  }

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
        {course.sources[0] && (
          <ViewSourceButton sourceUrl={course.sources[0].filePath} />
        )}
      </div>

      <div className="relative min-h-[400px] w-full">
        <div className="mx-auto max-w-4xl">
          <UnitsWithConnector units={course.units} />
        </div>
      </div>
    </div>
  );
}
