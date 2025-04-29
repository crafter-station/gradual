import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { TFunction } from '@/locales/types';
import { HomeIcon } from 'lucide-react';

interface CourseHeaderProps {
  courseTitle: string;
  t: TFunction;
}

export function CourseHeader({ courseTitle, t }: Readonly<CourseHeaderProps>) {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 animate-fade-in items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-6">
        <SidebarTrigger className="-ml-1 transition-transform duration-300 hover:rotate-180" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/home"
                className="transition-transform hover:scale-105"
              >
                <HomeIcon size={16} strokeWidth={2} aria-hidden="true" />
                <span className="sr-only">{t('breadcrumbs.home')}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/learn/courses"
                className="transition-colors hover:text-primary"
              >
                {t('breadcrumbs.courses')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{courseTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
