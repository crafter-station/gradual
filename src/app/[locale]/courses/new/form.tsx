'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface FileDetails {
  name: string;
  size: string;
}

interface UploadFormProps {
  messages: {
    title: string;
    subtitle: string;
    form: {
      courseTitle: {
        label: string;
        placeholder: string;
      };
      crafterPassword: {
        label: string;
        placeholder: string;
        error: string;
      };
      source: {
        label: string;
        tabs: {
          file: string;
          url: string;
        };
        file: {
          label: string;
          upload: {
            title: string;
            subtitle: string;
            info: string;
          };
          error: {
            type: string;
            size: string;
          };
        };
        url: {
          label: string;
          placeholder: string;
          error: string;
        };
      };
      validation: {
        required: string;
        password: string;
      };
      submit: {
        default: string;
        processing: string;
      };
    };
    success: {
      title: string;
      action: string;
    };
    error: {
      title: string;
      message: string;
    };
    loading: {
      messages: string[];
    };
  };
}

export default function UploadForm({ messages }: UploadFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = React.useActionState(
    processDocument,
    undefined,
  );

  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);

  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error(messages.form.source.file.error.type);
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error(messages.form.source.file.error.size);
        return;
      }

      setFile(selectedFile);
      setFileDetails({
        name: selectedFile.name,
        size: formatBytes(selectedFile.size),
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileDetails(null);
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    let currentMessageIndex = 0;

    const toastId = toast.loading(
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-medium">{messages.loading.messages[0]}</p>
          <span className="text-muted-foreground text-xs">0%</span>
        </div>
        <Progress value={0} className="h-1" />
      </div>,
      { duration: Number.POSITIVE_INFINITY },
    );

    const messageInterval = setInterval(() => {
      currentMessageIndex =
        (currentMessageIndex + 1) % messages.loading.messages.length;
      const newMessage = messages.loading.messages[currentMessageIndex];

      toast.loading(
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium">{newMessage}</p>
            <span className="text-muted-foreground text-xs">
              {Math.round(currentProgress)}%
            </span>
          </div>
          <Progress value={currentProgress} className="h-1" />
        </div>,
        { id: toastId },
      );
    }, 3000);

    const progressInterval = setInterval(() => {
      if (currentProgress < 95) {
        const increment = 0.5 + Math.random() * 1.5;
        currentProgress = Math.min(95, currentProgress + increment);

        toast.loading(
          <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium">
                {messages.loading.messages[currentMessageIndex]}
              </p>
              <span className="text-muted-foreground text-xs">
                {Math.round(currentProgress)}%
              </span>
            </div>
            <Progress value={currentProgress} className="h-1" />
          </div>,
          { id: toastId },
        );
      }
    }, 300);

    setTimeout(() => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    }, 30000);

    return {
      cleanup: () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      },
      toastId,
    };
  };

  React.useEffect(() => {
    if (state?.success) {
      toast.success(
        <div className="flex w-full flex-col gap-2">
          <p>{messages.success.title}</p>
          <Button
            size="sm"
            className="w-full"
            onClick={() => router.push(`/courses/${state.data.id}`)}
          >
            {messages.success.action}
          </Button>
        </div>,
      );
    }
  }, [state]);

  React.useEffect(() => {
    if (!state?.success && state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  React.useEffect(() => {
    if (isPending) {
      const { cleanup, toastId } = simulateProgress();

      return () => {
        cleanup();
        toast.dismiss(toastId);
        setFile(null);
        setFileDetails(null);
      };
    }
  }, [isPending]);

  return (
    <Card className="border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">{messages.form.courseTitle.label}</Label>
          <div className="relative">
            <Input
              key={state?.form?.title}
              id="title"
              className="peer pe-9"
              name="title"
              type="text"
              placeholder={messages.form.courseTitle.placeholder}
              defaultValue={state?.form?.title}
              required
            />
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Icons.GraduationCap
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{messages.form.source.label}</Label>
          <div className="flex space-x-1 rounded-lg p-1">
            <Button
              type="button"
              variant={activeTab === 'file' ? 'secondary' : 'outline'}
              className="w-full"
              onClick={() => setActiveTab('file')}
            >
              <Icons.File className="mr-2 h-4 w-4" />
              {messages.form.source.tabs.file}
            </Button>
            <Button
              type="button"
              variant={activeTab === 'url' ? 'secondary' : 'outline'}
              className="w-full"
              onClick={() => setActiveTab('url')}
            >
              <Icons.Link className="mr-2 h-4 w-4" />
              {messages.form.source.tabs.url}
            </Button>
          </div>
        </div>

        {activeTab === 'file' ? (
          <div className="space-y-2">
            <Label htmlFor="file" className="font-medium text-sm">
              {messages.form.source.file.label}
            </Label>
            <div className="relative">
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf"
                required
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="h-32 w-full">
                {!file ? (
                  <label
                    htmlFor="file"
                    className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-border/50 border-dashed bg-background/50 transition-all duration-300 hover:border-primary/50"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Icons.Upload className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                      <p className="text-muted-foreground text-sm">
                        <span className="font-semibold">
                          {messages.form.source.file.upload.title}
                        </span>{' '}
                        {messages.form.source.file.upload.subtitle}
                      </p>
                      <p className="text-muted-foreground/70 text-xs">
                        {messages.form.source.file.upload.info}
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="h-full w-full rounded-lg border border-border bg-background/50 transition-all duration-300">
                    <div className="relative flex h-full items-center p-4">
                      <div className="flex min-w-0 flex-1 items-center space-x-4">
                        <div className="shrink-0 rounded-md bg-primary/10 p-2">
                          <Icons.FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate pr-8 font-medium text-foreground text-sm">
                            {fileDetails?.name}
                          </p>
                          <div className="mt-1 flex items-center">
                            <span className="flex items-center text-muted-foreground text-xs">
                              <Icons.Scale className="mr-1 h-3 w-3 shrink-0" />
                              {fileDetails?.size}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Icons.X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="url">{messages.form.source.url.label}</Label>
            <div className="relative">
              <Input
                key={state?.form?.url}
                id="url"
                name="url"
                type="url"
                className="peer pe-9"
                placeholder={messages.form.source.url.placeholder}
                defaultValue={state?.form?.url}
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80">
                <Icons.Link size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>
        )}

        <Button type="submit" disabled={isPending} size="lg" className="w-full">
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Icons.Loader className="h-4 w-4 animate-spin" />
              <span>{messages.form.submit.processing}</span>
            </div>
          ) : (
            messages.form.submit.default
          )}
        </Button>
      </form>
    </Card>
  );
}
