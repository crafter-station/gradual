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
import { getCurrentUser } from '@/lib/utils';
import { getI18n } from '@/locales/server';
import { HomeIcon } from 'lucide-react';
import UploadForm from './upload-form';

export async function generateMetadata() {
  const currentUser = await getCurrentUser();

  const t = await getI18n();

  return {
    title: t('upload.meta.title'),
  };
}

export default async function UploadPage() {
  const currentUser = await getCurrentUser();
  const t = await getI18n();

  if (!currentUser) return null;

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
                <BreadcrumbPage>{t('upload.title')}</BreadcrumbPage>
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
                {t('upload.title')}
              </h1>
              <p className="text-muted-foreground">{t('upload.subtitle')}</p>
            </div>

            <UploadForm
              messages={{
                title: t('upload.title'),
                subtitle: t('upload.subtitle'),
                form: {
                  courseTitle: {
                    label: t('upload.form.courseTitle.label'),
                    placeholder: t('upload.form.courseTitle.placeholder'),
                  },
                  crafterPassword: {
                    label: t('upload.form.crafterPassword.label'),
                    placeholder: t('upload.form.crafterPassword.placeholder'),
                    error: t('upload.form.crafterPassword.error'),
                  },
                  source: {
                    label: t('upload.form.source.label'),
                    tabs: {
                      file: t('upload.form.source.tabs.file'),
                      url: t('upload.form.source.tabs.url'),
                    },
                    file: {
                      label: t('upload.form.source.file.label'),
                      upload: {
                        title: t('upload.form.source.file.upload.title'),
                        subtitle: t('upload.form.source.file.upload.subtitle'),
                        info: t('upload.form.source.file.upload.info'),
                      },
                      error: {
                        type: t('upload.form.source.file.error.type'),
                        size: t('upload.form.source.file.error.size'),
                      },
                    },
                    url: {
                      label: t('upload.form.source.url.label'),
                      placeholder: t('upload.form.source.url.placeholder'),
                      error: t('upload.form.source.url.error'),
                    },
                  },
                  validation: {
                    required: t('upload.form.validation.required'),
                    password: t('upload.form.validation.password'),
                  },
                  submit: {
                    default: t('upload.form.submit.default'),
                    processing: t('upload.form.submit.processing'),
                  },
                },
                success: {
                  title: t('upload.success.title'),
                  action: t('upload.success.action'),
                },
                error: {
                  title: t('upload.error.title'),
                  message: t('upload.error.message'),
                },
                loading: {
                  messages: [
                    t('upload.loading.messages.0'),
                    t('upload.loading.messages.1'),
                    t('upload.loading.messages.2'),
                    t('upload.loading.messages.3'),
                    t('upload.loading.messages.4'),
                    t('upload.loading.messages.5'),
                  ],
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
