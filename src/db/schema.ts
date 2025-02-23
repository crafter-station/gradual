import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  vector,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullname: varchar('fullname').notNull(),
  email: varchar('email').notNull(),
  avatarUrl: text('avatar_url').notNull(),
});

export const sourceTypeEnum = pgEnum('source_type', ['FILE', 'URL']);

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    type: sourceTypeEnum('type').notNull(),
    filePath: text('file_path').notNull(),

    creatorId: uuid('creator_id')
      .notNull()
      .references(() => users.id),
    courseId: uuid('course_id').references(() => courses.id),
    summary: text('summary').notNull(),
    chunksCount: integer('chunks_count').notNull().default(0),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('source_type_index').on(table.type),
    index('source_course_id_index').on(table.courseId),
    index('source_chunks_count_index').on(table.chunksCount),
    index('source_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);

export const chunks = pgTable(
  'chunks',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id),

    order: integer('order').notNull(),
    summary: text('summary').notNull().default('Default summary'),
    rawContent: text('raw_content').notNull().default('Default raw content'),
    enrichedContent: text('enriched_content')
      .notNull()
      .default('Default enriched content'),
    embedding: vector('embedding', { dimensions: 1536 }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('chunks_source_id_order_index').on(table.sourceId, table.order),
    index('chunks_source_id_index').on(table.sourceId),
    index('chunks_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);
export type SelectChunk = typeof chunks.$inferSelect;
export type InsertChunk = typeof chunks.$inferInsert;

export const chunksRelations = relations(chunks, ({ one }) => ({
  source: one(sources, {
    fields: [chunks.sourceId],
    references: [sources.id],
  }),
}));

export const courses = pgTable(
  'courses',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    isPublic: boolean('is_public').notNull().default(true),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    creatorId: uuid('creator_id')
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index('courses_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);

export const InsertCourseSchema = createInsertSchema(courses);
export const SelectCourseSchema = createSelectSchema(courses);

export type SelectCourse = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const units = pgTable(
  'units',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    order: integer('order').notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('units_course_id_order_index').on(table.courseId, table.order),
    index('units_course_id_index').on(table.courseId),
    index('units_embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);
export const InsertUnitSchema = createInsertSchema(units);
export const SelectUnitSchema = createSelectSchema(units);

export type SelectUnit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;

export const modules = pgTable(
  'modules',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    order: integer('order').notNull(),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    unitId: uuid('unit_id')
      .notNull()
      .references(() => units.id),

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
export const InsertModuleSchema = createInsertSchema(modules);
export const SelectModuleSchema = createSelectSchema(modules);

export type SelectModule = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

export const taskTypeEnum = pgEnum('task_type', [
  'LESSON',
  'QUIZ',
  'MULTISTEP',
]);

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),

  order: integer('order').notNull(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),

  type: taskTypeEnum('type').notNull(),

  experiencePoints: integer('experience_points').notNull().default(10),
  stepsCount: integer('steps_count').notNull(),

  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const InsertTaskSchema = createInsertSchema(tasks);
export const SelectTaskSchema = createSelectSchema(tasks);

export type InsertTask = typeof tasks.$inferInsert;
export type SelectTask = typeof tasks.$inferSelect;

export const stepTypeEnum = pgEnum('step_type', [
  'TUTORIAL',
  'EXAMPLE',
  'QUESTION',
]);

export const TutorialStepContentSchema = z.object({
  type: z.literal('TUTORIAL'),
  title: z.string(),
  body: z.string(),
});

export const ExampleStepContentSchema = z.object({
  type: z.literal('EXAMPLE'),
  body: z.string(),
  answer: z.string(),
});

export const QuestionStepContentSchema = z.object({
  type: z.literal('QUESTION'),
  question: z.string(),
  alternatives: z.array(
    z.object({
      order: z.number(),
      content: z.string(),
      explanation: z.string(),
    }),
  ),
  correctAlternativeOrder: z.number(),
});

export const StepContentSchema = z.union([
  TutorialStepContentSchema,
  ExampleStepContentSchema,
  QuestionStepContentSchema,
]);

export type StepContent = z.infer<typeof StepContentSchema>;

export const steps = pgTable(
  'steps',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    order: integer('order').notNull(),
    content: jsonb('content').$type<StepContent>().notNull(),

    type: stepTypeEnum('type').notNull(),

    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id),
  },
  (table) => [
    uniqueIndex('steps_order_task_id_unique').on(table.order, table.taskId),
    index('steps_for_task').on(table.taskId),
  ],
);

export type SelectStep = Omit<
  Omit<typeof steps.$inferSelect, 'content'>,
  'type'
> &
  (
    | {
        type: 'TUTORIAL';
        content: z.infer<typeof TutorialStepContentSchema>;
      }
    | {
        type: 'EXAMPLE';
        content: z.infer<typeof ExampleStepContentSchema>;
      }
    | {
        type: 'QUESTION';
        content: z.infer<typeof QuestionStepContentSchema>;
      }
  );

export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),

  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
});

export const taskProgress = pgTable('task_progress', {
  id: uuid('id').primaryKey().defaultRandom(),

  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),

  lastCompletedStepId: uuid('last_completed_step_id').references(
    () => steps.id,
  ),
  stepsCompletedCount: integer('steps_completed_count').notNull().default(0),

  earnedExperiencePoints: integer('earned_experience_points'),

  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});
export type SelectTaskProgress = typeof taskProgress.$inferSelect;

export const taskProgressRelations = relations(
  taskProgress,
  ({ one, many }) => ({
    task: one(tasks, {
      fields: [taskProgress.taskId],
      references: [tasks.id],
    }),
    lastCompletedStep: one(steps, {
      fields: [taskProgress.lastCompletedStepId],
      references: [steps.id],
    }),
    user: one(users, {
      fields: [taskProgress.userId],
      references: [users.id],
    }),
    stepsProgress: many(stepProgress),
  }),
);

export const stepProgress = pgTable('step_progress', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),

  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id),

  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id),

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
  step: one(steps, {
    fields: [stepProgress.stepId],
    references: [steps.id],
  }),
  task: one(tasks, {
    fields: [stepProgress.taskId],
    references: [tasks.id],
  }),
  taskProgress: one(taskProgress, {
    fields: [stepProgress.taskProgressId],
    references: [taskProgress.id],
  }),
  user: one(users, {
    fields: [stepProgress.userId],
    references: [users.id],
  }),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  createdCourses: many(courses),
}));

export const coursesRelations = relations(courses, ({ many, one }) => ({
  units: many(units),
  sources: many(sources),
  enrollments: many(enrollments),
  creator: one(users, {
    fields: [courses.creatorId],
    references: [users.id],
  }),
}));

export const sourcesRelations = relations(sources, ({ one, many }) => ({
  course: one(courses, {
    fields: [sources.courseId],
    references: [courses.id],
  }),
  chunks: many(chunks),
}));

export const unitsRelations = relations(units, ({ many, one }) => ({
  modules: many(modules),
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
}));

export const modulesRelations = relations(modules, ({ many, one }) => ({
  tasks: many(tasks),
  unit: one(units, {
    fields: [modules.unitId],
    references: [units.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ many, one }) => ({
  steps: many(steps),
  module: one(modules, {
    fields: [tasks.moduleId],
    references: [modules.id],
  }),
}));

export const stepsRelations = relations(steps, ({ one }) => ({
  task: one(tasks, {
    fields: [steps.taskId],
    references: [tasks.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));
