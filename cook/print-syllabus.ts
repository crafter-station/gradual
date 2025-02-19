import { type Syllabus, formatSyllabus } from '@/lib/utils';

const syllabus = (await Bun.file('cook/syllabus.json').json()) as Syllabus;

console.log(formatSyllabus(syllabus));
