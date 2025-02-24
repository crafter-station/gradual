import type { Embedding } from "ai";

export class Source {
  constructor(
    private _id: string,
    public readonly type: "FILE" | "URL",
    public readonly filePath: string,
    public readonly creatorId: string,
    public readonly summary: string,
    public readonly embedding: Embedding,
    public readonly chunksCount: number
  ) {}

  get id(): string {
    return this._id;
  }

  changeId(id: string): void {
    this._id = id;
  }
}
