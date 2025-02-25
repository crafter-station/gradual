import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { step } from './step';
import { stepProgress } from './step-progress';
import { task } from './task';
import { user } from './user';

export const taskProgress = pgTable('task_progress', {
  id: uuid('id').primaryKey().defaultRandom(),

  taskId: uuid('task_id')
    .notNull()
    .references(() => task.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id),

  lastCompletedStepId: uuid('last_completed_step_id').references(() => step.id),
  stepsCompletedCount: integer('steps_completed_count').notNull().default(0),

  earnedExperiencePoints: integer('earned_experience_points'),

  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});
export type SelectTaskProgress = typeof taskProgress.$inferSelect;

export const taskProgressRelations = relations(
  taskProgress,
  ({ one, many }) => ({
    task: one(task, {
      fields: [taskProgress.taskId],
      references: [task.id],
    }),
    lastCompletedStep: one(step, {
      fields: [taskProgress.lastCompletedStepId],
      references: [step.id],
    }),
    user: one(user, {
      fields: [taskProgress.userId],
      references: [user.id],
    }),
    stepsProgress: many(stepProgress),
  }),
);
