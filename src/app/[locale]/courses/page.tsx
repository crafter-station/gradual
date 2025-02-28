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
  FileTextIcon,
  GraduationCapIcon,
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

  const courses = await db.query.course.findMany({
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
              <Link href="/courses/new" className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                {t('courses.uploadPdf')}
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course, index) => {
              return (
                <Card
                  key={course.id}
                  className="group relative animate-fade-up overflow-hidden border-border/40 bg-gradient-to-b from-background to-background/80 transition-all duration-500 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.075] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative space-y-4 p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                          <GraduationCapIcon className="h-3.5 w-3.5" />
                          <span>{course.units.length} Units</span>
                        </div>
                        <h3 className="font-medium text-lg tracking-tight transition-colors duration-300 group-hover:text-primary">
                          {course.title}
                        </h3>
                      </div>
                      <div className="transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                        <Gauge value={0} size="tiny" showValue />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground/90 text-sm">
                        <TargetIcon className="h-3.5 w-3.5" />
                        <span>
                          {t('courses.sectionsProgress', {
                            completed: 0,
                            total: course.units.length,
                          })}
                        </span>
                      </div>
                      {course.sources.length > 0 && (
                        <a
                          className="flex items-center gap-2 text-muted-foreground/90 text-sm transition-colors duration-300 hover:text-primary"
                          href={course.sources[0].filePath}
                        >
                          <FileTextIcon className="h-3.5 w-3.5" />
                          <span>Source material</span>
                        </a>
                      )}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full translate-y-1 border-primary/10 opacity-0 transition-all duration-500 hover:border-primary/30 hover:bg-primary/[0.02] group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex items-center justify-center gap-1.5"
                      >
                        {/* biome-ignore lint/correctness/noConstantCondition: <explanation> */}
                        {true ? 'Continue Learning' : 'Start Course'}
                        <ArrowRightIcon className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
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
