import { getI18n } from '@/locales/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Book } from '@/components/book';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Gauge } from '@/components/gauge';
import { cn } from '@/lib/utils';
import { db } from '@/db';
import {
  HomeIcon,
  DatabaseIcon,
  LayersIcon,
  BookOpenIcon,
  ClockIcon,
  ChevronRightIcon,
  LockIcon,
} from 'lucide-react';

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
          modules: true,
        },
      },
    },
  });

  if (!course) {
    return <div>{t('course.notFound')}</div>;
  }

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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.units.map((unit, index) => {
              const isAvailable = index < 3;
              return (
                <Card key={unit.id} className="group relative overflow-hidden">
                  <CardContent
                    className={cn('p-4', {
                      'opacity-50': !isAvailable,
                    })}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-full',
                            isAvailable
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground grayscale',
                          )}
                        >
                          <span className="font-medium font-mono text-lg">
                            T{Number(unit.order) + 1}
                          </span>
                        </div>
                        <div className="w-full min-w-0 flex-1">
                          <p className="text-muted-foreground text-xs">
                            {t('course.topic.sections', {
                              completed: unit.modules.length,
                              total: unit.modules.length,
                            })}
                          </p>

                          <div className="flex w-full items-center justify-between gap-4">
                            <h3 className="mt-1 font-semibold leading-tight">
                              {unit.title}
                            </h3>
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                              <Gauge
                                value={75}
                                size="small"
                                showValue
                                className="h-full w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {isAvailable ? (
                        <Button variant="outline" asChild className="mt-1">
                          <Link href={`/courses/${course.id}/units/${unit.id}`}>
                            <span className="text-xs">
                              {t('course.topic.study')}
                            </span>
                            <ChevronRightIcon className="h-3 w-3 opacity-50" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="mt-1 cursor-not-allowed"
                          disabled
                        >
                          <span className="text-xs">
                            {t('course.topic.locked')}
                          </span>
                          <LockIcon className="ml-1 h-3 w-3 opacity-50" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
