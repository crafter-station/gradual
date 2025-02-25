import Firecrawl from '@mendable/firecrawl-js';
import { logger } from '@trigger.dev/sdk/v3';

export class Scrapper {
  private client: Firecrawl;

  constructor(apiKey: string) {
    this.client = new Firecrawl({
      apiKey: apiKey,
    });
  }

  async scrap(url: string): Promise<{ success: boolean; markdown: string }> {
    logger.info('Scraping URL', { url });
    const scrapeResult = await this.client.scrapeUrl(url, {
      formats: ['markdown'],
      timeout: 100000,
    });

    logger.info('Scrape result', {
      success: scrapeResult.success,
      markdown: scrapeResult.data?.markdown,
    });

    return {
      success: scrapeResult.success,
      markdown: scrapeResult.data.markdown,
    };
  }
}
