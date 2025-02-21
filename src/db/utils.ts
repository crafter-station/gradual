import { db } from '@/db';

export async function getCurrentUser() {
  return db.query.users.findFirst();
}
