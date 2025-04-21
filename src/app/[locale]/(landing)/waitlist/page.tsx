import { EmptyState } from './empty-state';
import { getWaitlistUser } from './helpers';
import { PageTitle } from './page-title';
import { UserCard } from './user-card';

export default async function WaitlistPage() {
  const users = await getWaitlistUser();

  return (
    <div className="container mx-auto flex-1 overflow-auto p-6">
      <PageTitle />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
