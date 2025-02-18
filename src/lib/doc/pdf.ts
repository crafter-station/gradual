import { db } from '@/db';
import * as schema from '@/db/schema';
import pdfParse from 'pdf-parse';
import { Doc } from '.';
import { getCurrentUser } from '../utils';

export class PDFDoc extends Doc {
  constructor(protected input: File) {
    super(input);
  }

  protected async parse(): Promise<string> {
    if (!(this.input instanceof File)) {
      throw new Error('PDFDocument requires a File input');
    }

    const fileBuffer = Buffer.from(await this.input.arrayBuffer());

    try {
      const data = await pdfParse(fileBuffer);
      if (!data?.text?.trim()) {
        throw new Error('PDF content is empty');
      }
      return data.text;
    } catch (error) {
      throw new Error(
        `Failed to parse PDF: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  protected async storeSource() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Current user not found. Call getCurrentUser() first.');
    }

    const [source] = await db
      .insert(schema.sources)
      .values({
        type: 'FILE',
        filePath: this.input.name,
        creatorId: currentUser.id,
      })
      .returning();

    return source.id;
  }
}
