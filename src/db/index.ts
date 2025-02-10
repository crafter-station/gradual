import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}
declare global {
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const client = postgres(process.env.DATABASE_URL);

if (!global.db) {
  global.db = drizzle(client, {
    schema,
  });
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export const db = global.db;
