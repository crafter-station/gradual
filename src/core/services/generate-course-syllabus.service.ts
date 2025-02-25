import { getGenerateCourseSyllabusPrompt } from '@/lib/prompts';
import { SyllabusSchema } from '@/lib/schemas';
import { openai } from '@ai-sdk/openai';
import { schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { generateObject } from 'ai';
import { z } from 'zod';

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
    const syllabusResult = await generateObject({
      model: openai('o3-mini'),
      prompt: getGenerateCourseSyllabusPrompt({
        documentSummary: documentSummary,
        documentChunksSummariesJoined: documentChunksSummaries.join('\n'),
        contentSize: contentSize,
      }),
      schema: SyllabusSchema,
    });

    return syllabusResult.object;
  }
}

export class GenerateCourseSyllabusServiceTask
  implements IGenerateCourseSyllabusService
{
  constructor(private service: IGenerateCourseSyllabusService) {}

  async execute(
    documentSummary: string,
    documentChunksSummaries: string[],
    contentSize: 'small' | 'medium' | 'large',
  ): Promise<GenerateCourseSyllabusServiceResp> {
    const GenerateCourseSyllabusTask = schemaTask({
      id: 'generate-course-syllabus',
      schema: z.object({
        documentSummary: z.string(),
        documentChunksSummaries: z.array(z.string()),
        contentSize: z.enum(['small', 'medium', 'large']),
      }),
      run: async (payload) => {
        return await this.service.execute(
          payload.documentSummary,
          payload.documentChunksSummaries,
          payload.contentSize,
        );
      },
      retry: {
        maxAttempts: 3,
      },
    });

    const syllabusResult = await tasks.triggerAndWait<
      typeof GenerateCourseSyllabusTask
    >('generate-course-syllabus', {
      documentSummary: documentSummary,
      documentChunksSummaries: documentChunksSummaries,
      contentSize,
    });

    if (!syllabusResult.ok) {
      throw new Error('Failed to generate course syllabus');
    }

    return syllabusResult.output;
  }
}
