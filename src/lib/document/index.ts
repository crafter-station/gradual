import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { encoding_for_model } from 'tiktoken';
import { z } from 'zod';
import { CHUNK_SIZE } from '../constants';
import { getEnrichChunkPrompt } from '../prompts/enrich_chunk';
import { getGenerateCourseSyllabusPrompt } from '../prompts/generate_course_syllabus';
import { getSummarizeDocumentPrompt } from '../prompts/summarize-document';
import { getSummarizeChunkPrompt } from '../prompts/summarize_chunk';

interface Chunk {
  index: number;

  content: string;
  summary: string | null;

  enrichedContent: string | null;
  enrichedSummary: string | null;
}

export abstract class Document {
  protected _content: string | null = null;
  protected _tokens: number | null = null;
  protected _uploadedUrl: string | null = null;
  protected _chunks: Chunk[] | null = null;
  protected _summary: string | null = null;

  constructor(protected input: string | File) {}

  protected abstract parse(): Promise<string>;

  async init(): Promise<void> {
    this._content = await this.parse();
  }

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
      index,
      content: chunk,
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
          prompt: getSummarizeChunkPrompt({ chunk: chunk.content }),
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
    if (!chunks.every((chunk) => chunk.summary)) {
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

  async enrichChunks(): Promise<Chunk[]> {
    const chunks = this._chunks;
    if (!chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }

    const enrichedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const enrichedChunkContent = await generateText({
          model: openai('gpt-4o-mini'),
          prompt: getEnrichChunkPrompt({
            chunk: chunk.content,
            documentSummary: this.summary,
            precedingChunk:
              chunk.index > 0 ? chunks[chunk.index - 1]?.content : null,
            succeedingChunk:
              chunk.index < chunks.length - 1
                ? chunks[chunk.index + 1]?.content
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

    if (!this._chunks.every((chunk) => chunk.enrichedSummary)) {
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

  async generateCourseSyllabus() {
    const chunks = this._chunks;
    if (!chunks) {
      throw new Error('Chunks not generated. Call generateChunks() first.');
    }

    const courseSyllabus = await generateObject({
      model: openai('gpt-4o-mini'),
      prompt: getGenerateCourseSyllabusPrompt({
        documentSummary: this.summary,
        documentChunksSummaries: chunks
          .map((chunk) => chunk.enrichedSummary)
          .filter((summary): summary is string => summary !== null),
      }),
      schema: z.object({
        name: z.string(),
        units: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            chunks: z.array(z.number()),
          }),
        ),
      }),
    });

    console.log(courseSyllabus.object);
  }
}
