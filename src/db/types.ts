import type {
  ExampleStepContent,
  QuestionStepContent,
  SelectTask,
  SelectTaskProgress,
  StepContent,
  TutorialStepContent,
  courses,
  enrollments,
  modules,
  sources,
  stepProgress,
  steps,
  units,
  users,
} from '@/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

// Base types from schema
export type User = InferSelectModel<typeof users>;
export type Course = InferSelectModel<typeof courses>;
export type Unit = InferSelectModel<typeof units>;
export type Module = InferSelectModel<typeof modules>;
export type Task = SelectTask;
export type Step = InferSelectModel<typeof steps>;
export type TaskProgress = SelectTaskProgress;
export type StepProgress = InferSelectModel<typeof stepProgress>;
export type Enrollment = InferSelectModel<typeof enrollments>;
export type Source = InferSelectModel<typeof sources>;

// Re-export step content types
export type {
  StepContent,
  TutorialStepContent,
  ExampleStepContent,
  QuestionStepContent,
};

// Extended types with relations
export type CourseWithRelations = Course & {
  units: UnitWithRelations[];
  creator: User;
};

export type UnitWithRelations = Unit & {
  modules: ModuleWithRelations[];
};

export type ModuleWithRelations = Module & {
  tasks: TaskWithRelations[];
};

export type TaskWithRelations = Task & {
  module: Module & {
    unit: Unit;
  };
  steps?: Step[];
};

export type TaskProgressWithRelations = TaskProgress & {
  task: Task;
  user: User;
  lastCompletedStep?: Step;
  stepsProgress: StepProgress[];
};

export type StepProgressWithRelations = StepProgress & {
  step: Step;
  task: Task;
  taskProgress: TaskProgress;
  user: User;
};
