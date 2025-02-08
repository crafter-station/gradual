import { bookStylesDark } from '@/lib/constants';
import { getI18n } from '@/locales/server';
import { Book } from '@/components/book';
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
import { Gauge } from '@/components/gauge';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  ArrowRightIcon,
  BookOpenIcon,
  FileTextIcon,
  HomeIcon,
  TargetIcon,
} from 'lucide-react';
import { db } from '@/db';

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
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <HomeIcon size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">{t('breadcrumbs.home')}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('breadcrumbs.courses')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-semibold text-2xl">
              {t('breadcrumbs.courses')}
            </h1>
            <Button asChild>
              <Link href="/upload" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                {t('courses.uploadPdf')}
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => {
              const bookStyle = getRandomBookStyle();
              const IconComponent = bookStyle.icon;

              return (
                <Card
                  key={course.id + Math.random()}
                  className="group transition-all duration-300 hover:shadow-md"
                >
                  <div className="grid h-full grid-cols-[160px_1fr]">
                    <div className="flex items-center justify-center border-r bg-muted/5 p-4">
                      <Book
                        illustration={<IconComponent className="size-8" />}
                        title={course.title ?? ''}
                        color={bookStyle.color}
                        textured
                        size="sm"
                        className="w-[120px]"
                      />
                    </div>
                    <div className="flex h-full flex-col justify-between p-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>

                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <BookOpenIcon className="h-4 w-4" />
                              <span>
                                {t('courses.topicsCount', {
                                  count: course.units.length,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
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
                                className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary"
                                href={course.sources[0].filePath}
                              >
                                <FileTextIcon className="h-4 w-4" />
                                <span>Source</span>
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Gauge value={50} size="tiny" showValue />
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
                        className="mt-4 w-full translate-y-0.5 group-hover:translate-y-0"
                      >
                        <Link
                          href={`/courses/${course.id}`}
                          className="flex items-center justify-center gap-1.5"
                        >
                          {t('courses.resumeLearning')}
                          <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-0.5" />
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
