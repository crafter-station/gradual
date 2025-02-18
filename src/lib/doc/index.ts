import { db } from '@/db';
import * as schema from '@/db/schema';

import type { InsertChunk } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { eq } from 'drizzle-orm';
import { encoding_for_model } from 'tiktoken';
import { CHUNK_SIZE } from '../constants';
import { getEnrichChunkPrompt } from '../prompts/enrich_chunk';
import { getSummarizeDocumentPrompt } from '../prompts/summarize-document';
import { getSummarizeChunkPrompt } from '../prompts/summarize_chunk';

export { PDFDoc } from './pdf';
export { WebPageDoc } from './web';

interface Chunk {
  order: number;

  rawContent: string;
  summary: string | null;

  enrichedContent: string | null;
  enrichedSummary: string | null;
}

type EnrichedChunk = Chunk & {
  enrichedContent: string;
  enrichedSummary: string;
};

export abstract class Doc {
  protected _content: string | null = null;
  protected _tokens: number | null = null;
  protected _uploadedUrl: string | null = null;
  protected _chunks: Chunk[] | null = null;
  protected _summary: string | null = null;
  protected _sourceId: string | null = null;

  constructor(protected input: string | File) {}

  protected abstract parse(): Promise<string>;
  protected abstract storeSource(): Promise<string>;

  async init(): Promise<void> {
    this._content = await this.parse();
    this.generateChunks();
    await this.summarizeChunks();
    await this.generateDocumentSummary();
    await this.enrichChunks();
    await this.enrichDocumentSummary();

    if (!this._chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }

    this._sourceId = await this.storeSource();

    await db.insert(schema.chunks).values(
      this.enrichedChunks.map(
        (chunk) =>
          ({
            sourceId: this.sourceId,
            order: chunk.order,
            rawContent: chunk.rawContent,
            summary: chunk.enrichedSummary,
            enrichedContent: chunk.enrichedContent,
          }) satisfies InsertChunk,
      ),
    );

    await db
      .update(schema.sources)
      .set({
        summary: this.summary,
      })
      .where(eq(schema.sources.id, this.sourceId));
  }

  get sourceId(): string {
    if (!this._sourceId) {
      throw new Error('Source ID not generated. Call storeSource() first.');
    }
    return this._sourceId;
  }

  chunksSummarized(): boolean {
    return this._chunks?.every((chunk) => chunk.summary) ?? false;
  }

  chunksEnriched(): boolean {
    return this._chunks?.every((chunk) => chunk.enrichedContent) ?? false;
  }
  async upload(): Promise<void> {}

  get content(): string {
    if (!this._content) {
      throw new Error('Document not initialized. Call init() first.');
    }
    return this._content;
  }

  get tokens(): number {
    if (!this.content) {
      throw new Error('Document not initialized. Call initialize() first.');
    }
    if (this._tokens === null) {
      const encoding = encoding_for_model('gpt-4o-mini');
      this._tokens = encoding.encode(this.content).length;
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

  generateChunks(): Chunk[] {
    const content = this.content;
    const chunks: string[] = [];

    const recursiveChunk = (text: string) => {
      // Base case - text is small enough to be a chunk
      if (text.length <= CHUNK_SIZE) {
        chunks.push(text);
        return;
      }

      // Find the best split point near the middle
      const splitIndex = Math.floor(text.length / 2);
      let leftEnd = text.lastIndexOf('\n', splitIndex);
      let rightStart = text.indexOf('\n', splitIndex);

      // If no newlines found, fall back to splitting on spaces
      if (leftEnd === -1 && rightStart === -1) {
        leftEnd = text.lastIndexOf(' ', splitIndex);
        rightStart = text.indexOf(' ', splitIndex);
      }

      // If still no good split points, just split in the middle
      if (leftEnd === -1) leftEnd = splitIndex;
      if (rightStart === -1) rightStart = splitIndex;

      // Choose the split point closest to the middle
      const splitPoint =
        Math.abs(splitIndex - leftEnd) < Math.abs(splitIndex - rightStart)
          ? leftEnd
          : rightStart;

      // Recursively process each half
      recursiveChunk(text.slice(0, splitPoint).trim());
      recursiveChunk(text.slice(splitPoint).trim());
    };

    recursiveChunk(content);

    this._chunks = chunks.map((chunk, index) => ({
      order: index,
      rawContent: chunk,
      summary: null,
      enrichedContent: null,
      enrichedSummary: null,
    }));

    return this._chunks;
  }

  async summarizeChunks(): Promise<Chunk[]> {
    const chunks = this._chunks;
    if (!chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }

    const summaries = await Promise.all(
      chunks.map(async (chunk) => {
        const summary = await generateText({
          model: openai('gpt-4o-mini'),
          prompt: getSummarizeChunkPrompt({ chunk: chunk.rawContent }),
        });

        return { ...chunk, summary: summary.text };
      }),
    );
    this._chunks = summaries;
    return summaries;
  }

  async generateDocumentSummary(): Promise<string> {
    const chunks = this._chunks;
    if (!chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }
    if (!this.chunksSummarized()) {
      throw new Error('Chunks not summarized. Call summarizeChunks() first.');
    }

    const documentSummary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeDocumentPrompt({
        document: chunks.map((chunk) => chunk.summary).join('\n'),
      }),
    });

    this._summary = documentSummary.text;
    return documentSummary.text;
  }

  get summary(): string {
    if (!this._summary) {
      throw new Error(
        'Document summary not generated. Call generateDocumentSummary() first.',
      );
    }
    return this._summary;
  }

  get enrichedChunks() {
    if (!this._chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }
    if (!this.chunksEnriched()) {
      throw new Error('Chunks not enriched. Call enrichChunks() first.');
    }
    return this._chunks as EnrichedChunk[];
  }

  async enrichChunks(): Promise<Chunk[]> {
    const chunks = this._chunks;
    if (!chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }
    if (!this.chunksSummarized()) {
      throw new Error('Chunks not summarized. Call summarizeChunks() first.');
    }
    if (!this.summary) {
      throw new Error(
        'Document summary not generated. Call generateDocumentSummary() first.',
      );
    }

    const enrichedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const enrichedChunkContent = await generateText({
          model: openai('gpt-4o-mini'),
          prompt: getEnrichChunkPrompt({
            chunk: chunk.rawContent,
            documentSummary: this.summary,
            precedingChunk:
              chunk.order > 0 ? chunks[chunk.order - 1]?.rawContent : null,
            succeedingChunk:
              chunk.order < chunks.length - 1
                ? chunks[chunk.order + 1]?.rawContent
                : null,
          }),
        });

        const enrichedChunkSummary = await generateText({
          model: openai('gpt-4o-mini'),
          prompt: getSummarizeChunkPrompt({
            chunk: enrichedChunkContent.text,
          }),
        });

        return {
          ...chunk,
          enrichedContent: enrichedChunkContent.text,
          enrichedSummary: enrichedChunkSummary.text,
        };
      }),
    );

    this._chunks = enrichedChunks;
    return enrichedChunks;
  }

  async enrichDocumentSummary(): Promise<string> {
    if (!this._chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }
    if (!this.summary) {
      throw new Error(
        'Document summary not generated. Call generateDocumentSummary() first.',
      );
    }
    if (!this.chunksEnriched()) {
      throw new Error('Chunks not enriched. Call enrichChunks() first.');
    }

    const enrichedDocumentSummary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeDocumentPrompt({
        document: this._chunks.map((chunk) => chunk.enrichedSummary).join('\n'),
      }),
    });

    this._summary = enrichedDocumentSummary.text;
    return enrichedDocumentSummary.text;
  }
}
