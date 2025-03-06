import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Serif_Khojki } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { I18nProviderClient } from '@/locales/client';
import { ClerkProvider } from '@clerk/nextjs';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { gradualFileRouter } from '../api/uploadthing/core';

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
    <ClerkProvider>
      <html lang={locale}>
        <body
          className={`${geist.variable} ${geistMono.variable} ${notoSerifKhojki.variable} antialiased`}
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
