import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
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

const baseStepColumns = {
  id: uuid('id').primaryKey().defaultRandom(),
  order: integer('order').notNull(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id),
};

const baseContentStepColumns = {
  ...baseStepColumns,
  content: text('content').notNull(),
};

export const tutorialSteps = pgTable('tutorial_steps', baseContentStepColumns);

export const exampleSteps = pgTable('example_steps', baseContentStepColumns);

export const questionSteps = pgTable('question_steps', {
  ...baseStepColumns,
  question: text('question').notNull(),
  choice1: text('choice1').notNull(),
  choice2: text('choice2').notNull(),
  choice3: text('choice3').notNull(),
  choice4: text('choice4').notNull(),
  rightChoice: integer('right_choice').notNull(),
  explanation: text('explanation').notNull(),
});

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
  tutorialSteps: many(tutorialSteps),
  exampleSteps: many(exampleSteps),
  questionSteps: many(questionSteps),
  module: one(modules, {
    fields: [tasks.moduleId],
    references: [modules.id],
  }),
}));
