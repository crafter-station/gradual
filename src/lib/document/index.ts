import { encoding_for_model } from 'tiktoken';

export abstract class Document {
  protected content!: string;
  protected _markdown: string | null = null;
  protected _tokens: number | null = null;
  protected _uploadedUrl: string | null = null;

  constructor(protected input: string | File) {}

  protected abstract parse(): Promise<string>;

  async init(): Promise<void> {
    this.content = await this.parse();
  }

  get markdown(): string {
    if (!this.content) {
      throw new Error('Document not initialized. Call initialize() first.');
    }
    if (!this._markdown) {
      this._markdown = this.convertToMarkdown();
    }
    return this._markdown;
  }

  get tokens(): number {
    if (!this.content) {
      throw new Error('Document not initialized. Call initialize() first.');
    }
    if (this._tokens === null) {
      const encoding = encoding_for_model('gpt-3.5-turbo');
      this._tokens = encoding.encode(this.markdown).length;
    }
    return this._tokens;
  }

  get uploadedUrl(): string {
    if (!this._uploadedUrl) {
      throw new Error('Document not uploaded. Call upload() first.');
    }
    return this._uploadedUrl;
  }

  protected convertToMarkdown(): string {
    // Base implementation
    return this.content;
  }

  async upload(endpoint = '/api/upload'): Promise<string> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: this.markdown }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const { url } = await response.json();
      this._uploadedUrl = url;
      return url;
    } catch (error) {
      throw new Error(
        `Failed to upload: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
