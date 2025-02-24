import type { Logger } from "@/core/domain/logger";
import type { Scrapper } from "@/core/domain/scrapper";

export class ParseSourceService {
  constructor(private scrapper: Scrapper, private logger: Logger) {}

  async execute(url: string): Promise<string> {
    const scrapeResult = await this.scrapper.scrap(url);

    if (!scrapeResult.success) {
      this.logger.error(`Error scraping ${url}`, {
        scrapeResult,
      });
      throw new Error("Failed to scrape source");
    }

    if (!scrapeResult.markdown) {
      this.logger.error(`No markdown content found for ${url}`, {
        scrapeResult,
      });
      throw new Error("No markdown content found");
    }

    this.logger.info(`Scraped ${url}`, {
      scrapeResult,
    });

    return scrapeResult.markdown;
  }
}
