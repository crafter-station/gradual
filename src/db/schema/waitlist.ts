import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const waitlistStatusEnum = pgEnum('WAITLIST_STATUS', [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
]);

export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull(),
  createdAt: text('created_at').notNull().default(sql`now()`),
  status: waitlistStatusEnum('status').notNull().default('PENDING'),
});
