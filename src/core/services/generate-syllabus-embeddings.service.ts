import { generateSyllabusEmbeddingsTask } from '@/trigger/generate-syllabus-embedding.task';
import { tasks } from '@trigger.dev/sdk/v3';
import type { Embedding } from '../domain/embedding';
import { createMultipleEmbeddings } from './create-embedding';

export interface GenerateCourseSyllabusServiceReq {
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

export interface GenerateSyllabusEmbeddingsResp {
  courseEmbedding: Embedding;
  unitEmbeddings: {
    embedding: Embedding;
    unitOrder: number;
  }[];
  sectionEmbeddings: {
    embedding: Embedding;
    sectionOrder: number;
    unitOrder: number;
  }[];
  lessonEmbeddings: {
    embedding: Embedding;
    lessonOrder: number;
    sectionOrder: number;
    unitOrder: number;
  }[];
}

export interface IGenerateSyllabusEmbeddingsService {
  execute(
    syllabus: GenerateCourseSyllabusServiceReq,
  ): Promise<GenerateSyllabusEmbeddingsResp>;
}

export class GenerateSyllabusEmbeddingsService
  implements IGenerateSyllabusEmbeddingsService
{
  async execute(
    syllabus: GenerateCourseSyllabusServiceReq,
  ): Promise<GenerateSyllabusEmbeddingsResp> {
    const units = syllabus.units.map((unit) => ({
      title: unit.title,
      description: unit.description,
      unitOrder: unit.order,
    }));

    const sections = syllabus.units.flatMap((unit) =>
      unit.sections.map((section) => ({
        title: section.title,
        description: section.description,
        sectionOrder: section.order,
        unitOrder: unit.order,
      })),
    );

    const lessons = syllabus.units.flatMap((unit) =>
      unit.sections.flatMap((section) =>
        section.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          lessonOrder: lesson.order,
          sectionOrder: section.order,
          unitOrder: unit.order,
        })),
      ),
    );

    const courseEmbeddingResult = await createMultipleEmbeddings([
      `${syllabus.title} ${syllabus.description}`,
      ...units.map((unit) => `${unit.title} ${unit.description}`),
      ...sections.map((section) => `${section.title} ${section.description}`),
      ...lessons.map((lesson) => `${lesson.title} ${lesson.description}`),
    ]);

    return {
      courseEmbedding: courseEmbeddingResult.embeddings[0],
      unitEmbeddings: units.map((unit, index) => ({
        embedding: courseEmbeddingResult.embeddings[1 + index],
        unitOrder: unit.unitOrder,
      })),
      sectionEmbeddings: sections.map((section, index) => ({
        embedding: courseEmbeddingResult.embeddings[
          1 + units.length + index
        ] as Embedding,
        sectionOrder: section.sectionOrder,
        unitOrder: section.unitOrder,
      })),
      lessonEmbeddings: lessons.map((lesson, index) => ({
        embedding:
          courseEmbeddingResult.embeddings[
            1 + units.length + sections.length + index
          ],
        lessonOrder: lesson.lessonOrder,
        sectionOrder: lesson.sectionOrder,
        unitOrder: lesson.unitOrder,
      })),
    };
  }
}

export class GenerateSyllabusEmbeddingsServiceTask
  implements IGenerateSyllabusEmbeddingsService
{
  async execute(
    syllabus: GenerateCourseSyllabusServiceReq,
  ): Promise<GenerateSyllabusEmbeddingsResp> {
    const run = await tasks.triggerAndWait<
      typeof generateSyllabusEmbeddingsTask
    >(generateSyllabusEmbeddingsTask.id, {
      syllabus,
    });

    if (!run.ok) {
      throw new Error('Failed to generate course syllabus embeddings');
    }

    return run.output;
  }
}
