import { db } from '@/db';
import { sql } from 'drizzle-orm';

// Drop and recreate the public schema
export async function resetDb() {
  await db.execute(sql`
    DROP SCHEMA drizzle CASCADE;
    CREATE SCHEMA drizzle;
    GRANT ALL ON SCHEMA drizzle TO postgres;
    GRANT ALL ON SCHEMA drizzle TO public;

    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
  `);
}

resetDb();
