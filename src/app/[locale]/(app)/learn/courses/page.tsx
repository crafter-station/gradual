import { BookCard } from '@/components/book-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { db } from '@/db';
import { getI18n, getStaticParams } from '@/locales/server';
import { FileTextIcon, HomeIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';

export const metadata = {
  title: 'Courses',
};

export const revalidate = 3600;

export function generateStaticParams() {
  return getStaticParams();
}

export default async function CoursesPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const courses = await db.query.course.findMany({
    with: {
      units: true,
      sources: true,
      creator: true,
    },
  });

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card">
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
          <div className="mb-8 flex items-center justify-between">
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
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {courses?.map((course, index) => {
              const creatorName = course.creator?.fullname || 'unknown';
              const currentYear = new Date().getFullYear().toString();

              return (
                <div
                  key={course.id}
                  className="h-[280px] animate-fade-up px-2"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <Link
                    href={`/learn/courses/${course.id}`}
                    className="block h-full w-full"
                  >
                    <BookCard
                      title={course.title}
                      author={creatorName}
                      year={currentYear}
                      category="Uncategorized"
                      color="gray"
                      unitCount={course.units.length}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
