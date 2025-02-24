import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { course } from './course';
import { user } from './user';

export const enrollment = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => user.id),
  courseId: uuid('course_id')
    .notNull()
    .references(() => course.id),

  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
});

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
}));
