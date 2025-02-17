import FireCrawlApp from '@mendable/firecrawl-js';
import { Document } from '.';

export class WebPageDocument extends Document {
  private firecrawl: FireCrawlApp;

  constructor(url: string) {
    super(url);
    this.firecrawl = new FireCrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  }

  protected async parse(): Promise<string> {
    if (typeof this.input !== 'string') {
      throw new Error('WebPageDocument requires a URL string input');
    }

    try {
      const scrapeResult = await this.firecrawl.scrapeUrl(this.input, {
        formats: ['markdown'],
      });

      if (!scrapeResult.success) {
        throw new Error('Failed to scrape web page');
      }

      if (!scrapeResult.markdown) {
        throw new Error('No markdown found in the scraped web page');
      }

      return scrapeResult.markdown;
    } catch (error) {
      throw new Error(
        `Failed to parse web page: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  // Override since we already get markdown from the scraper
  protected convertToMarkdown(): string {
    return this.content;
  }
}
