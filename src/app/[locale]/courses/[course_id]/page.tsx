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

export default async function CoursePage({
  params,
}: Readonly<{
  params: Promise<{ course_id: string }>;
}>) {
  const { course_id: courseId } = await params;
  const t = await getI18n();
  const currentUser = await getCurrentUser();

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

  const modules = units.length
    ? await db.query.module.findMany({
        where: (module, { inArray }) =>
          inArray(
            module.unitId,
            units.map((unit) => unit.id),
          ),
      })
    : [];

  const tasks = modules.length
    ? await db.query.task.findMany({
        where: (task, { inArray }) =>
          inArray(
            task.moduleId,
            modules.map((module) => module.id),
          ),
      })
    : [];

  const courseWithRelations = course
    ? {
        ...course,
        units: units.map((unit) => ({
          ...unit,
          modules: modules
            .filter((module) => module.unitId === unit.id)
            .map((module) => ({
              ...module,
              tasks: tasks.filter((task) => task.moduleId === module.id),
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
    unit.modules.flatMap((module) =>
      module.tasks.map((task) => ({
        ...task,
        module: {
          ...module,
          unit: {
            ...unit,
            modules: undefined,
          },
        },
      })),
    ),
  );

  selectedTasks.sort((a, b) => {
    const aUnitOrder = a.module.unit.order;
    const bUnitOrder = b.module.unit.order;
    const aModuleOrder = a.module.order;
    const bModuleOrder = b.module.order;
    const aTaskOrder = a.order;
    const bTaskOrder = b.order;

    // Create a combined order number for easier comparison
    // Multiply by large numbers to ensure proper ordering
    const aOrder = aUnitOrder * 10000 + aModuleOrder * 100 + aTaskOrder;
    const bOrder = bUnitOrder * 10000 + bModuleOrder * 100 + bTaskOrder;

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

        <CourseTabs
          course={courseWithRelations as CourseWithRelations}
          selectedTasks={selectedTasks}
          selectedTasksProgresses={selectedTasksProgresses}
          t={t}
        />
      </div>
    </div>
  );
}
