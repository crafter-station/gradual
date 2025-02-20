'use server';

import { getCurrentUser } from '@/db/utils';
import type { Doc } from '@/lib/doc';
import { PDFDoc, WebPageDoc } from '@/lib/doc';
import { getGenerateCourseSyllabusPrompt } from '@/lib/prompts/generate_course_syllabus';
import type { ActionState } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export type ProcessDocumentActionState = ActionState<
  {
    file?: File;
    url?: string;
  },
  { id: string }
>;

export async function processDocument(
  prevState: ProcessDocumentActionState | undefined,
  formData: FormData,
): Promise<ProcessDocumentActionState> {
  const rawFormData = Object.fromEntries(formData.entries()) as {
    file?: File;
    url?: string;
  };

  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const form = z.object({
      file: z.instanceof(File).optional(),
      url: z.string().url().optional(),
    });

    const parsed = form.safeParse(rawFormData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const { file, url } = parsed.data;

    let document: Doc;

    if (file) {
      document = new PDFDoc(file);
    } else {
      if (!url) {
        throw new Error('Either file or url is required');
      }
      document = new WebPageDoc(url);
    }

    await document.init();

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      prompt: getGenerateCourseSyllabusPrompt({
        documentSummary: document.summary,
        documentChunksSummariesJoined: document.enrichedChunks
          .map((chunk) => chunk.enrichedSummary)
          .join('\n'),
      }),
      schema: z.object({
        title: z.string(),
        units: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            modules: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                topics: z.array(z.string()),
              }),
            ),
          }),
        ),
      }),
    });

    return { success: true, data: { id: courseId }, form: { title, url } };
  } catch (error) {
    logger.error('PDF processing failed', {
      step: 'error',
      courseId,
      duration: Date.now() - startTime,
      error,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      form: rawFormData,
    };
  }
}

async function processTopic(
  topic: Topic,
  topicIndex: number,
  totalTopics: number,
  courseId: string,
  progressUpdates: ProgressUpdate[],
) {
  const topicData = await createTopic(courseId, topic.topicName, topicIndex);
  const chunks = splitParagraphsAdvanced(topic.topicText, 800);

  const sections = await Promise.all(
    chunks.map((chunk, chunkIndex) =>
      processSection(
        chunk,
        chunkIndex,
        topicData.id,
        topicIndex,
        totalTopics,
        courseId,
      ),
    ),
  );

  progressUpdates.push({
    type: 'topic',
    message: `Processed topic: ${topic.topicName}`,
    data: {
      progress: 40 + (topicIndex / totalTopics) * 20,
      currentTopic: topicIndex + 1,
      totalTopics,
    },
  });

  return { topic: topicData, sections };
}

async function processSection(
  chunk: string,
  chunkIndex: number,
  topicId: string,
  topicIndex: number,
  totalTopics: number,
  courseId: string,
) {
  const sections = await generateSections(chunk, { courseId, topicId });
  const results = await Promise.all(
    sections.map((section, sectionIndex) =>
      createSectionAndQuestions(
        section,
        sectionIndex,
        chunkIndex,
        sections.length,
        topicId,
        courseId,
        topicIndex,
        totalTopics,
      ),
    ),
  );
  return results.flat();
}

async function createSectionAndQuestions(
  section: Section,
  sectionIndex: number,
  chunkIndex: number,
  totalSections: number,
  topicId: string,
  courseId: string,
  topicIndex: number,
  totalTopics: number,
) {
  const sectionData = await createSection(
    topicId,
    section.sectionName,
    section.summaryText,
    chunkIndex * totalSections + sectionIndex + 1,
  );
  const questions = await processQuestions(
    sectionData.id,
    section.summaryText,
    courseId,
    topicId,
  );

  return {
    ...sectionData,
    questions,
    progress: {
      type: 'section',
      message: `Processed section: ${section.sectionName}`,
      data: {
        progress: 60 + (topicIndex / totalTopics) * 20,
        currentSection: sectionIndex + 1,
        totalSections,
      },
    },
  };
}

async function processQuestions(
  sectionId: string,
  content: string,
  courseId: string,
  topicId: string,
) {
  const questions = await generateQuestions(content, {
    courseId,
    topicId,
    sectionId,
  });
  return Promise.all(
    questions.map((question) =>
      createQuestion(
        sectionId,
        question.question,
        question.correct_answer,
        question.distractors,
        question.explanation,
      ),
    ),
  );
}
