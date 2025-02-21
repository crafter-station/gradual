export function getGenerateLessonPrompt({
  topic,
  chunks,
  syllabus,
  unitTitle,
  moduleTitle,
}: {
  topic: {
    description: string;
    title: string;
  };
  chunks: string[];
  syllabus: string;
  unitTitle: string;
  moduleTitle: string;
}) {
  return `You are an expert instructional designer. Create a comprehensive lesson plan with multiple steps about "${topic.title}".

<context>
  <syllabus>
    ${syllabus}
  </syllabus>
  <current-topic>
    <title>
      ${topic.title}
    </title>
    <description>
      ${topic.description}
    </description>
    <metadata>
      <module-title>
        ${moduleTitle}
      </module-title>
      <unit-title>
        ${unitTitle}
      </unit-title>
    </metadata>
  </current-topic>
  <chunks>
    ${chunks.map((chunk) => `<chunk>${chunk}</chunk>`).join('\n')}
  </chunks>
</context>

Important: Focus only on the current topic. Do not cover material from other modules in the syllabus:

The lesson should follow this progression:
1. Start with tutorial steps that introduce and explain concepts (from basic to advanced)
2. Include examples that demonstrate the concepts
3. Reinforce with questions throughout the lesson
4. Continue alternating between tutorials, examples, and questions

Required step count: 10-15 steps total

Example pattern of steps:
TUTORIAL (introduce foundational concept)
EXAMPLE (demonstrate foundational concept)
QUESTION (test foundational concept)
QUESTION (reinforce foundational concept)
TUTORIAL (introduce intermediate concept)
EXAMPLE (demonstrate intermediate concept)
QUESTION (test intermediate concept)
QUESTION (reinforce intermediate concept)
EXAMPLE (demonstrate advanced application)
QUESTION (test advanced application)
TUTORIAL (deeper concept)
QUESTION (comprehensive application)
... continues

Guidelines:
- Use markdown formatting in the content
- Make the progression logical and build upon previous knowledge
- Include code examples when relevant
- For questions, provide meaningful explanations for each alternative
- Stay focused on the specific topic scope
- Avoid covering material from other modules

Each step must follow one of these formats:

TUTORIAL steps should:
- Start with foundational concepts
- Use clear explanations with markdown formatting
- Include relevant code snippets or diagrams when needed
- Break down complex topics into digestible parts
- Format content as:
  {
    type: "TUTORIAL",
    title: "Clear, concise title",
    body: "Detailed explanation in markdown"
  }

EXAMPLE steps should:
- Demonstrate practical applications
- Show real-world scenarios
- Include both the problem and its solution
- Explain the reasoning behind the solution
- Format content as:
  {
    type: "EXAMPLE",
    body: "Problem description",
    answer: "Detailed solution"
  }

QUESTION steps should:
- Test understanding of previously covered concepts
- Have 3-4 carefully crafted alternatives
- Include detailed explanations for each alternative
- Ensure the correct alternative is clearly superior
- Format content as:
  {
    type: "QUESTION",
    question: "Clear question text",
    alternatives: [
      {
        order: 1,
        content: "Alternative text",
        explanation: "Why this is/isn't correct"
      },
      // ... more alternatives
    ],
    correctAlternativeOrder: number
  }

<reminder>
  <topic-scope>
    Focus only on the current topic. Do not cover material from other modules.
    <topic-title>
      ${topic.title}
    </topic-title>
  </topic-scope>
  <step-count>
    Required step count: 10-15 steps total
  </step-count>
</reminder>

Generate an array of steps that follows this structure and ensures optimal learning progression while staying strictly within the scope of the current topic.`;
}
