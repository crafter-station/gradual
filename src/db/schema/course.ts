import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { enrollment } from './enrollment';
import { source } from './source';
import { unit } from './unit';
import { user } from './user';

export const course = pgTable(
  'course',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    unitCount: integer('unit_count').notNull().default(0),
    sectionCount: integer('section_count').notNull().default(0),
    taskCount: integer('task_count').notNull().default(0),

    isPublic: boolean('is_public').notNull().default(true),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    creatorId: uuid('creator_id')
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index('courses_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);

export const InsertCourseSchema = createInsertSchema(course);
export const SelectCourseSchema = createSelectSchema(course);

export type SelectCourse = typeof course.$inferSelect;
export type InsertCourse = typeof course.$inferInsert;

export const courseRelations = relations(course, ({ many, one }) => ({
  units: many(unit),
  sources: many(source),
  enrollments: many(enrollment),
  creator: one(user, {
    fields: [course.creatorId],
    references: [user.id],
  }),
}));
