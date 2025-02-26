import { Scrapper } from '../domain/scrapper';
import { SourceRepo } from '../domain/source-repo';
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
  ParseSourceService,
  ParseSourceServiceTask,
} from './parse-source.service';
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

const sourceRepo = new SourceRepo();

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
  }

  throw new Error(`Service not registered ${Service.name}`);
}
