import { Progress } from '@/components/ui/progress';
import { db } from '@/db';
import { taskProgress } from '@/db/schema';
import { getI18n } from '@/locales/server';
import { eq, inArray } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { getCurrentUser } from './tasks/[task_id]/helpers';

import { CourseHeader } from './components/course-header';
import { CourseHero } from './components/course-hero';
import { CourseTabs } from './components/course-tabs';
import type { CourseWithRelations } from '@/db/types';

export const metadata = {
  title: 'Course',
};

export const revalidate = 0;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
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
      },
    },
  });

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t('course.notFound')}
      </div>
    );
  }

  const selectedTasks = course.units
    .flatMap((unit) =>
      unit.modules.flatMap((module) =>
        module.tasks.map((task) => ({
          ...task,
          module: {
            ...module,
            tasks: undefined,
            unit: {
              ...unit,
              modules: undefined,
            },
          },
        })),
      ),
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

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

async function TaskProgress({
  stepsCount,
  stepsCompletedCount,
}: {
  stepsCount: number;
  stepsCompletedCount: number;
}) {
  return (
    <Progress
      value={(stepsCompletedCount / stepsCount) * 100}
      className="h-1.5 overflow-hidden rounded-full"
    />
  );
}
