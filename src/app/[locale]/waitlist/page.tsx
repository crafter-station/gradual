'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { WaitRecord } from '@/core/domain/wait-record';
import { useI18n } from '@/locales/client';
import React from 'react';
import { toast } from 'sonner';
import { updateUserStatus } from './update-user.action';

interface WaitlistPageProps {
  users: WaitRecord[];
}

export default function WaitlistPage({ users }: WaitlistPageProps) {
  const [state, formAction] = React.useActionState(updateUserStatus, undefined);
  const t = useI18n();

  React.useEffect(() => {
    if (state?.success) {
      toast.success(t('waitlist.updateSuccess'));
      window.location.reload();
    }
  }, [state, t]);

  return (
    <div className="container mx-auto flex-1 overflow-auto p-6">
      <h1 className="mb-6 animate-fade-in font-semibold text-2xl">
        {t('waitlist.title')}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <Card
              key={user.id}
              className="rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-muted-foreground text-xs">
                  {t('waitlist.requested')}{' '}
                  {user.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' · '}
                  {user.createdAt.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
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
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            {t('waitlist.empty')}
          </p>
        )}
      </div>
    </div>
  );
}
