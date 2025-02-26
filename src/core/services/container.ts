import { Scrapper } from '../domain/scrapper';
import {
  ParseSourceService,
  ParseSourceServiceTask,
} from './parse-source.service';

const scrapper = new Scrapper(process.env.FIRECRAWL_API_KEY as string);

const parseSourceService = new ParseSourceService(scrapper);
const parseSourceServiceTask = new ParseSourceServiceTask();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ServiceConstructor<T> = new (...args: any[]) => T;

export function service<T>(Service: ServiceConstructor<T>): T {
  if (Service === ParseSourceService) {
    return parseSourceService as T;
  }

  if (Service === ParseSourceServiceTask) {
    return parseSourceServiceTask as T;
  }

  throw new Error(`Service not registered ${Service.name}`);
}
