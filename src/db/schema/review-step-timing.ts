import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { isNull } from 'drizzle-orm';
import { step } from './step';
import { stepProgress } from './step-progress';
import { task } from './task';
import { taskProgress } from './task-progress';
import { user } from './user';

export const reviewStepTiming = pgTable(
  'review_step_timing',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),

    baseStepId: uuid('base_step_id') // the step that needs to be reviewed
      .notNull()
      .references(() => step.id),
    baseTaskId: uuid('base_task_id') // the task of the base step
      .notNull()
      .references(() => task.id),

    baseTaskProgressId: uuid('base_task_progress_id') // the task progress of the base task
      .notNull()
      .references(() => taskProgress.id),
    baseStepProgressId: uuid('base_step_progress_id') // the step progress of the base step
      .notNull()
      .references(() => stepProgress.id),

    estimatedReviewTimestamp: timestamp('estimated_review_timestamp', {
      withTimezone: true,
    }).notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),

    reviewStepId: uuid('review_step_id').references(() => step.id), // the step that will be reviewed
    reviewTaskId: uuid('review_task_id').references(() => task.id), // the task of the review step

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('pending_reviews_by_user_idx')
      .on(table.userId, table.estimatedReviewTimestamp)
      .where(isNull(table.reviewedAt)),
  ],
);
