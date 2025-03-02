import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getI18n } from '@/locales/server';
import { getWaitlistUser } from './helpers';

export default async function WaitlistPage() {
  const users = await getWaitlistUser();
  const t = await getI18n();

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
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' · '}
                  {new Date(user.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <div className="flex gap-2 *:w-full">
                  <Button type="submit">{t('waitlist.acceptButton')}</Button>
                  <Button type="submit" variant="outline">
                    {t('waitlist.rejectButton')}
                  </Button>
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
