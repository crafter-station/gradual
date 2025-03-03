'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/locales/client';
import { ArrowRightIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { joinWaitlist } from './action';

export function WaitlistForm() {
  const [state, formAction, isPending] = React.useActionState(
    joinWaitlist,
    undefined,
  );
  const t = useI18n();

  React.useEffect(() => {
    if (state?.success) {
      toast.success(t('waitlist.joinToast'));
    }
    if (!state?.success && state?.error) {
      toast.error(state.error);
    }
  }, [state, t]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          name="name"
          placeholder={t('landing.waitlist.namePlaceholder')}
          className="h-12"
          required
        />
        <Input
          type="email"
          name="email"
          placeholder={t('landing.waitlist.emailPlaceholder')}
          className="h-12"
          required
        />
        <Button
          type="submit"
          size="lg"
          className="group h-12 min-w-[140px] gap-2"
          disabled={isPending}
        >
          {t('landing.waitlist.joinButton')}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </form>
  );
}
