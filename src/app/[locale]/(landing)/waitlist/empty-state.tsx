'use client';

import { useI18n } from '@/locales/client';

export function EmptyState() {
  const t = useI18n();

  return (
    <p className="col-span-full text-center text-gray-500">
      {t('waitlist.empty')}
    </p>
  );
}
