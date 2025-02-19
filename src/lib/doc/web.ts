import { db } from '@/db';
import * as schema from '@/db/schema';
import FireCrawlApp from '@mendable/firecrawl-js';
import { Doc } from '.';
import { getCurrentUser } from '../utils';

export class WebPageDoc extends Doc {
  private readonly firecrawl: FireCrawlApp;

  constructor(protected input: string) {
    super(input);
    this.firecrawl = new FireCrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
    });
  }

  protected async storeSource(): Promise<string> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Current user not found. Call getCurrentUser() first.');
    }

    const [source] = await db
      .insert(schema.sources)
      .values({
        type: 'URL',
        filePath: this.input,
        creatorId: currentUser.id,
      })
      .returning();

    return source.id;
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
        if (!scrapeResult.html) {
          throw new Error('No markdown or html found in the scraped web page');
        }

        return scrapeResult.html;
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
