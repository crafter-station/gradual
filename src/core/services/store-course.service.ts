import { storeSyllabusTask } from '@/trigger/store-syllabus.task';
import { tasks as _tasks } from '@trigger.dev/sdk/v3';
import type { Course } from '../domain/course';
import type { CourseRepo } from '../domain/course-repo';
import type { Section } from '../domain/section';
import type { SectionRepo } from '../domain/section-repo';
import type { SourceRepo } from '../domain/source-repo';
import type { Task } from '../domain/task';
import type { TaskRepo } from '../domain/task-repo';
import type { Unit } from '../domain/unit';
import type { UnitRepo } from '../domain/unit-repo';

export interface IStoreCourseService {
  execute(
    course: Course,
    units: Unit[],
    sections: Section[],
    tasks: Task[],
    sourceId: string,
  ): Promise<void>;
}

export class StoreCourseService implements IStoreCourseService {
  constructor(
    private courseRepo: CourseRepo,
    private unitRepo: UnitRepo,
    private sectionRepo: SectionRepo,
    private taskRepo: TaskRepo,
    private sourceRepo: SourceRepo,
  ) {}

  async execute(
    course: Course,
    units: Unit[],
    sections: Section[],
    tasks: Task[],
    sourceId: string,
  ): Promise<void> {
    await this.courseRepo.store(course);
    await this.unitRepo.storeMany(units);
    await this.sectionRepo.storeMany(sections);
    await this.taskRepo.storeMany(tasks);
    await this.sourceRepo.updateCourseId(sourceId, course.id);
    await this.courseRepo.enrollCreator(course);
  }
}

export class StoreCourseServiceTask implements IStoreCourseService {
  async execute(
    course: Course,
    units: Unit[],
    sections: Section[],
    tasks: Task[],
    sourceId: string,
  ): Promise<void> {
    const run = await _tasks.triggerAndWait<typeof storeSyllabusTask>(
      storeSyllabusTask.id,
      {
        course,
        units,
        sections,
        tasks,
        sourceId,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to store course, units, sections and lessons');
    }

    return run.output;
  }
}
