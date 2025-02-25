import { db } from '@/db';
import { user } from '@/db/schema';

await db.insert(user).values({
  fullname: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://example.com/avatar.png',
});
