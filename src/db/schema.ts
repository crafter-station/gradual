import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullname: varchar('fullname').notNull(),
  email: varchar('email').notNull(),
  avatarUrl: text('avatar_url').notNull(),
});

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  creatorId: uuid('creator_id')
    .notNull()
    .references(() => users.id),
  isPublic: boolean('is_public').notNull(),
});

export const sourceTypeEnum = pgEnum('source_type', ['FILE', 'URL']);

export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: sourceTypeEnum('type').notNull(),
  filePath: text('file_path').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  creatorId: uuid('creator_id')
    .notNull()
    .references(() => users.id),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
});

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  order: integer('order').notNull(),
  experiencePoints: integer('experience_points').notNull(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
});

export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  order: integer('order').notNull(),
  unitId: uuid('unit_id')
    .notNull()
    .references(() => units.id),
});

export const taskTypeEnum = pgEnum('task_type', [
  'LESSON',
  'QUIZ',
  'MULTISTEP',
]);

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull(),
  type: taskTypeEnum('type').notNull(),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id),
});

export const stepTypeEnum = pgEnum('step_type', [
  'TUTORIAL',
  'EXAMPLE',
  'QUESTION',
]);

export type TutorialStepContent = {
  body: string;
};

export type ExampleStepContent = {
  body: string;
  answer: string;
};

export type QuestionStepContent = {
  question: string;
  choices: {
    order: number;
    content: string;
    explanation: string;
    isCorrect: boolean;
  }[];
  answer: number;
};

export type StepContent =
  | TutorialStepContent
  | ExampleStepContent
  | QuestionStepContent;

export const steps = pgTable(
  'steps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: stepTypeEnum('type').notNull(),
    order: integer('order').notNull(),
    content: jsonb('content').$type<StepContent>().notNull(),
    taskId: uuid('task_id')
      .notNull()
      .references(() => tasks.id),
  },
  (table) => ({
    orderTaskIdUnique: uniqueIndex('steps_order_task_id_unique').on(
      table.order,
      table.taskId,
    ),
  }),
);

export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  lastAccessedAt: timestamp('last_accessed_at', {
    withTimezone: true,
  }).notNull(),
  lastStepId: uuid('last_step_id').notNull(),
  lastStepType: taskTypeEnum('last_step_type').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
});

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

export const sourcesRelations = relations(sources, ({ one }) => ({
  course: one(courses, {
    fields: [sources.courseId],
    references: [courses.id],
  }),
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
