interface SummarizeDocumentInput {
  document: string;
}

export function getSummarizeDocumentPrompt({
  document,
}: SummarizeDocumentInput): string {
  return `<task>
Generate a descriptive summary of the document that follows. Return a summary that is roughly 10% of the input document size while retaining as many key points as possible. Your response should begin with "The document contains".
</task>

<document>
${document}
</document>

<instructions>
Your response must:
1. Begin with "The document contains"
2. Be approximately 10% of the input length
3. Retain key points and main ideas
</instructions>

<response>
`;
}
