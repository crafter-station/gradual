import { TaskCard, TaskCardXD } from '@/components/task-card';
import { buttonVariants } from '@/components/ui/button';
import {
  getCourses,
  getTasksOfUnitAndSection,
  getUnitAndSection,
} from '@/db/utils';
import { getStaticParams } from '@/locales/server';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import React from 'react';
import { z } from 'zod';

export const experimental_ppr = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const courses = await getCourses.execute();
  const locales = getStaticParams();

  return locales.flatMap((locale) =>
    courses.map((course) => ({
      ...locale,
      course_id: course.id,
      unit_order: '1',
      section_order: '1',
    })),
  );
}

export default async function TasksPage({
  params,
}: Readonly<{
  params: Promise<{
    course_id: string;
    unit_order: string;
    section_order: string;
    locale: string;
  }>;
}>) {
  const { course_id, unit_order, section_order, locale } = await params;
  setStaticParamsLocale(locale);

  const { unitOrder, sectionOrder } = z
    .object({
      unitOrder: z.coerce.number(),
      sectionOrder: z.coerce.number(),
    })
    .parse({
      unitOrder: unit_order,
      sectionOrder: section_order,
    });

  const tasks = await getTasksOfUnitAndSection.execute({
    courseId: course_id,
    unitOrder,
    sectionOrder,
  });

  const [
    {
      courseUnitCount,

      unitTitle,
      unitDescription,
      unitSectionCount,

      sectionTitle,
      sectionDescription,
    },
  ] = await getUnitAndSection.execute({
    courseId: course_id,
    unitOrder,
    sectionOrder,
  });

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="animate-fade-up font-semibold text-2xl tracking-tight">
          Unit {unitOrder}: {unitTitle}
        </h2>
        <p className="animate-fade-up text-muted-foreground text-sm">
          {unitDescription}
        </p>
      </div>
      <div>
        <h2 className="animate-fade-up font-semibold text-2xl tracking-tight">
          Section {sectionOrder}: {sectionTitle}
        </h2>
        <p className="animate-fade-up text-muted-foreground text-sm">
          {sectionDescription}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
          return (
            <React.Suspense
              fallback={
                <TaskCardXD
                  task={task}
                  unitOrder={unitOrder}
                  sectionOrder={sectionOrder}
                  progress={undefined}
                />
              }
              key={task.id}
            >
              <TaskCard
                key={task.id}
                task={task}
                unitOrder={unitOrder}
                sectionOrder={sectionOrder}
              />
            </React.Suspense>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        {sectionOrder > 1 ? (
          <Link
            prefetch
            href={`/courses/${course_id}/tasks/u/${unitOrder}/s/${sectionOrder - 1}`}
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous Section
          </Link>
        ) : (
          unitOrder > 1 && (
            <Link
              prefetch
              href={`/courses/${course_id}/tasks/u/${unitOrder - 1}/s/1`}
              className={buttonVariants({ variant: 'outline' })}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Previous Unit
            </Link>
          )
        )}
        {sectionOrder < unitSectionCount ? (
          <Link
            prefetch
            href={`/courses/${course_id}/tasks/u/${unitOrder}/s/${sectionOrder + 1}`}
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowRightIcon className="h-4 w-4" />
            Next Section
          </Link>
        ) : (
          unitOrder < courseUnitCount && (
            <Link
              prefetch
              href={`/courses/${course_id}/tasks/u/${unitOrder + 1}/s/1`}
              className={buttonVariants({ variant: 'outline' })}
            >
              <ArrowRightIcon className="h-4 w-4" />
              Next Unit
            </Link>
          )
        )}
      </div>
    </div>
  );
}
