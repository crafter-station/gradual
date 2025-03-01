import { buttonVariants } from '@/components/ui/button';
import {
  getCourses,
  getTasksOfUnitAndSection,
  getUnitAndSection,
} from '@/db/utils';
import { getStaticParams } from '@/locales/server';
import { ArrowRightIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import React from 'react';
import { TaskCard, TaskCardXD } from './task-card';

export const experimental_ppr = true;
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

export default async function TasksPage({
  params,
}: Readonly<{
  params: Promise<{
    course_id: string;
    locale: string;
  }>;
}>) {
  const { course_id, locale } = await params;
  setStaticParamsLocale(locale);

  const tasks = await getTasksOfUnitAndSection.execute({
    courseId: course_id,
    unitOrder: 1,
    sectionOrder: 1,
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
    unitOrder: 1,
    sectionOrder: 1,
  });

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="animate-fade-up font-semibold text-2xl tracking-tight">
          Unit 1: {unitTitle}
        </h2>
        <p className="animate-fade-up text-muted-foreground text-sm">
          {unitDescription}
        </p>
      </div>
      <div>
        <h2 className="animate-fade-up font-semibold text-2xl tracking-tight">
          Section 1: {sectionTitle}
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
                  courseId={course_id}
                  unitOrder={1}
                  sectionOrder={1}
                  progress={null}
                />
              }
              key={task.id}
            >
              <TaskCard
                key={task.id}
                courseId={course_id}
                task={task}
                unitOrder={1}
                sectionOrder={1}
              />
            </React.Suspense>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Link
          prefetch
          href={`/courses/${course_id}/tasks/1/2`}
          className={buttonVariants({ variant: 'outline' })}
        >
          <ArrowRightIcon className="h-4 w-4" />
          Next Section
        </Link>
      </div>
    </div>
  );
}
