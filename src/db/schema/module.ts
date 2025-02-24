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

export const module = pgTable(
  'module',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    order: integer('order').notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

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
    index('modules_unit_id_order_index').on(table.unitId, table.order),
    index('modules_unit_id_index').on(table.unitId),
    index('modules_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);
export const InsertModuleSchema = createInsertSchema(module);
export const SelectModuleSchema = createSelectSchema(module);

export type SelectModule = typeof module.$inferSelect;
export type InsertModule = typeof module.$inferInsert;

export const moduleRelations = relations(module, ({ many, one }) => ({
  tasks: many(task),
  unit: one(unit, {
    fields: [module.unitId],
    references: [unit.id],
  }),
}));
