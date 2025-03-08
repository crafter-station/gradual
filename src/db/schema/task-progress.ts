import { relations } from 'drizzle-orm';
import {
  integer,
  real,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { stepProgress } from './step-progress';
import { task } from './task';
import { user } from './user';

export const taskProgress = pgTable(
  'task_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    taskId: uuid('task_id')
      .notNull()
      .references(() => task.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),

    stepsCompletedCount: integer('steps_completed_count').notNull().default(0),

    incorrectStepsCount: integer('incorrect_steps_count').notNull().default(0),
    correctStepsCount: integer('correct_steps_count').notNull().default(0),
    totalResponseDuration: real('total_response_duration').notNull().default(0), // sum of the time it took the user to respond to all steps of the task in seconds

    relativeDifficultyScore: real('relative_difficulty_score')
      .notNull()
      .default(0), // function of the correct / incorrect response count and the total response time (relative to this user)

    earnedExperiencePoints: integer('earned_experience_points'),

    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('user_id_task_id_index').on(table.userId, table.taskId),
  ],
);
export type SelectTaskProgress = typeof taskProgress.$inferSelect;

export const taskProgressRelations = relations(
  taskProgress,
  ({ one, many }) => ({
    task: one(task, {
      fields: [taskProgress.taskId],
      references: [task.id],
    }),
    user: one(user, {
      fields: [taskProgress.userId],
      references: [user.id],
    }),
    stepsProgress: many(stepProgress),
  }),
);
