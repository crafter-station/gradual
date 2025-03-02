import type { Embedding } from './embedding';

export class Section {
  constructor(
    public readonly id: string,
    public readonly order: number,
    public readonly title: string,
    public readonly description: string,
    public readonly embedding: Embedding,
    public readonly unitId: string,
    public readonly taskCount: number,
  ) {}
}
