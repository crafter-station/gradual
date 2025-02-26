import type { Scrapper } from '@/core/domain/scrapper';
import { parseSourceTask } from '@/trigger/create-course';
import { logger, tasks } from '@trigger.dev/sdk/v3';

export interface IParseSourceService {
  execute(url: string): Promise<string>;
}

export class ParseSourceService implements IParseSourceService {
  constructor(private scrapper: Scrapper) {}

  async execute(url: string): Promise<string> {
    const scrapeResult = await this.scrapper.scrap(url);

    if (!scrapeResult.success) {
      logger.error(`Error scraping ${url}`, {
        scrapeResult,
      });
      throw new Error('Failed to scrape source');
    }

    if (!scrapeResult.markdown) {
      logger.error(`No markdown content found for ${url}`, {
        scrapeResult,
      });
      throw new Error('No markdown content found');
    }

    logger.info(`Scraped ${url}`, {
      scrapeResult,
    });

    return scrapeResult.markdown;
  }
}

export class ParseSourceServiceTask implements IParseSourceService {
  constructor(private parseSourceService: ParseSourceService) {}

  async execute(url: string): Promise<string> {
    logger.info('Triggering parse source task', { url });

    const parseSourceRun = await tasks.triggerAndWait(parseSourceTask.id, {
      url,
    });

    if (!parseSourceRun.ok) {
      throw new Error('Failed to parse source');
    }

    return parseSourceRun.output;
  }
}
