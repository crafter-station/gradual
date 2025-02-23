import { db } from '@/db';
import { users } from '@/db/schema';

await db.insert(users).values({
  fullname: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://example.com/avatar.png',
});
