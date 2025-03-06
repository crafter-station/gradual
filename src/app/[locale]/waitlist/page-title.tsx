'use client';

import { useI18n } from '@/locales/client';

export function PageTitle() {
  const t = useI18n();

  return (
    <h1 className="mb-6 animate-fade-in font-semibold text-2xl">
      {t('waitlist.title')}
    </h1>
  );
}
