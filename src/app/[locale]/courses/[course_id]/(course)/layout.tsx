import { getCourse, getCourses } from '@/db/utils';
import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { CourseHeader } from './components/course-header';
import { CourseHero } from './components/course-hero';
import { Tabs } from './components/tabs';

export const metadata = {
  title: 'Course',
};

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

export const revalidate = 3600;

export default async function CoursePage({
  params,
  children,
}: Readonly<{
  params: Promise<{
    course_id: string;
    locale: string;
  }>;
  children: React.ReactNode;
}>) {
  const { course_id: courseId, locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const [course] = await getCourse.execute({ courseId });

  if (!course) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <CourseHeader courseTitle={course.title} t={t} />

      <div className="flex-1 overflow-auto">
        <CourseHero
          courseTitle={course.title}
          unitCount={course.unitCount}
          t={t}
        />

        <div className="mx-auto max-w-7xl px-6">
          <Tabs courseId={courseId} />

          {children}
        </div>
      </div>
    </div>
  );
}
