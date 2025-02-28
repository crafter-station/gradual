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
import { getI18n, getStaticParams } from '@/locales/server';
import { HomeIcon } from 'lucide-react';
import { setStaticParamsLocale } from 'next-international/server';
import { CreateCourseForm } from './form';

export function generateStaticParams() {
  return getStaticParams();
}

export default async function UploadPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

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
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('createCourse.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="min-h-full bg-gradient-to-b from-background via-background to-accent/10 px-4 pt-16">
          <div className="container mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text font-bold text-4xl text-transparent">
                {t('createCourse.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('createCourse.subtitle')}
              </p>
            </div>

            <CreateCourseForm />
          </div>
        </div>
      </div>
    </div>
  );
}
