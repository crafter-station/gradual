interface SummarizeDocumentInput {
  document: string;
}

export function getSummarizeDocumentPrompt({
  document,
}: SummarizeDocumentInput): string {
  return `## Task:
Your task is to generate a descriptive summary of the document that follows. Your objective is to return a summary that is roughly 10% of the input document size while retaining as many key points as possible. Your response should begin with \`The document contains \`.

## Document:
${document}


## Query:
Reminder: Your task is to generate a descriptive summary of the document that was given. Your objective is to return a summary that is roughly 10% of the input document size while retaining as many key points as possible. Your response should begin with \`The document contains \`.

## Response:`;
}
