import { Scrapper } from '../domain/scrapper';
import {
  ParseSourceService,
  ParseSourceServiceTask,
} from './parse-source.service';

const scrapper = new Scrapper(process.env.FIRECRAWL_API_KEY as string);

const baseParseSourceService = new ParseSourceService(scrapper);
const parseSourceService = new ParseSourceServiceTask(baseParseSourceService);

export type ServiceConstructor<T> = new (...args: any[]) => T;

export function service<T>(Service: ServiceConstructor<T>): T {
  if (Service === ParseSourceService) {
    return baseParseSourceService as T;
  }

  if (Service === ParseSourceServiceTask) {
    return parseSourceService as T;
  }

  throw new Error(`Servicio no registrado para ${Service.name}`);
}
