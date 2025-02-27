import type { Embedding } from './embedding';

export class Course {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly creatorId: string,
    public readonly embedding: Embedding,
  ) {}
}
