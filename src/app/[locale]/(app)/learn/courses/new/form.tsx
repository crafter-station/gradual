'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/locales/client';
import { FileIcon, LinkIcon, Loader2Icon } from 'lucide-react';

import React from 'react';

import { formatBytes } from '@/lib/utils';
import { UploadDropzone } from '@/lib/utils/uploadthing';
import { toast } from 'sonner';
import { createCourse } from './create-course.action';

interface FileDetails {
  name: string;
  size: string;
}

export function CreateCourseForm() {
  const t = useI18n();
  const [state, formAction, isPending] = React.useActionState(
    createCourse,
    undefined,
  );

  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const [fileDetails, setFileDetails] = React.useState<
    FileDetails | undefined
  >();
  const [activeTab, setActiveTab] = React.useState<'file' | 'url'>('file');

  React.useEffect(() => {
    if (state?.success) {
      toast.success(
        <div className="flex w-full flex-col gap-2">
          <p className="font-bold">{t('createCourse.form.success.title')}</p>
          <p>{t('createCourse.form.success.description')}</p>
        </div>,
      );
    }
  }, [state, t]);

  React.useEffect(() => {
    if (!state?.success && state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card className="border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label>{t('createCourse.form.tabs.label')}</Label>
          <div className="flex space-x-1 rounded-lg p-1">
            <Button
              type="button"
              variant={activeTab === 'file' ? 'secondary' : 'outline'}
              className="w-full"
              onClick={() => setActiveTab('file')}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              {t('createCourse.form.tabs.file.title')}
            </Button>
            <Button
              type="button"
              variant={activeTab === 'url' ? 'secondary' : 'outline'}
              className="w-full"
              onClick={() => setActiveTab('url')}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {t('createCourse.form.tabs.url.title')}
            </Button>
          </div>
        </div>

        {activeTab === 'file' ? (
          <div className="space-y-2">
            <Label htmlFor="file" className="font-medium text-sm">
              {t('createCourse.form.tabs.file.label')}
            </Label>

            <div className="h-64 w-full">
              <UploadDropzone
                className="h-full w-full ut-button:bg-secondary ut-allowed-content:text-secondary-foreground/80 ut-button:text-secondary-foreground ut-label:text-secondary-foreground ut-button:hover:bg-secondary/80 ut-button:hover:text-secondary-foreground/60 ut-label:hover:text-secondary-foreground/80"
                endpoint="sourceFileUploader"
                onClientUploadComplete={(res) => {
                  setUrl(res[0].ufsUrl);
                  setFileDetails({
                    name: res[0].name,
                    size: formatBytes(res[0].size),
                  });
                }}
                onUploadError={(error: Error) => {
                  toast.error(error.message);
                }}
              />
            </div>

            {fileDetails && (
              <p className="text-muted-foreground text-sm">
                Uploaded:{' '}
                <span className="font-bold">
                  {fileDetails.name} - {fileDetails.size}
                </span>
              </p>
            )}
            <input type="hidden" name="url" key={url} defaultValue={url} />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="url">{t('createCourse.form.tabs.url.label')}</Label>
            <div className="relative">
              <Input
                id="url"
                name="url"
                type="url"
                className="peer pe-9"
                placeholder={t('createCourse.form.tabs.url.placeholder')}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80">
                <LinkIcon size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending || !url}
          size="lg"
          className="w-full"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span>{t('createCourse.form.buttonLabel.loading')}</span>
            </div>
          ) : (
            t('createCourse.form.buttonLabel.default')
          )}
        </Button>
      </form>
    </Card>
  );
}
