import { storeSyllabusTask } from '@/trigger/store-syllabus.task';
import { tasks } from '@trigger.dev/sdk/v3';
import { v4 as uuidv4 } from 'uuid';
import { Course } from '../domain/course';
import type { CourseRepo } from '../domain/course-repo';
import type { Embedding } from '../domain/embedding';
import { Section } from '../domain/section';
import type { SectionRepo } from '../domain/section-repo';
import type { SourceRepo } from '../domain/source-repo';
import { Task } from '../domain/task';
import type { TaskRepo } from '../domain/task-repo';
import { Unit } from '../domain/unit';
import type { UnitRepo } from '../domain/unit-repo';

export interface Syllabus {
  title: string;
  description: string;
  units: {
    order: number;
    title: string;
    description: string;
    sections: {
      order: number;
      title: string;
      description: string;
      lessons: { order: number; title: string; description: string }[];
    }[];
  }[];
}

export interface ICreateCourseService {
  execute(
    syllabus: Syllabus,
    courseEmbedding: Embedding,
    unitEmbeddings: {
      embedding: Embedding;
      unitOrder: number;
    }[],
    sectionEmbeddings: {
      embedding: Embedding;
      sectionOrder: number;
      unitOrder: number;
    }[],
    lessonEmbeddings: {
      embedding: Embedding;
      lessonOrder: number;
      sectionOrder: number;
      unitOrder: number;
    }[],
    userId: string,
    sourceId: string,
  ): Promise<{
    course: Course;
    units: Unit[];
    sections: Section[];
    lessons: Task[];
  }>;
}

export class CreateCourseService implements ICreateCourseService {
  constructor(
    private courseRepo: CourseRepo,
    private unitRepo: UnitRepo,
    private sectionRepo: SectionRepo,
    private taskRepo: TaskRepo,
    private sourceRepo: SourceRepo,
  ) {}

  async execute(
    syllabus: Syllabus,
    courseEmbedding: Embedding,
    unitEmbeddings: {
      embedding: Embedding;
      unitOrder: number;
    }[],
    sectionEmbeddings: {
      embedding: Embedding;
      sectionOrder: number;
      unitOrder: number;
    }[],
    lessonEmbeddings: {
      embedding: Embedding;
      lessonOrder: number;
      sectionOrder: number;
      unitOrder: number;
    }[],
    userId: string,
    sourceId: string,
  ): Promise<{
    course: Course;
    units: Unit[];
    sections: Section[];
    lessons: Task[];
  }> {
    const course = new Course(
      uuidv4(),
      syllabus.title,
      syllabus.description,
      userId,
      courseEmbedding,
    );

    const units = syllabus.units.map((unit) => {
      return new Unit(
        uuidv4(),
        unit.order,
        unit.title,
        unit.description,
        unitEmbeddings.find((u) => u.unitOrder === unit.order)?.embedding ?? [],
        course.id,
      );
    });

    const sections = syllabus.units.flatMap((unit) =>
      unit.sections.map((section) => {
        return new Section(
          uuidv4(),
          section.order,
          section.title,
          section.description,
          sectionEmbeddings.find(
            (u) =>
              u.sectionOrder === section.order && u.unitOrder === unit.order,
          )?.embedding ?? [],
          units.find((u) => u.order === unit.order)?.id ?? '',
        );
      }),
    );

    const getsectionId = (unitOrder: number, sectionOrder: number) =>
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      sections.find(
        (m) =>
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          m.unitId === units.find((u) => u.order === unitOrder)!.id &&
          m.order === sectionOrder,
      )!.id;

    const getEmbedding = (
      unitOrder: number,
      sectionOrder: number,
      lessonOrder: number,
    ) =>
      lessonEmbeddings.find(
        (l) =>
          l.lessonOrder === lessonOrder &&
          l.sectionOrder === sectionOrder &&
          l.unitOrder === unitOrder,
      )?.embedding ?? [];

    const tasks = syllabus.units.flatMap((unit) =>
      unit.sections.flatMap((section) =>
        section.lessons.map((lesson) => {
          return new Task(
            uuidv4(),
            'LESSON',
            lesson.title,
            lesson.description,
            getEmbedding(unit.order, section.order, lesson.order),
            lesson.order,
            0,
            getsectionId(unit.order, section.order),
          );
        }),
      ),
    );

    await this.courseRepo.store(course);
    await this.unitRepo.storeMany(units);
    await this.sectionRepo.storeMany(sections);
    await this.taskRepo.storeMany(tasks);
    await this.sourceRepo.updateCourseId(sourceId, course.id);

    return {
      course,
      units,
      sections,
      lessons: tasks,
    };
  }
}

export class CreateCourseServiceTask implements ICreateCourseService {
  async execute(
    syllabus: Syllabus,
    courseEmbedding: Embedding,
    unitEmbeddings: {
      embedding: Embedding;
      unitOrder: number;
    }[],
    sectionEmbeddings: {
      embedding: Embedding;
      sectionOrder: number;
      unitOrder: number;
    }[],
    lessonEmbeddings: {
      embedding: Embedding;
      lessonOrder: number;
      sectionOrder: number;
      unitOrder: number;
    }[],
    userId: string,
    sourceId: string,
  ): Promise<{
    course: Course;
    units: Unit[];
    sections: Section[];
    lessons: Task[];
  }> {
    const run = await tasks.triggerAndWait<typeof storeSyllabusTask>(
      storeSyllabusTask.id,
      {
        syllabus,
        courseEmbedding,
        unitEmbeddings,
        sectionEmbeddings,
        lessonEmbeddings,
        userId,
        sourceId,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to store course, units, sections and lessons');
    }

    return run.output;
  }
}
