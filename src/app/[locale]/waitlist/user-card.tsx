'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useI18n } from '@/locales/client';
import { WaitlistActions } from './waitlist-actions';

type WaitlistUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export function UserCard({ user }: { user: WaitlistUser }) {
  const t = useI18n();

  return (
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
        <WaitlistActions user={user} />
      </CardContent>
    </Card>
  );
}
