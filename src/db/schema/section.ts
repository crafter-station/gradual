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
import { task } from './task';
import { unit } from './unit';

export const section = pgTable(
  'section',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    order: integer('order').notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    taskCount: integer('task_count').notNull().default(0),

    unitId: uuid('unit_id')
      .notNull()
      .references(() => unit.id),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('sections_unit_id_order_index').on(table.unitId, table.order),
    index('sections_unit_id_index').on(table.unitId),
    index('sections_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);
export const InsertSectionSchema = createInsertSchema(section);
export const SelectSectionSchema = createSelectSchema(section);

export type SelectSection = typeof section.$inferSelect;
export type InsertSection = typeof section.$inferInsert;

export const sectionRelations = relations(section, ({ many, one }) => ({
  tasks: many(task),
  unit: one(unit, {
    fields: [section.unitId],
    references: [unit.id],
  }),
}));
