import { relations } from 'drizzle-orm';
import {
  type AnyPgColumn,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  real,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { task } from '../task';
export * from '../step-progress/progress-state';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { AnalogyStepContentSchema } from './analogy';
import { BinaryQuestionStepContentSchema } from './binary';
import { DefinitionStepContentSchema } from './definition';
import { FillInTheBlankStepContentSchema } from './fill-in-the-blank';
import { FunFactStepContentSchema } from './fun-fact';
import { IntroductionStepContentSchema } from './introduction';
import { MultipleChoiceQuestionStepContentSchema } from './multiple-choice';
import { QuestionStepContentSchema } from './question';
import { QuoteStepContentSchema } from './quote';
import { SolvedExerciseStepContentSchema } from './solved-exercise';
import { TutorialStepContentSchema } from './tutorial';

export * from '../step-progress/progress-state';

export const StepContentSchema = z.union([
  // Theoretical steps
  IntroductionStepContentSchema,
  DefinitionStepContentSchema,
  AnalogyStepContentSchema,
  TutorialStepContentSchema,
  SolvedExerciseStepContentSchema,
  FunFactStepContentSchema,
  QuoteStepContentSchema,

  // Evaluated steps
  QuestionStepContentSchema,
  FillInTheBlankStepContentSchema,
  MultipleChoiceQuestionStepContentSchema,
  BinaryQuestionStepContentSchema,
]);

export const StepTypes = StepContentSchema.options.map(
  (option) => option.shape.type.value,
);

export type StepType = (typeof StepTypes)[number];

export const stepTypeEnum = pgEnum('STEP_TYPE_ENUM', [
  StepTypes[0],
  ...StepTypes.slice(1),
]);

export const StepTypeEnumSchema = z.enum([StepTypes[0], ...StepTypes.slice(1)]);

export type StepContent = z.infer<typeof StepContentSchema>;

export const step = pgTable(
  'step',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    parentStepId: uuid('parent_step_id').references((): AnyPgColumn => step.id),

    order: integer('order').notNull(),
    content: jsonb('content').$type<StepContent>().notNull(),

    type: stepTypeEnum('type').notNull(),

    taskId: uuid('task_id').references(() => task.id),

    correctResponseCount: integer('correct_response_count')
      .notNull()
      .default(0), // number of correct responses
    incorrectResponseCount: integer('incorrect_response_count')
      .notNull()
      .default(0), // number of incorrect responses
    totalResponseDuration: real('total_response_duration').notNull().default(0), // sum of the time it took each user to respond to the step in seconds

    difficultyScore: real('difficulty_score').notNull().default(0), // function of the correct / incorrect response count and the total response time

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('steps_order_task_id_unique').on(table.order, table.taskId),
    index('steps_for_task').on(table.taskId),
  ],
);

export const stepRelations = relations(step, ({ one, many }) => ({
  task: one(task, {
    fields: [step.taskId],
    references: [task.id],
  }),
  parentStep: one(step, {
    fields: [step.parentStepId],
    references: [step.id],
  }),
  secondarySteps: many(step, {
    relationName: 'secondarySteps', // Secondary steps (for reviews) generated from a parent step (a lesson step)
  }),
}));

export const InsertStepSchema = createInsertSchema(step)
  .omit({
    content: true,
  })
  .extend({
    type: StepTypeEnumSchema,
    content: StepContentSchema,
  })
  .refine((data) => data.type === data.content.type, {
    message: 'Step type must match content type',
    path: ['type'],
  });

export const SelectStepSchema = createSelectSchema(step);

type StepContentMap = {
  [T in (typeof StepTypes)[number]]: z.infer<
    Extract<
      (typeof StepContentSchema)['options'][number],
      z.ZodObject<{ type: z.ZodLiteral<T> }>
    >
  >;
};

export type SelectStep = Omit<
  Omit<typeof step.$inferSelect, 'content'>,
  'type'
> &
  {
    [K in keyof StepContentMap]: {
      type: K;
      content: Extract<StepContentMap[K], { type: K }>;
    };
  }[keyof StepContentMap];
