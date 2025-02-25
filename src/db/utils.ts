import { db } from '@/db';

export const getCurrentUser = db.query.user
  .findFirst()
  .prepare('getCurrentUser');
