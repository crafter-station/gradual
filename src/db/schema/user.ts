import { relations } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { course } from './course';
import { enrollment } from './enrollment';

export const user = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullname: varchar('fullname').notNull(),
  email: varchar('email').notNull(),
  avatarUrl: text('avatar_url').notNull(),
});

export const usersRelations = relations(user, ({ many }) => ({
  enrollments: many(enrollment),
  createdCourses: many(course),
}));
