import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { course } from './course';
import { user } from './user';

export const enrollment = pgTable(
  'enrollment',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    courseId: uuid('course_id')
      .notNull()
      .references(() => course.id),

    completedUnits: integer('completed_units').default(0).notNull(),
    completedSections: integer('completed_sections').default(0).notNull(),
    completedTasks: integer('completed_tasks').default(0).notNull(),

    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('enrollment_user_id_course_id_index').on(
      table.userId,
      table.courseId,
    ),
    unique('enrollment_user_id_course_id_unique').on(
      table.userId,
      table.courseId,
    ),
  ],
);

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
}));
