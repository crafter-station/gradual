import type { Embedding } from "./embedding";

export class Chunk {
  constructor(
    public readonly id: string,
    public readonly sourceId: string,
    public readonly order: number,
    public readonly summary: string,
    public readonly rawContent: string,
    public readonly enrichedContent: string,
    public readonly embedding: Embedding
  ) {}
}
