import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

declare global {
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
  var pool: Pool | undefined;
}

if (!global.db) {
  if (!global.pool) {
    global.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  global.db = drizzle(global.pool, { schema });
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export const db = global.db;
