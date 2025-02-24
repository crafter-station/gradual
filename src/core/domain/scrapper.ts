import Firecrawl from "@mendable/firecrawl-js";

export class Scrapper {
  private client: Firecrawl;

  constructor(apiKey: string) {
    this.client = new Firecrawl({
      apiKey: apiKey,
    });
  }

  async scrap(url: string): Promise<{ success: boolean; markdown: string }> {
    const scrapeResult = await this.client.scrapeUrl(url, {
      formats: ["markdown"],
    });

    return {
      success: scrapeResult.success,
      markdown: scrapeResult.data.markdown,
    };
  }
}
