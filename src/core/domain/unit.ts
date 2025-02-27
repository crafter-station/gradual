import type { Embedding } from './embedding';

export class Unit {
  constructor(
    public readonly id: string,
    public readonly order: number,
    public readonly title: string,
    public readonly description: string,
    public readonly embedding: Embedding,
    public readonly courseId: string,
  ) {}
}
