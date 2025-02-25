import type { Embedding } from "./embedding";

export class Source {
  constructor(
    public readonly id: string,
    public readonly type: "FILE" | "URL",
    public readonly filePath: string,
    public readonly creatorId: string,
    public readonly summary: string,
    public readonly embedding: Embedding,
    public readonly chunksCount: number
  ) {}
}
