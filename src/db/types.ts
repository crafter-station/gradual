import type {
  SelectTask,
  SelectTaskProgress,
  StepContent,
  course,
  enrollment,
  section,
  source,
  step,
  stepProgress,
  unit,
  user,
  waitlist,
} from '@/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

// Base types from schema
export type User = InferSelectModel<typeof user>;
export type Course = InferSelectModel<typeof course>;
export type Unit = InferSelectModel<typeof unit>;
export type Section = InferSelectModel<typeof section>;
export type Task = SelectTask;
export type Step = InferSelectModel<typeof step>;
export type TaskProgress = SelectTaskProgress;
export type StepProgress = InferSelectModel<typeof stepProgress>;
export type Enrollment = InferSelectModel<typeof enrollment>;
export type Source = InferSelectModel<typeof source>;
export type Waitlist = InferSelectModel<typeof waitlist>;

// Re-export step content types
export type { StepContent };

// Extended types with relations
export type CourseWithRelations = Course & {
  units: UnitWithRelations[];
  creator: User;
  sources: Source[];
};

export type UnitWithRelations = Unit & {
  sections: SectionWithRelations[];
};

export type SectionWithRelations = Section & {
  tasks: TaskWithRelations[];
};

export type TaskWithRelations = Task & {
  section: Section & {
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
