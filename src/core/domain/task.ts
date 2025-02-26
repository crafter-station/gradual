import type { Section } from './section';
import type { Unit } from './unit';

export class Task {
  constructor(
    public readonly id: string,
    public readonly type: 'LESSON' | 'QUIZ' | 'MULTISTEP',
    public readonly title: string,
    public readonly description: string,
    public readonly embedding: number[],
    public readonly order: number,
    public readonly stepsCount: number,
    public readonly sectionId: string,
  ) {}

  unitOrder(sections: Section[], units: Unit[]): number {
    const section = sections.find((s) => s.id === this.sectionId);
    const unit = units.find((u) => u.id === section?.unitId);
    return unit?.order ?? 0;
  }

  unitId(sections: Section[], units: Unit[]): string {
    const section = sections.find((s) => s.id === this.sectionId);
    const unit = units.find((u) => u.id === section?.unitId);
    return unit?.id ?? '';
  }

  sectionOrder(sections: Section[]): number {
    const section = sections.find((s) => s.id === this.sectionId);
    return section?.order ?? 0;
  }
}
