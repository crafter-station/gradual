import { db } from '@/db';
import { sql } from 'drizzle-orm';

// Drop and recreate the public schema
export async function resetDb() {
  await db.execute(sql`DROP SCHEMA drizzle CASCADE`);
  await db.execute(sql`CREATE SCHEMA drizzle`);
  await db.execute(sql`GRANT ALL ON SCHEMA drizzle TO neondb_owner`);
  await db.execute(sql`GRANT ALL ON SCHEMA drizzle TO public`);

  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
  await db.execute(sql`GRANT ALL ON SCHEMA public TO neondb_owner`);
  await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);
}

resetDb().then(() => {
  console.log('Database reset');
});
