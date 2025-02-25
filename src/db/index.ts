import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}
declare global {
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

if (!global.db) {
  global.db = drizzle(process.env.DATABASE_URL, { schema });
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export const db = global.db;
