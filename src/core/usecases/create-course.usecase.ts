import type { CreateChunksServiceTask } from '@/core/services/create-chunks.service';
import type { CreateCourseService } from '@/core/services/create-course.service';
import type { CreateSourceServiceTask } from '@/core/services/create-source.service';
import type { EnrichChunksServiceTask } from '@/core/services/enrich-chunk.service';
import { extractChunkTextsTask } from '@/core/services/extract-chunks-texts';
import type { GenerateCourseSyllabusServiceTask } from '@/core/services/generate-course-syllabus.service';
import type { GenerateLessonsStepsServiceTask } from '@/core/services/generate-lessons-steps.service';
import type { GenerateSyllabusEmbeddingsServiceTask } from '@/core/services/generate-syllabus-embeddings.service';
import type { ParseSourceServiceTask } from '@/core/services/parse-source.service';
import type { StoreCourseServiceTask } from '@/core/services/store-course.service';
import type { SumarizeChunksContentsServiceTask } from '@/core/services/summarize-chunk-content.service';
import type { SummarizeSourceContentServiceTask } from '@/core/services/summarize-source-content.service';
import { CHUNK_SIZE } from '@/lib/constants';

export class CreateCourseUseCase {
  constructor(
    private readonly parseSourceService: ParseSourceServiceTask,
    private readonly createChunksService: CreateChunksServiceTask,
    private readonly createCourseService: CreateCourseService,
    private readonly createSourceService: CreateSourceServiceTask,
    private readonly enrichChunksService: EnrichChunksServiceTask,
    private readonly generateCourseSyllabusService: GenerateCourseSyllabusServiceTask,
    private readonly generateLessonsStepsService: GenerateLessonsStepsServiceTask,
    private readonly generateSyllabusEmbeddingsService: GenerateSyllabusEmbeddingsServiceTask,
    private readonly storeCourseService: StoreCourseServiceTask,
    private readonly summarizeChunksService: SumarizeChunksContentsServiceTask,
    private readonly summarizeSourceContentService: SummarizeSourceContentServiceTask,
  ) {}

  async execute(payload: {
    userId: string;
    url: string;
  }) {
    const sourceContent = await this.parseSourceService.execute(payload.url);

    const chunks = await extractChunkTextsTask(sourceContent, CHUNK_SIZE);
    let summarizedChunks = await this.summarizeChunksService.execute(chunks);

    let sourceSummary = await this.summarizeSourceContentService.execute(
      summarizedChunks.map((chunk) => chunk.summary),
    );

    const enrichedChunks = await this.enrichChunksService.execute(
      summarizedChunks.map((chunk) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        sourceSummary: sourceSummary,
        precedingChunkContent:
          summarizedChunks.find((c) => c.order === chunk.order - 1)
            ?.rawContent ?? null,
        succeedingChunkContent:
          summarizedChunks.find((c) => c.order === chunk.order + 1)
            ?.rawContent ?? null,
      })),
      CHUNK_SIZE,
    );

    for (const element of enrichedChunks) {
      element.rawContent = summarizedChunks[element.order].rawContent;
    }

    summarizedChunks = [];

    // enriched source summary
    sourceSummary = await this.summarizeSourceContentService.execute(
      enrichedChunks.map((chunk) => chunk.enrichedSummary),
    );

    const source = await this.createSourceService.execute(
      payload.url,
      payload.userId,
      sourceSummary,
      enrichedChunks.length,
    );

    const sourceId = source.id;

    await this.createChunksService.execute(
      sourceId,
      enrichedChunks.map((chunk) => ({
        order: chunk.order,
        rawContent: chunk.rawContent,
        summary: chunk.enrichedSummary,
        enrichedContent: chunk.enrichedContent,
      })),
    );

    const contentSize = getContentSize(sourceContent.length);

    const syllabus = await this.generateCourseSyllabusService.execute(
      sourceSummary,
      enrichedChunks.map((chunk) => chunk.enrichedSummary),
      contentSize,
    );

    const {
      courseEmbedding,
      unitEmbeddings,
      sectionEmbeddings,
      lessonEmbeddings,
    } = await this.generateSyllabusEmbeddingsService.execute(syllabus);

    const { course, units, sections, lessons } =
      await this.createCourseService.execute(
        syllabus,
        courseEmbedding,
        unitEmbeddings,
        sectionEmbeddings,
        lessonEmbeddings,
        payload.userId,
      );

    await this.storeCourseService.execute(
      course,
      units,
      sections,
      lessons,
      sourceId,
    );

    const firstSectionLessons = lessons.filter(
      (lesson) =>
        lesson.unitOrder(sections, units) === 1 &&
        lesson.sectionOrder(sections) === 1,
    );

    await this.generateLessonsStepsService.execute(
      firstSectionLessons.map((lesson) => ({
        lesson: {
          id: lesson.id,
          type: lesson.type,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
        },
        syllabus,
        sourceId,
        unitOrder: lesson.unitOrder(sections, units),
        sectionOrder: lesson.sectionOrder(sections),
        unitTitle:
          units.find((u) => u.order === lesson.unitOrder(sections, units))
            ?.title ?? '',
        sectionTitle:
          sections.find((m) => m.order === lesson.sectionOrder(sections))
            ?.title ?? '',
      })),
    );
  }
}

function getContentSize(sourceContentLength: number) {
  return sourceContentLength > CHUNK_SIZE * 50
    ? 'large'
    : sourceContentLength > CHUNK_SIZE * 10
      ? 'medium'
      : 'small';
}
