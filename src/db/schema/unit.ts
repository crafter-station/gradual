import { relations } from 'drizzle-orm';
import {
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
import { course } from './course';
import { section } from './section';

export const unit = pgTable(
  'units',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    order: integer('order').notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    courseId: uuid('course_id')
      .notNull()
      .references(() => course.id),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('units_course_id_order_index').on(table.courseId, table.order),
    index('units_course_id_index').on(table.courseId),
    index('units_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);
export const InsertUnitSchema = createInsertSchema(unit);
export const SelectUnitSchema = createSelectSchema(unit);

export type SelectUnit = typeof unit.$inferSelect;
export type InsertUnit = typeof unit.$inferInsert;

export const unitsRelations = relations(unit, ({ many, one }) => ({
  sections: many(section),
  course: one(course, {
    fields: [unit.courseId],
    references: [course.id],
  }),
}));
