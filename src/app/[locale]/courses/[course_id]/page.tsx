import { db } from '@/db';
import { taskProgress } from '@/db/schema';
import { getCurrentUser } from '@/db/utils';
import { getI18n } from '@/locales/server';
import { and, eq, inArray } from 'drizzle-orm';

import type { CourseWithRelations } from '@/db/types';
import { CourseHeader } from './components/course-header';
import { CourseHero } from './components/course-hero';
import { CourseTabs } from './components/course-tabs';

export const metadata = {
  title: 'Course',
};

export const revalidate = 0;

export default async function CoursePage({
  params,
}: Readonly<{
  params: Promise<{ course_id: string }>;
}>) {
  const { course_id: courseId } = await params;
  const t = await getI18n();
  const currentUser = await getCurrentUser();

  const course = await db.query.courses.findFirst({
    where: (courses, { eq }) => eq(courses.id, courseId),
    with: {
      units: {
        with: {
          modules: {
            with: {
              tasks: true,
            },
          },
        },
        orderBy: (units, { asc }) => asc(units.order),
      },
      sources: true,
    },
  });

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t('course.notFound')}
      </div>
    );
  }

  const selectedTasks = course.units[0].modules.flatMap((module) =>
    module.tasks.map((task) => ({
      ...task,
      module: {
        ...module,
        tasks: undefined,
        unit: {
          ...course.units[0],
          modules: undefined,
        },
      },
    })),
  );

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
      <CourseHeader course={course as CourseWithRelations} t={t} />

      <div className="flex-1 overflow-auto">
        <CourseHero course={course as CourseWithRelations} t={t} />

        <CourseTabs
          course={course as CourseWithRelations}
          selectedTasks={selectedTasks}
          selectedTasksProgresses={selectedTasksProgresses}
          t={t}
        />
      </div>
    </div>
  );
}
