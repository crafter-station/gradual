import { Pool } from '@neondatabase/serverless';
import { type NeonDatabase, drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

declare global {
  var db: NeonDatabase<typeof schema> | undefined;
}

if (!global.db) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  global.db = drizzle(pool, { schema });
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export const db = global.db;
