import * as schema from '@/db/schema';
import { getGenerateLessonPrompt } from '@/lib/prompts';
import { formatSyllabus } from '@/lib/utils';
import { generateLessonStepsTask } from '@/trigger/generate-lesson-step.task';
import { batch } from '@trigger.dev/sdk/v3';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { OpenAIGenerator } from '../domain/aigen';
import type { ChunkRepo } from '../domain/chunk-repo';
import { Step } from '../domain/step';
import type { StepRepo } from '../domain/step-repo';
import type { TaskRepo } from '../domain/task-repo';
import type { Syllabus } from './create-course.service';

export interface TaskDTO {
  id: string;
  type: 'LESSON' | 'QUIZ' | 'MULTISTEP';
  title: string;
  description: string;
  order: number;
}

export interface IGenerateLessonsStepsService {
  execute(
    payloads: {
      lesson: TaskDTO;
      syllabus: Syllabus;
      sourceId: string;
      unitOrder: number;
      sectionOrder: number;
      unitTitle: string;
      sectionTitle: string;
    }[],
  ): Promise<Step[][]>;
}

export class GenerateLessonStepsService {
  constructor(
    private taskRepo: TaskRepo,
    private chunkRepo: ChunkRepo,
    private stepRepo: StepRepo,
  ) {}

  async execute(
    lesson: TaskDTO,
    syllabus: Syllabus,
    sourceId: string,
    unitOrder: number,
    sectionOrder: number,
    unitTitle: string,
    sectionTitle: string,
  ): Promise<Step[]> {
    const MAX_SIMILAR_CHUNKS = 3;

    const lessonEmbedding = await this.taskRepo.findEmbedding(lesson.id);

    const chunks = await this.chunkRepo.findBySourceIdWithEmbedding(
      sourceId,
      lessonEmbedding,
      MAX_SIMILAR_CHUNKS,
    );

    const result = await new OpenAIGenerator().generateObject({
      model: 'o3-mini',
      prompt: getGenerateLessonPrompt({
        lesson: {
          description: lesson.description,
          title: `${unitOrder}.${sectionOrder}.${lesson.order}. ${lesson.title}`,
        },
        chunks: chunks.map((chunk) => chunk.enrichedContent),
        syllabus: formatSyllabus(syllabus),
        unitTitle: `${unitOrder}. ${unitTitle}`,
        sectionTitle: `${unitOrder}.${sectionOrder}. ${sectionTitle}`,
      }),
      schema: z.object({
        steps: z.array(schema.StepContentSchema),
      }),
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'generate-lessons-steps',
      },
    });

    const steps = result.steps.map((step, index) => {
      return new Step(
        uuidv4(),
        // +1 to start counting from 1
        index + 1,
        step,
        step.type,
        lesson.id,
      );
    });

    await this.taskRepo.updateStepsCount(lesson.id, steps.length);
    await this.stepRepo.storeMany(steps);

    return steps;
  }
}

export class GenerateLessonsStepsServiceTask
  implements IGenerateLessonsStepsService
{
  async execute(
    payloads: {
      lesson: TaskDTO;
      syllabus: Syllabus;
      sourceId: string;
      unitOrder: number;
      sectionOrder: number;
      unitTitle: string;
      sectionTitle: string;
    }[],
  ): Promise<Step[][]> {
    const result = await batch.triggerByTaskAndWait(
      payloads.map((payload) => ({
        task: generateLessonStepsTask,
        payload: payload,
      })),
    );

    const steps = [];
    for (const run of result.runs) {
      if (!run.ok) {
        throw new Error('Failed to generate lesson steps');
      }

      steps.push(run.output);
    }

    return steps;
  }
}
