import { buttonVariants } from '@/components/ui/button';
import { UnitsWithConnector } from '@/components/units-with-connector';
import { getCourses, getFullCourse } from '@/db/utils';
import { cn } from '@/lib/utils';
import { getI18n, getStaticParams } from '@/locales/server';
import { FileTextIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  const courses = await getCourses.execute();
  const locales = getStaticParams();

  return locales.flatMap((locale) =>
    courses.map((course) => ({
      ...locale,
      course_id: course.id,
    })),
  );
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
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="animate-fade-up font-semibold text-2xl">
            {t('course.syllabus.title')}
          </h2>
          <p className="animate-fade-up text-muted-foreground delay-100">
            {t('course.syllabus.description')}
          </p>
        </div>
        {course.sources[0] && (
          <a
            href={course.sources[0].filePath}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <FileTextIcon className="h-5 w-4" />
            {t('course.syllabus.viewSource')}
          </a>
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
