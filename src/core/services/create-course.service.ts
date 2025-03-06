import { v4 as uuidv4 } from 'uuid';
import { Course } from '../domain/course';
import type { Embedding } from '../domain/embedding';
import { Section } from '../domain/section';
import { Task } from '../domain/task';
import { Unit } from '../domain/unit';

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

export class CreateCourseService {
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
      syllabus.units.length,
      syllabus.units
        .flatMap((unit) => unit.sections.length)
        .reduce((a, b) => a + b, 0),
      syllabus.units
        .flatMap((unit) =>
          unit.sections.flatMap((section) => section.lessons.length),
        )
        .reduce((a, b) => a + b, 0),
    );

    const units = syllabus.units.map((unit) => {
      return new Unit(
        uuidv4(),
        unit.order,
        unit.title,
        unit.description,
        unitEmbeddings.find((u) => u.unitOrder === unit.order)?.embedding ?? [],
        course.id,
        unit.sections.length,
        unit.sections
          .flatMap((section) => section.lessons.length)
          .reduce((a, b) => a + b, 0),
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
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          units.find((u) => u.order === unit.order)!.id,
          section.lessons.length,
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
            course.id,
          );
        }),
      ),
    );

    return {
      course,
      units,
      sections,
      lessons: tasks,
    };
  }
}
