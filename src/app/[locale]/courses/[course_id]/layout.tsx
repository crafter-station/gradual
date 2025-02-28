import { db } from '@/db';
import { taskProgress } from '@/db/schema';
import { getCourses, getCurrentUser } from '@/db/utils';
import { getI18n, getStaticParams } from '@/locales/server';
import { and, eq, inArray } from 'drizzle-orm';

import type { CourseWithRelations } from '@/db/types';
import { setStaticParamsLocale } from 'next-international/server';
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

  const currentUser = await getCurrentUser.execute();

  const [course, units] = await Promise.all([
    db.query.course.findFirst({
      where: (course, { eq }) => eq(course.id, courseId),
      with: {
        sources: true,
      },
    }),
    db.query.unit.findMany({
      where: (unit, { eq }) => eq(unit.courseId, courseId),
      orderBy: (unit, { asc }) => asc(unit.order),
    }),
  ]);

  const sections = units.length
    ? await db.query.section.findMany({
        where: (section, { inArray }) =>
          inArray(
            section.unitId,
            units.map((unit) => unit.id),
          ),
      })
    : [];

  const tasks = sections.length
    ? await db.query.task.findMany({
        where: (task, { inArray }) =>
          inArray(
            task.sectionId,
            sections.map((section) => section.id),
          ),
      })
    : [];

  const courseWithRelations = course
    ? {
        ...course,
        units: units.map((unit) => ({
          ...unit,
          sections: sections
            .filter((section) => section.unitId === unit.id)
            .map((section) => ({
              ...section,
              tasks: tasks.filter((task) => task.sectionId === section.id),
            })),
        })),
      }
    : null;

  if (!courseWithRelations) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t('course.notFound')}
      </div>
    );
  }

  const selectedTasks = courseWithRelations.units.flatMap((unit) =>
    unit.sections.flatMap((section) =>
      section.tasks.map((task) => ({
        ...task,
        section: {
          ...section,
          unit: {
            ...unit,
            sections: undefined,
          },
        },
      })),
    ),
  );

  selectedTasks.sort((a, b) => {
    const aUnitOrder = a.section.unit.order;
    const bUnitOrder = b.section.unit.order;
    const aSectionOrder = a.section.order;
    const bSectionOrder = b.section.order;
    const aTaskOrder = a.order;
    const bTaskOrder = b.order;

    // Create a combined order number for easier comparison
    // Multiply by large numbers to ensure proper ordering
    const aOrder = aUnitOrder * 10000 + aSectionOrder * 100 + aTaskOrder;
    const bOrder = bUnitOrder * 10000 + bSectionOrder * 100 + bTaskOrder;

    return aOrder - bOrder;
  });

  const selectedTasksProgresses = currentUser
    ? await db.query.taskProgress.findMany({
        where: and(
          eq(taskProgress.userId, currentUser.id),
          inArray(
            taskProgress.taskId,
            selectedTasks.map((task) => task.id),
          ),
        ),
      })
    : [];

  return (
    <div className="flex h-full flex-col">
      <CourseHeader course={courseWithRelations as CourseWithRelations} t={t} />

      <div className="flex-1 overflow-auto">
        <CourseHero course={courseWithRelations as CourseWithRelations} t={t} />

        <div className="mx-auto max-w-7xl px-6">
          <Tabs courseId={courseId} />

          {children}
        </div>
      </div>
    </div>
  );
}
