import { Book } from '@/components/book';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { db } from '@/db';
import { cn } from '@/lib/utils';
import { getI18n } from '@/locales/server';
import {
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  DatabaseIcon,
  HomeIcon,
  LayersIcon,
} from 'lucide-react';
import Link from 'next/link';

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
    return <div>{t('course.notFound')}</div>;
  }

  console.log(course.units[0].modules[0]);

  // Select 4 random tasks and track their modules
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
    .slice(0, 4);

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">
                  <HomeIcon size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">{t('breadcrumbs.home')}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses">
                  {t('breadcrumbs.courses')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="w-full p-6">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <Book
                title={course.title ?? ''}
                variant="default"
                size="sm"
                textured
                className="w-[120px]"
                illustration={
                  <DatabaseIcon className="h-8 w-8 text-primary-foreground" />
                }
              />
            </div>
            <div className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    <LayersIcon className="h-4 w-4" />
                    <span>
                      {t('course.stats.topics', { count: course.units.length })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpenIcon className="h-4 w-4" />
                    <span>
                      {t('course.stats.sections', {
                        count: 5,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {t('course.stats.continue.title')}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {t('course.stats.continue.progress', {
                                percentage: Math.round(75),
                              })}
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground text-sm">
                            {t('course.stats.continue.subtitle')}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={75} className="h-2 flex-1" />
                          <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-[200px]">
                    <CardContent className="h-full p-4">
                      <div className="flex h-full items-center justify-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ClockIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {t('course.stats.completed.count', {
                              completed: 6,
                              total: 10,
                            })}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {t('course.stats.completed.title')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
            <div className="order-2 col-span-1 mr-0 sm:order-1 sm:mr-8">
              <h2>Syllabus</h2>

              <Accordion type="single" collapsible>
                {course.units.map((unit, unitIndex) => (
                  <AccordionItem key={unit.id} value={unit.id}>
                    <AccordionTrigger className="relative cursor-pointer">
                      {unitIndex + 1}. {unit.title}
                      <span className="-translate-y-1/2 absolute top-1/2 right-6 text-muted-foreground text-xs">
                        {unit.modules.length} modules
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {unit.modules.map((module, moduleIndex) => {
                          const mastery100 = Math.round(Math.random() * 100);
                          const mastery75 = Math.round(
                            Math.random() * (100 - mastery100),
                          );
                          const mastery50 = Math.round(
                            Math.random() * (100 - mastery100 - mastery75),
                          );

                          return (
                            <div key={module.id}>
                              <h3 className="font-medium text-sm">
                                {unitIndex + 1}.{moduleIndex + 1}.{' '}
                                {module.title}
                              </h3>
                              <div className="grid border [grid-template-columns:repeat(100,minmax(0,1fr))]">
                                <div
                                  style={{
                                    gridColumn: `span ${mastery100} / span ${mastery100}`,
                                  }}
                                  className="h-2 bg-accent"
                                />
                                <div
                                  style={{
                                    gridColumn: `span ${mastery75} / span ${mastery75}`,
                                  }}
                                  className="h-2 bg-accent/60"
                                />
                                <div
                                  style={{
                                    gridColumn: `span ${mastery50} / span ${mastery50}`,
                                  }}
                                  className="h-2 bg-accent/40"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="order-1 col-span-1 grid h-min gap-4 sm:order-2 sm:col-span-1 sm:grid-cols-1 lg:col-span-2 lg:grid-cols-2">
              {selectedTasks.map((task, index) => {
                return (
                  <Card
                    key={task.id}
                    className="group relative overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-3">
                          <div
                            className={cn(
                              'flex items-center justify-between text-primary',
                            )}
                          >
                            <Badge
                              variant={
                                {
                                  QUIZ: 'outline' as const,
                                  LESSON: 'default' as const,
                                  MULTISTEP: 'secondary' as const,
                                }[task.type]
                              }
                            >
                              {task.type}
                            </Badge>
                            <span className="font-bold font-mono text-muted-foreground text-xs tabular-nums">
                              {task.experiencePoints} XP
                            </span>
                          </div>
                          <p className="text-balance font-medium text-sm">
                            {task.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {task.module.unit.order}.{task.module.order}.{' '}
                            {task.module.title}
                          </p>
                        </div>
                        <Link
                          href={`/courses/${course.id}/tasks/${task.id}`}
                          className={cn(buttonVariants({ variant: 'outline' }))}
                        >
                          {t('course.stats.continue.title')}
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
