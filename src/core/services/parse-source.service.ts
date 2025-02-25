import type { Logger } from '@/core/domain/logger';
import type { Scrapper } from '@/core/domain/scrapper';
import { logger, schemaTask, tasks } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export interface IParseSourceService {
  execute(url: string): Promise<string>;
}

export class ParseSourceService implements IParseSourceService {
  constructor(
    private scrapper: Scrapper,
    private logger: Logger,
  ) {}

  async execute(url: string): Promise<string> {
    const scrapeResult = await this.scrapper.scrap(url);

    if (!scrapeResult.success) {
      this.logger.error(`Error scraping ${url}`, {
        scrapeResult,
      });
      throw new Error('Failed to scrape source');
    }

    if (!scrapeResult.markdown) {
      this.logger.error(`No markdown content found for ${url}`, {
        scrapeResult,
      });
      throw new Error('No markdown content found');
    }

    this.logger.info(`Scraped ${url}`, {
      scrapeResult,
    });

    return scrapeResult.markdown;
  }
}

export class ParseSourceServiceTask implements IParseSourceService {
  constructor(private parseSourceService: IParseSourceService) {}

  async execute(url: string): Promise<string> {
    const ParseSourceTask = schemaTask({
      id: 'parse-source',
      schema: z.object({
        url: z.string().url(),
      }),
      run: async (payload) => {
        return this.parseSourceService.execute(payload.url);
      },
    });

    logger.info('Triggering parse source task', {
      url,
    });

    const parseSourceRun = await tasks.triggerAndWait<typeof ParseSourceTask>(
      'parse-source',
      {
        url: url,
      },
    );

    if (!parseSourceRun.ok) {
      throw new Error('Failed to parse source');
    }

    return parseSourceRun.output;
  }
}
