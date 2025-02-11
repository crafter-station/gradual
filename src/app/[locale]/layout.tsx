import type { Metadata } from 'next';
import { Heebo, Geist_Mono } from 'next/font/google';
import './globals.css';
import { I18nProviderClient } from '@/locales/client';

const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gradual',
  description: 'Gradual',
};

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactElement;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`${heebo.variable} ${geistMono.variable} antialiased`}>
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </body>
    </html>
  );
}
