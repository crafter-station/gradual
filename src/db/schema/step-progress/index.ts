import { relations } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  pgTable,
  real,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { step } from '../step';
import type { StepProgressState } from './progress-state';
import { task } from '../task';
import { taskProgress } from '../task-progress';
import { user } from '../user';

export const stepProgress = pgTable(
  'step_progress',
  {
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

    state: jsonb('state').$type<StepProgressState>(),

    isCorrect: boolean('is_correct'),
    responseDuration: real('response_duration').default(0).notNull(),

    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),

    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('user_id_step_id_index').on(table.userId, table.stepId),

    uniqueIndex('user_id_task_id_step_id_index').on(
      table.userId,
      table.taskId,
      table.stepId,
    ),
  ],
);

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
