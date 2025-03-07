import { ChunkRepo } from '../domain/chunk-repo';
import { CourseRepo } from '../domain/course-repo';
import { Scrapper } from '../domain/scrapper';
import { SectionRepo } from '../domain/section-repo';
import { SourceRepo } from '../domain/source-repo';
import { StepRepo } from '../domain/step-repo';
import { TaskRepo } from '../domain/task-repo';
import { UnitRepo } from '../domain/unit-repo';
import {
  CreateChunksService,
  CreateChunksServiceTask,
} from './create-chunks.service';
import { CreateCourseService } from './create-course.service';
import {
  CreateSourceService,
  CreateSourceServiceTask,
} from './create-source.service';
import {
  EnrichChunkContentService,
  EnrichChunkContentServiceTask,
} from './enrich-chunk-content.service';
import {
  EnrichChunkService,
  EnrichChunksServiceTask,
} from './enrich-chunk.service';
import {
  GenerateCourseSyllabusService,
  GenerateCourseSyllabusServiceTask,
} from './generate-course-syllabus.service';
import {
  GenerateLessonStepsService,
  GenerateLessonsStepsServiceTask,
} from './generate-lessons-steps.service';
import {
  GenerateSyllabusEmbeddingsService,
  GenerateSyllabusEmbeddingsServiceTask,
} from './generate-syllabus-embeddings.service';
import {
  ParseSourceService,
  ParseSourceServiceTask,
} from './parse-source.service';
import {
  StoreCourseService,
  StoreCourseServiceTask,
} from './store-course.service';
import {
  SumarizeChunksContentsServiceTask,
  SummarizeChunkContentService,
  SummarizeChunkContentServiceTask,
} from './summarize-chunk-content.service';
import {
  SummarizeSourceContentService,
  SummarizeSourceContentServiceTask,
} from './summarize-source-content.service';

const scrapper = new Scrapper(process.env.FIRECRAWL_API_KEY as string);

const courseRepo = new CourseRepo();
const unitRepo = new UnitRepo();
const sectionRepo = new SectionRepo();
const taskRepo = new TaskRepo();
const sourceRepo = new SourceRepo();
const chunkRepo = new ChunkRepo();
const stepRepo = new StepRepo();

const parseSourceService = new ParseSourceService(scrapper);
const parseSourceServiceTask = new ParseSourceServiceTask();

const summarizeChunkContentService = new SummarizeChunkContentService();
const summarizeChunkContentServiceTask = new SummarizeChunkContentServiceTask();
const summarizeChunksContentsServiceTask =
  new SumarizeChunksContentsServiceTask();

const summarizeSourceContentService = new SummarizeSourceContentService();
const summarizeSourceContentServiceTask =
  new SummarizeSourceContentServiceTask();

const enrichChunkContentService = new EnrichChunkContentService();
const enrichChunkContentServiceTask = new EnrichChunkContentServiceTask();

const enrichChunkService = new EnrichChunkService(
  summarizeChunkContentServiceTask,
  enrichChunkContentServiceTask,
);
const enrichChunksServiceTask = new EnrichChunksServiceTask();

const createSourceService = new CreateSourceService(sourceRepo);
const createSourceServiceTask = new CreateSourceServiceTask();

const createChunksService = new CreateChunksService(chunkRepo);
const createChunksServiceTask = new CreateChunksServiceTask();

const generateCourseSyllabusService = new GenerateCourseSyllabusService();
const generateCourseSyllabusServiceTask =
  new GenerateCourseSyllabusServiceTask();

const generateSyllabusEmbeddingsService =
  new GenerateSyllabusEmbeddingsService();
const generateSyllabusEmbeddingsServiceTask =
  new GenerateSyllabusEmbeddingsServiceTask();

const createCourseService = new CreateCourseService();

const storeCourseService = new StoreCourseService(
  courseRepo,
  unitRepo,
  sectionRepo,
  taskRepo,
  sourceRepo,
);
const storeCourseServiceTask = new StoreCourseServiceTask();

const generateLessonStepsService = new GenerateLessonStepsService(
  taskRepo,
  chunkRepo,
  stepRepo,
);
const generateLessonsStepsServiceTask = new GenerateLessonsStepsServiceTask();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ServiceConstructor<T> = new (...args: any[]) => T;

export function service<T>(Service: ServiceConstructor<T>): T {
  if (Service === ParseSourceService) {
    return parseSourceService as T;
  }

  if (Service === ParseSourceServiceTask) {
    return parseSourceServiceTask as T;
  }

  switch (Service) {
    case ParseSourceService:
      return parseSourceService as T;
    case ParseSourceServiceTask:
      return parseSourceServiceTask as T;
    case SummarizeChunkContentService:
      return summarizeChunkContentService as T;
    case SummarizeChunkContentServiceTask:
      return summarizeChunkContentServiceTask as T;
    case SumarizeChunksContentsServiceTask:
      return summarizeChunksContentsServiceTask as T;
    case SummarizeSourceContentService:
      return summarizeSourceContentService as T;
    case SummarizeSourceContentServiceTask:
      return summarizeSourceContentServiceTask as T;
    case EnrichChunkContentService:
      return enrichChunkContentService as T;
    case EnrichChunkContentServiceTask:
      return enrichChunkContentServiceTask as T;
    case EnrichChunkService:
      return enrichChunkService as T;
    case EnrichChunksServiceTask:
      return enrichChunksServiceTask as T;
    case CreateSourceService:
      return createSourceService as T;
    case CreateSourceServiceTask:
      return createSourceServiceTask as T;
    case CreateChunksService:
      return createChunksService as T;
    case CreateChunksServiceTask:
      return createChunksServiceTask as T;
    case GenerateCourseSyllabusService:
      return generateCourseSyllabusService as T;
    case GenerateCourseSyllabusServiceTask:
      return generateCourseSyllabusServiceTask as T;
    case GenerateSyllabusEmbeddingsService:
      return generateSyllabusEmbeddingsService as T;
    case GenerateSyllabusEmbeddingsServiceTask:
      return generateSyllabusEmbeddingsServiceTask as T;
    case CreateCourseService:
      return createCourseService as T;
    case GenerateLessonStepsService:
      return generateLessonStepsService as T;
    case GenerateLessonsStepsServiceTask:
      return generateLessonsStepsServiceTask as T;
    case StoreCourseService:
      return storeCourseService as T;
    case StoreCourseServiceTask:
      return storeCourseServiceTask as T;
  }

  throw new Error(`Service not registered ${Service.name}`);
}
