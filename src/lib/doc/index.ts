import { db } from '@/db';
import * as schema from '@/db/schema';

import type { InsertChunk } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { embedMany, generateText } from 'ai';
import { eq } from 'drizzle-orm';
import { encoding_for_model } from 'tiktoken';
import {
  AI_GENERATION_BATCH_SIZE,
  AI_GENERATION_DELAY,
  CHUNK_SIZE,
} from '../constants';
import { getEnrichChunkPrompt } from '../prompts/enrich_chunk';
import { getSummarizeDocumentPrompt } from '../prompts/summarize-document';
import { getSummarizeChunkPrompt } from '../prompts/summarize_chunk';

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
    console.log('Content parsed');
    this.generateChunks();
    console.log('Chunks generated: ', this.chunks.length);
    await this.summarizeChunks();
    console.log('Chunks summarized');
    await this.generateDocumentSummary();
    console.log('Document summary generated');
    await this.enrichChunks();
    console.log('Chunks enriched');
    await this.enrichDocumentSummary();
    console.log('Document summary enriched');
    if (!this._chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }

    this._sourceId = await this.storeSource();
    console.log('Source stored');
    const embeddingsResult = await embedMany({
      model: openai.embedding('text-embedding-3-large', { dimensions: 1536 }),
      values: this.enrichedChunks.map((chunk) => chunk.enrichedContent),
    });
    console.log('Embeddings generated');
    await db.insert(schema.chunks).values(
      this.enrichedChunks.map(
        (chunk) =>
          ({
            sourceId: this.sourceId,
            order: chunk.order,
            rawContent: chunk.rawContent,
            summary: chunk.enrichedSummary,
            enrichedContent: chunk.enrichedContent,
            embedding: embeddingsResult.embeddings[chunk.order],
          }) satisfies InsertChunk,
      ),
    );
    console.log('Chunks inserted');
    await db
      .update(schema.sources)
      .set({
        summary: this.summary,
      })
      .where(eq(schema.sources.id, this.sourceId));
    console.log('Source updated');
  }

  get sourceId(): string {
    if (!this._sourceId) {
      throw new Error('Source ID not generated. Call storeSource() first.');
    }
    return this._sourceId;
  }

  chunksSummarized(): boolean {
    return this.chunks.every((chunk) => chunk.summary);
  }

  chunksEnriched(): boolean {
    return this.chunks.every((chunk) => chunk.enrichedContent);
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

  async _summarizeChunk(chunk: Chunk): Promise<Chunk> {
    try {
      const summary = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: getSummarizeChunkPrompt({ chunk: chunk.rawContent }),
      });
      return { ...chunk, summary: summary.text };
    } catch (error) {
      console.error(`Error summarizing chunk ${chunk.order}:`, error);
      return { ...chunk, summary: null };
    }
  }

  async summarizeChunks(): Promise<Chunk[]> {
    const results: Chunk[] = [];

    for (let i = 0; i < this.chunks.length; i += AI_GENERATION_BATCH_SIZE) {
      const batch = this.chunks.slice(i, i + AI_GENERATION_BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(this._summarizeChunk));
      results.push(...batchResults);

      // Add a small delay between batches to avoid rate limits
      if (i + AI_GENERATION_BATCH_SIZE < this.chunks.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, AI_GENERATION_DELAY),
        );
      }
    }

    // retry the chunks that were not successfully summarized
    const failedChunks = results.filter((chunk) => !chunk.summary);
    if (failedChunks.length > 0) {
      console.log(`Retrying ${failedChunks.length} chunks`);
      const failedChunksResults = await Promise.all(
        failedChunks.map(this._summarizeChunk),
      );
      results.push(...failedChunksResults);
    }

    this._chunks = results;
    return results;
  }

  async generateDocumentSummary(): Promise<string> {
    if (!this.chunksSummarized()) {
      throw new Error('Chunks not summarized. Call summarizeChunks() first.');
    }

    const documentSummary = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: getSummarizeDocumentPrompt({
        document: this.chunks.map((chunk) => chunk.summary).join('\n'),
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

  get chunks() {
    if (!this._chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }
    return this._chunks;
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

  async _enrichChunk(chunk: Chunk): Promise<Chunk> {
    try {
      const enrichedChunkContent = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: getEnrichChunkPrompt({
          chunk: chunk.rawContent,
          documentSummary: this.summary,
          precedingChunk:
            chunk.order > 0 ? this.chunks[chunk.order - 1]?.rawContent : null,
          succeedingChunk:
            chunk.order < this.chunks.length - 1
              ? this.chunks[chunk.order + 1]?.rawContent
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
    } catch (error) {
      console.error(`Error enriching chunk ${chunk.order}:`, error);
      return { ...chunk, enrichedContent: null, enrichedSummary: null };
    }
  }

  async enrichChunks(): Promise<Chunk[]> {
    if (!this.chunksSummarized()) {
      throw new Error('Chunks not summarized. Call summarizeChunks() first.');
    }
    if (!this.summary) {
      throw new Error(
        'Document summary not generated. Call generateDocumentSummary() first.',
      );
    }

    const results: Chunk[] = [];
    const BATCH_SIZE = Math.floor(AI_GENERATION_BATCH_SIZE / 3);
    const DELAY = AI_GENERATION_DELAY * 2;

    for (let i = 0; i < this.chunks.length; i += BATCH_SIZE) {
      const batch = this.chunks.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((chunk) => this._enrichChunk(chunk)),
      );
      results.push(...batchResults);

      // Add a small delay between batches to avoid rate limits
      if (i + BATCH_SIZE < this.chunks.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY));
      }
    }

    // retry the chunks that failed enrichment
    const failedChunks = results.filter(
      (chunk) => !chunk.enrichedContent || !chunk.enrichedSummary,
    );
    if (failedChunks.length > 0) {
      console.log(`Retrying ${failedChunks.length} chunks`);
      const failedChunksResults = await Promise.all(
        failedChunks.map((chunk) => this._enrichChunk(chunk)),
      );
      results.push(...failedChunksResults);
    }

    this._chunks = results;
    return results;
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
