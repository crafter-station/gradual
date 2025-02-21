interface GenerateSearchParagraphsInput {
  documentSummary: string;
  syllabus: string;
  currentModule: {
    title: string;
    description: string;
  };
  currentUnit: {
    title: string;
    description: string;
  };
  currentTopic: {
    title: string;
    description: string;
  };
}

export function getGenerateSearchParagraphsPrompt({
  documentSummary,
  syllabus,
  currentModule,
  currentUnit,
  currentTopic,
}: GenerateSearchParagraphsInput): string {
  return `<task>
Generate 3-5 distinct search paragraphs that will help retrieve relevant context for creating an educational lesson. Each paragraph should focus on different aspects that could be relevant for teaching about "${currentTopic.title} - ${currentTopic.description}".
</task>

<context>
Document Overview: ${documentSummary}

<syllabus>
${syllabus}
</syllabus>

Current Educational Context:
- Unit: ${currentUnit.title} - ${currentUnit.description}
- Module: ${currentModule.title} - ${currentModule.description}
- Topic: ${currentTopic.title} - ${currentTopic.description}
</context>

<instructions>
1. Generate paragraphs that would match content useful for teaching this topic: ${currentTopic.title} - ${currentTopic.description}
2. Each paragraph should focus on a different aspect or approach to the topic: ${currentTopic.title} - ${currentTopic.description}
3. Include relevant educational terminology and key concepts
4. Keep paragraphs concise (50-75 words each)
5. Make paragraphs specific enough to match relevant content but general enough to capture varied perspectives
6. Consider both factual content and pedagogical approaches
7. Focus on the topic: ${currentTopic.title} - ${currentTopic.description}
</instructions>

<format>
Return only the paragraphs, one per line, without numbering or additional text.
</format>

<reminder>
Only return paragraphs that are relevant to the current topic:
<topic>
${currentTopic.title} - ${currentTopic.description}
</topic>
</reminder>

<response>
`;
}
