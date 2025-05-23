import { jsonb, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { BinaryQuestionStepContentSchema } from '../step/binary';
import { FillInTheBlankStepContentSchema } from '../step/fill-in-the-blank';
import { MultipleChoiceQuestionStepContentSchema } from '../step/multiple-choice';
import { QuestionStepContentSchema } from '../step/question';
import { step } from '../step';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const AlterantiveStepContentSchema = z.union([
  // Evaluated steps
  QuestionStepContentSchema,
  FillInTheBlankStepContentSchema,
  MultipleChoiceQuestionStepContentSchema,
  BinaryQuestionStepContentSchema,
]);

export const AlternativeStepTypes = AlterantiveStepContentSchema.options.map(
  (option) => option.shape.type.value,
);

export type AlternativeStepType = (typeof AlternativeStepTypes)[number];

export const alternativeStepTypeEnum = pgEnum('ALTERNATIVE_STEP_TYPE_ENUM', [
  AlternativeStepTypes[0],
  ...AlternativeStepTypes.slice(1),
]);

export const AlternativeStepTypeEnumSchema = z.enum([
  AlternativeStepTypes[0],
  ...AlternativeStepTypes.slice(1),
]);

export type AlternativeStepContent = z.infer<
  typeof AlterantiveStepContentSchema
>;

export const alternativeStep = pgTable(
  'alternative_step',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    content: jsonb('content').$type<AlternativeStepContent>().notNull(),

    type: alternativeStepTypeEnum('type').notNull(),

    stepId: uuid('step_id')
      .notNull()
      .references(() => step.id),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [],
);

export const InsertAlternativeStepSchema = createInsertSchema(alternativeStep);
export const SelectAlternativeStepSchema = createSelectSchema(alternativeStep);

export type SelectAlternativeStep = typeof alternativeStep.$inferSelect;
export type InsertAlternativeStep = typeof alternativeStep.$inferInsert;

export const alternativeStepRelations = relations(
  alternativeStep,
  ({ one }) => ({
    step: one(step, {
      fields: [alternativeStep.stepId],
      references: [step.id],
    }),
  }),
);
