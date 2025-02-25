import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { section } from './section';
import { step } from './step';

export const taskTypeEnum = pgEnum('TASK_TYPE_ENUM', [
  'LESSON',
  'QUIZ',
  'MULTISTEP',
]);

export const task = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),

  order: integer('order').notNull(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),

  type: taskTypeEnum('type').notNull(),

  experiencePoints: integer('experience_points').notNull().default(10),
  stepsCount: integer('steps_count').notNull(),

  sectionId: uuid('section_id')
    .notNull()
    .references(() => section.id),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const InsertTaskSchema = createInsertSchema(task);
export const SelectTaskSchema = createSelectSchema(task);

export type InsertTask = typeof task.$inferInsert;
export type SelectTask = typeof task.$inferSelect;

export const taskRelations = relations(task, ({ many, one }) => ({
  steps: many(step),
  section: one(section, {
    fields: [task.sectionId],
    references: [section.id],
  }),
}));
