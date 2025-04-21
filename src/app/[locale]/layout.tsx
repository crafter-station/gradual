import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Serif_Khojki } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { I18nProviderClient } from '@/locales/client';
import { ClerkProvider } from '@clerk/nextjs';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { gradualFileRouter } from '../api/uploadthing/core';
import { cn } from '@/lib/utils';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSerifKhojki = Noto_Serif_Khojki({
  variable: '--font-noto-serif-khojki',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Gradual',
  description: 'Gradual',
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactElement;
}>) {
  const { locale } = await params;

  return (
    <ClerkProvider
      appearance={{
        elements: {
          headerTitle: '!text-foreground !text-lg',
          formButtonPrimary:
            '!bg-primary !border-border !text-primary-foreground hover:!bg-primary/90',
          card: '!bg-card !text-card-foreground !shadow-sm',
          footer: '!hidden',
          socialButtonsBlockButton:
            '!bg-muted !border !border-foreground/10 !text-muted-foreground hover:!bg-foreground/10',
          socialButtonsIconButton:
            '!border !border-input !bg-background hover:!bg-accent hover:!text-accent-foreground',
          formButtonReset: '!text-muted-foreground hover:!text-foreground',
          formFieldInput:
            '!text-foreground !border !border-input !bg-muted focus-visible:!bg-background !placeholder-muted-foreground focus-visible:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-transparent',
          formFieldLabel: '!text-foreground !text-sm',
          formFieldAction: '!text-muted-foreground !text-sm',
          dividerText: '!text-muted-foreground !text-sm',
          dividerLine: '!bg-border',
          socialButtonsBlockButtonText: '!text-muted-foreground',
          userPreviewMainIdentifier: '!text-foreground !font-medium',
          userPreviewSecondaryIdentifier: '!text-muted-foreground !text-sm',
          socialButtonsProviderIcon__github: 'dark:invert',
          rootBox: '!w-full',
          userButtonAvatarBox: 'h-5 w-5',
          userButtonAvatarImage: 'h-5 w-5',
          userButtonTrigger:
            '!h-10 !p-0 !w-full flex !justify-start !bg-muted !border !border-input hover:!bg-sidebar-accent  group-data-[collapsible=icon]:hover:!bg-transparent !px-2 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!bg-transparent group-data-[collapsible=icon]:!border-none transition-colors',

          userButtonBox:
            '!text-foreground !flex-row-reverse !gap-2 items-center',
          userButtonOuterIdentifier:
            'text-sm font-medium truncate group-data-[collapsible=icon]:!hidden',
          userButtonPopoverMain: '!bg-card !text-card-foreground',
          userButtonPopoverCard: '!bg-card !text-card-foreground',
          userButtonPopoverFooter: '!hidden',
          userButtonPopoverActionButton:
            '!bg-muted border-t !border-input !text-muted-foreground hover:!bg-foreground/10',
          userButtonPopoverActions: '!border-t !border-input',
        },
      }}
    >
      <html lang={locale}>
        <body
          className={cn(
            geist.variable,
            geistMono.variable,
            notoSerifKhojki.variable,
            'antialiased selection:bg-primary selection:text-primary-foreground',
          )}
        >
          <NextSSRPlugin
            routerConfig={extractRouterConfig(gradualFileRouter)}
          />
          <I18nProviderClient locale={locale}>
            {children}
            <Toaster />
          </I18nProviderClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
