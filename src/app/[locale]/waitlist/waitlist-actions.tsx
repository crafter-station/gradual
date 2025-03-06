'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import React from 'react';
import { toast } from 'sonner';
import { updateUserStatus } from './update-user.action';

type WaitlistUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export function WaitlistActions({ user }: { user: WaitlistUser }) {
  const [state, formAction] = React.useActionState(updateUserStatus, undefined);
  const t = useI18n();

  React.useEffect(() => {
    if (state?.success) {
      toast.success(t('waitlist.updateSuccess'));
      window.location.reload();
    }
  }, [state, t]);

  return (
    <div className="flex gap-2 *:w-full">
      <form action={formAction}>
        <input type="hidden" name="id" value={user.id} />
        <input type="hidden" name="name" value={user.name} />
        <input type="hidden" name="email" value={user.email} />
        <input type="hidden" name="status" value="ACCEPTED" />
        <Button type="submit" className="w-full">
          {t('waitlist.acceptButton')}
        </Button>
      </form>
      <form action={formAction}>
        <input type="hidden" name="id" value={user.id} />
        <input type="hidden" name="name" value={user.name} />
        <input type="hidden" name="email" value={user.email} />
        <input type="hidden" name="status" value="REJECTED" />
        <Button type="submit" variant="outline" className="w-full">
          {t('waitlist.rejectButton')}
        </Button>
      </form>
    </div>
  );
}
