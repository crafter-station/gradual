import { relations } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { course } from './course';
import { enrollment } from './enrollment';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id').unique().notNull(),

  fullname: varchar('fullname').notNull(),
  email: varchar('email').notNull(),
  avatarUrl: text('avatar_url').notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  enrollments: many(enrollment),
  createdCourses: many(course),
}));
