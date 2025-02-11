import { Book } from '@/components/book';
import { Gauge } from '@/components/gauge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { db } from '@/db';
import { bookStylesDark } from '@/lib/constants';
import { getI18n } from '@/locales/server';
import {
  ArrowRightIcon,
  BookOpenIcon,
  FileTextIcon,
  HomeIcon,
  TargetIcon,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Courses',
};

export const revalidate = 0;

export default async function CoursesPage() {
  const t = await getI18n();

  const courses = await db.query.courses.findMany({
    with: {
      units: true,
      sources: true,
    },
  });

  const getRandomBookStyle = () => {
    return bookStylesDark[
      Math.floor(Math.random() * bookStylesDark.length)
    ] as {
      color: string;
      icon: React.ComponentType<{ className: string }>;
    };
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 animate-fade-in" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="animate-fade-in">
                  <HomeIcon size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">{t('breadcrumbs.home')}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="animate-fade-in">
                  {t('breadcrumbs.courses')}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="animate-fade-in font-semibold text-2xl">
              {t('breadcrumbs.courses')}
            </h1>
            <Button
              asChild
              className="animate-fade-in transition-transform duration-300 hover:scale-105"
            >
              <Link href="/upload" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                {t('courses.uploadPdf')}
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course, index) => {
              const bookStyle = getRandomBookStyle();
              const IconComponent = bookStyle.icon;

              return (
                <Card
                  key={course.id}
                  className="group relative animate-fade-in overflow-hidden transition-all duration-500 ease-out hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative grid h-full grid-cols-[160px_1fr]">
                    <div className="flex items-center justify-center border-r bg-muted/5 p-4 transition-all duration-500 group-hover:bg-muted/10">
                      <div className="group-hover:-rotate-3 transform transition-all duration-500 group-hover:scale-105">
                        <Book
                          illustration={
                            <IconComponent className="size-8 group-hover:animate-pulse" />
                          }
                          title={course.title ?? ''}
                          color={bookStyle.color}
                          textured
                          size="sm"
                          className="w-[120px]"
                        />
                      </div>
                    </div>
                    <div className="flex h-full flex-col justify-between p-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg transition-colors duration-300 group-hover:text-primary">
                          {course.title}
                        </h3>

                        <div className="flex items-start justify-between">
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-300 group-hover:text-primary/80">
                              <BookOpenIcon className="h-4 w-4" />
                              <span>
                                {t('courses.topicsCount', {
                                  count: course.units.length,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-300 group-hover:text-primary/80">
                              <TargetIcon className="h-4 w-4" />
                              <span>
                                {t('courses.sectionsProgress', {
                                  completed: 1,
                                  total: 5,
                                })}
                              </span>
                            </div>
                            {course.sources.length > 0 && (
                              <a
                                className="flex items-center gap-2 text-muted-foreground text-sm transition-colors duration-300 hover:text-primary"
                                href={course.sources[0].filePath}
                              >
                                <FileTextIcon className="h-4 w-4" />
                                <span>Source</span>
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="transform transition-transform duration-300 group-hover:scale-110">
                              <Gauge value={50} size="tiny" showValue />
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {t('courses.progress')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <Link
                          href={`/courses/${course.id}`}
                          className="flex items-center justify-center gap-1.5"
                        >
                          {t('courses.resumeLearning')}
                          <ArrowRightIcon className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
