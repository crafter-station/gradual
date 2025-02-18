interface GenerateCourseSyllabusInput {
  documentSummary: string;
  documentChunksSummariesJoined: string;
}

export function getGenerateCourseSyllabusPrompt({
  documentSummary,
  documentChunksSummariesJoined,
}: GenerateCourseSyllabusInput): string {
  return `<role>You are an expert curriculum designer.</role>
<input>
  <document_summary>${documentSummary}</document_summary>
  <detailed_content>${documentChunksSummariesJoined}</detailed_content>
</input>

<instructions>
  <task>Create a comprehensive course structure following these guidelines:</task>
  <guidelines>
    1. Analyze the content and organize it into a logical learning sequence
    2. Break down the material into 3-5 major units
    3. For each unit, create 2-4 focused modules
    4. For each module, list 3-5 specific topics that will be covered
  </guidelines>

  <requirements>
    - The title should be clear, specific, and engaging
    - Unit descriptions should outline the main learning objectives
    - Module descriptions should explain what students will learn
    - Topics should be concrete and actionable learning points
    - Ensure a natural progression of concepts from basic to advanced
    - Keep related concepts grouped together
    - Use clear, professional language
  </requirements>

  <duration>Please structure the content into a course that would take approximately 4-6 weeks to complete.</duration>
</instructions>`;
}
