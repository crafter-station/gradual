import type { Embedding } from "../domain/embedding";

export interface GenerateSyllabusEmbeddingsResp {
  courseEmbedding: Embedding;
  unitEmbeddings: {
    embedding: Embedding;
    unitOrder: number;
  }[];
  moduleEmbeddings: {
    embedding: Embedding;
    moduleOrder: number;
    unitOrder: number;
  }[];
  lessonEmbeddings: {
    embedding: Embedding;
    lessonOrder: number;
    moduleOrder: number;
    unitOrder: number;
  }[];
}

export class GenerateSyllabusEmbeddingsService {}
