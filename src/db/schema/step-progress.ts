import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { step } from './step';
import { task } from './task';
import { taskProgress } from './task-progress';
import { user } from './user';

export const stepProgress = pgTable('step_progress', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => user.id),

  stepId: uuid('step_id')
    .notNull()
    .references(() => step.id),

  taskId: uuid('task_id')
    .notNull()
    .references(() => task.id),

  taskProgressId: uuid('task_progress_id')
    .notNull()
    .references(() => taskProgress.id),

  selectedAlternativeOrder: integer('selected_alternative_order'),
  isCorrect: boolean('is_correct'),

  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export type SelectStepProgress = typeof stepProgress.$inferSelect;

export const stepProgressRelations = relations(stepProgress, ({ one }) => ({
  step: one(step, {
    fields: [stepProgress.stepId],
    references: [step.id],
  }),
  task: one(task, {
    fields: [stepProgress.taskId],
    references: [task.id],
  }),
  taskProgress: one(taskProgress, {
    fields: [stepProgress.taskProgressId],
    references: [taskProgress.id],
  }),
  user: one(user, {
    fields: [stepProgress.userId],
    references: [user.id],
  }),
}));
