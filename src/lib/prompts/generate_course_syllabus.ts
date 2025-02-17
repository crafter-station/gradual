interface GenerateCourseSyllabusInput {
  documentSummary: string;
  documentChunksSummaries: string[];
}

export function getGenerateCourseSyllabusPrompt({
  documentSummary,
  documentChunksSummaries,
}: GenerateCourseSyllabusInput): string {
  return `## Task:
Your task is to generate a course syllabus for the given document. You will be given a document summary and a list of document chunks summaries. Each chunk summary starts with the chunk index. You should return a list of units for the course. Each unit should have a name, a description and the list of chunks that are covered in the unit. Finally, you should also return the name of the course.

## Document Summary:
${documentSummary}

## Document Chunks Summaries:
${documentChunksSummaries.join('\n')}
`;
}
