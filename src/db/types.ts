import type {
  module,
  SelectTask,
  SelectTaskProgress,
  StepContent,
  course,
  enrollment,
  source,
  step,
  stepProgress,
  unit,
  user,
} from '@/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

// Base types from schema
export type User = InferSelectModel<typeof user>;
export type Course = InferSelectModel<typeof course>;
export type Unit = InferSelectModel<typeof unit>;
export type Module = InferSelectModel<typeof module>;
export type Task = SelectTask;
export type Step = InferSelectModel<typeof step>;
export type TaskProgress = SelectTaskProgress;
export type StepProgress = InferSelectModel<typeof stepProgress>;
export type Enrollment = InferSelectModel<typeof enrollment>;
export type Source = InferSelectModel<typeof source>;

// Re-export step content types
export type { StepContent };

// Extended types with relations
export type CourseWithRelations = Course & {
  units: UnitWithRelations[];
  creator: User;
  sources: Source[];
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
