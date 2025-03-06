import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

await db.insert(user).values({
  clerkId: 'user_2mJ3qZ5555555555555555555555555555555555',
  fullname: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://example.com/avatar.png',
});

await db
  .delete(user)
  .where(eq(user.clerkId, 'user_2mJ3qZ5555555555555555555555555555555555'));
