'use server';

import {
  generateQuestions,
  generateSections,
  generateTopics,
} from '@v1/ai/generators';
import type { ProgressUpdate, Section, Topic } from '@v1/ai/schemas';
import { logger } from '@v1/logger';
import { z } from 'zod';
import { getUser } from '../queries';
import type { ActionState } from '../types/action-state';
import { splitParagraphsAdvanced } from '../utils';
import { createCourse, updateCourseMetadata } from './course';
import { createQuestion } from './question';
import { createSection } from './section';
import { uploadFile } from './storage';
import { createTopic } from './topic';

export type ProcessDocumentActionState = ActionState<
  {
    title: string;
    file?: File;
    url?: string;
  },
  { id: string }
>;

export async function processDocument(
  prevState: ProcessDocumentActionState | undefined,
  formData: FormData,
): Promise<ProcessDocumentActionState> {
  const startTime = Date.now();
  const progressUpdates: ProgressUpdate[] = [];

  let courseId: string | undefined;

  const rawFormData = Object.fromEntries(formData.entries()) as {
    title: string;
    file?: File;
    url?: string;
  };

  try {
    const user = await getUser();
    if (!user) {
      throw new Error('User not found');
    }

    const form = z.object({
      title: z.string().min(1),
      file: z.instanceof(File).optional(),
      url: z.string().url().optional(),
    });

    const parsed = form.safeParse(rawFormData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const { title, file, url } = parsed.data;

    let pdfContent: string | undefined;

    let path: string | undefined;
    if (file) {
      const cleanedFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const filePath = `${Date.now()}-${cleanedFileName}`;
      progressUpdates.push({
        type: 'status',
        message: 'Uploading PDF file...',
        data: { progress: 10 },
      });
      const { fullPath } = await uploadFile('pdfs', filePath, file);
      path = fullPath;

      pdfContent = await parsePDF(file);
      if (!pdfContent) {
        throw new Error('Failed to parse PDF content');
      }
    } else {
      if (!url) {
        throw new Error('Either file or url is required');
      }
      pdfContent = await processWebPage(url);
    }

    if (!pdfContent) {
      throw new Error('Failed to process PDF or web page');
    }

    const course = await createCourse(title, user.id, url, path);
    courseId = course.id;

    const topics = await generateTopics(pdfContent, courseId);

    const topicResults = await Promise.all(
      topics.map((topic, topicIndex) =>
        processTopic(
          topic,
          topicIndex,
          topics.length,
          courseId as string,
          progressUpdates,
        ),
      ),
    );

    const allSections = topicResults.flatMap((t) => t.sections.flat());
    const totalSections = allSections.length;

    await updateCourseMetadata(courseId, topics.length, totalSections);

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
