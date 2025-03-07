import { getGenerateCourseSyllabusPrompt } from '@/lib/prompts';
import { SyllabusSchema } from '@/lib/schemas';
import { generateCourseSyllabusTask } from '@/trigger/generate-course-syllabus.task';
import { tasks } from '@trigger.dev/sdk/v3';
import { OpenAIGenerator } from '../domain/aigen';

export interface GenerateCourseSyllabusServiceResp {
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

export interface IGenerateCourseSyllabusService {
  execute(
    documentSummary: string,
    documentChunksSummaries: string[],
    contentSize: 'small' | 'medium' | 'large',
  ): Promise<GenerateCourseSyllabusServiceResp>;
}

export class GenerateCourseSyllabusService
  implements IGenerateCourseSyllabusService
{
  async execute(
    documentSummary: string,
    documentChunksSummaries: string[],
    contentSize: 'small' | 'medium' | 'large',
  ): Promise<GenerateCourseSyllabusServiceResp> {
    const syllabusResult = await new OpenAIGenerator().generateObject({
      model: 'o3-mini',
      prompt: getGenerateCourseSyllabusPrompt({
        documentSummary: documentSummary,
        documentChunksSummariesJoined: documentChunksSummaries.join('\n'),
        contentSize: contentSize,
      }),
      schema: SyllabusSchema,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'generate-course-syllabus',
      },
    });

    return syllabusResult;
  }
}

export class GenerateCourseSyllabusServiceTask
  implements IGenerateCourseSyllabusService
{
  async execute(
    documentSummary: string,
    documentChunksSummaries: string[],
    contentSize: 'small' | 'medium' | 'large',
  ): Promise<GenerateCourseSyllabusServiceResp> {
    const run = await tasks.triggerAndWait<typeof generateCourseSyllabusTask>(
      generateCourseSyllabusTask.id,
      {
        documentSummary: documentSummary,
        documentChunksSummaries: documentChunksSummaries,
        contentSize,
      },
    );

    if (!run.ok) {
      throw new Error('Failed to generate course syllabus');
    }

    return run.output;
  }
}
