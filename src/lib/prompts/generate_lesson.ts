export function getGenerateLessonPrompt({
  lesson,
  chunks,
  syllabus,
  unitTitle,
  moduleTitle,
}: {
  lesson: {
    description: string;
    title: string;
  };
  chunks: string[];
  syllabus: string;
  unitTitle: string;
  moduleTitle: string;
}) {
  return `You are an expert instructional designer. Create a comprehensive lesson plan with multiple steps about "${lesson.title}".

<context>
  <syllabus>
    ${syllabus}
  </syllabus>
  <current-topic>
    <title>
      ${lesson.title}
    </title>
    <description>
      ${lesson.description}
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

Required step count: 15-20 steps total



Guidelines:
- Use markdown formatting in the content
- Make the progression logical and build upon previous knowledge
- Include code examples when relevant
- For questions, provide meaningful explanations
- Stay focused on the specific topic scope
- Avoid covering material from other modules

Each step must follow one of these formats:

INTRODUCTION steps should:
- Start with a story to engage the user
- Use clear explanations with markdown formatting
- Include relevant code snippets or diagrams when needed
- Break down complex topics into digestible parts

DEFINITION steps should:
- Define a new concept
- Use markdown formatting

TUTORIAL steps should:
- Explain the concept in detail or follow up on the previous step
- Use markdown formatting
- Include relevant code snippets or diagrams when needed
- Be longer than the other steps

ANALOGY steps should:
- Explain a concept by comparing it to something else
- Use markdown formatting

SOLVED_EXERCISE steps should:
- Solve a problem step by step
- Use markdown formatting
- Include both the problem and its solution
- Explain the reasoning behind the solution

FUN_FACT steps should:
- Share a fun fact
- Use markdown formatting

QUOTE steps should:
- Share a quote
- Use markdown formatting
- Include the author of the quote
- Examples:
  {
    type: "QUOTE",
    body: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  }
  {
    type: "QUOTE",
    body: "The most difficult things in computer science are 0. parsing, 1. naming things and 2. cache invalidation.",
    author: "Unknown",
  }

QUESTION steps should:
- Test understanding of previously covered concepts
- Have 1 correct alternative
- Have 3-4 distractors
- If thinking in a Yes/No question, use a BINARY step instead
- Include detailed explanations for the correct alternative
- Ensure the correct alternative is clearly superior to the distractors
- Provide a list of distractors with explanations
- Examples:
  {
    type: "QUESTION",
    questionBody: "What is the capital of France?",
    correctAlternative: "Paris",
    correctAlternativeExplanation: "Paris is the capital of France.",
    distractors: [
      {
        alternative: "Rome", 
        explanation: "Rome is the capital of Italy, not France.",
      },
      {
        alternative: "Marseille",
        explanation: "Marseille is the capital of France, not Paris.",
      },
      {
        alternative: "Lyon",
        explanation: "Lyon is the capital of France, not Paris.",
      },
    ],
  }
  {
    type: "QUESTION",
    questionBody: "When was the Declaration of Independence signed?",
    correctAlternative: "1776",
    correctAlternativeExplanation: "The Declaration of Independence was signed in 1776 by the Continental Congress.",
    distractors: [
      {
        alternative: "1775",
        explanation: "1775 is the year the Declaration of Independence was proposed, but not signed.",
      },
      {
        alternative: "1789",
        explanation: "1789 is the year the French Revolution started, not the Declaration of Independence.",
      },
    ],
  }

MULTIPLE_CHOICE steps should:
- Test understanding of previously covered concepts
- Have 2-3 carefully crafted correct alternatives
- Have 3-4 carefully crafted distractors
- Include the explanation for the solution
- Examples:
  {
    type: "MULTIPLE_CHOICE",
    questionBody: "Which of the following are cities in France?",
    correctAlternatives: [
      "Paris",
      "Nantes",
      "Bordeaux",
    ],
    distractors: ["London", "Rome", "Marseille"],
    explanation: "Paris is the capital of France, Nantes is a city in France, and Bordeaux is a city in France.",
  }
  {
    type: "MULTIPLE_CHOICE",
    questionBody: "Which of the following options are true about Python?",
    correctAlternatives: [
      "Python is a dynamically typed language",
      "Python uses indentation for code blocks",
    ],
    distractors: [
      "Python requires semicolons at the end of statements",
      "All variables in Python must be declared before use",
      "Python supports multiple inheritance",
      "Python arrays are immutable by default",
    ],
    explanation: "Python is a dynamically typed language, uses indentation for code blocks, and arrays are mutable by default.",
  }

FILL_IN_THE_BLANK steps should:
- Test understanding of previously covered concepts
- Have 1-2 blanks
- A blank can be a single word or phrase
- Represent the blank with ____ (four underscores)
- Include the explanation for the solution
- Write the full sentence in the body
- Provide the blanks as a list of strings in the blanks property
- Remember to represent the blank with ____ (exactly four underscores)
- Examples:
  {
    type: "FILL_IN_THE_BLANK",
    body: "The capital of ____ is ____.",
    blanks: ["France", "Paris"],
    distractors: ["London","Germany", "Berlin", "Spain", "Italy", "Portugal"],
  }
  {
    type: "FILL_IN_THE_BLANK",
    body: "A quadratic equation has ____ solutions",
    blanks: ["two"],
    distractors: ["one", "three", "four", "many"],
  }

BINARY steps should:
- Test understanding of previously covered concepts
- Have 2 alternatives
- Include the explanation for the solution
- Examples:
  {
    type: "BINARY",
    questionBody: "Is Python a statically typed language?",
    correctAnswer: true,
    explanation: "Python is a dynamically typed language, not a statically typed language.",
  }
  {
    type: "BINARY",
    questionBody: "Is New York City the capital of the United States?",
    correctAnswer: false,
    explanation: "New York City is not the capital of the United States, the capital is Washington D.C.",
  }

Example pattern of steps:
INTRODUCTION
TUTORIAL
FILL_IN_THE_BLANK
BINARY
INTRODUCTION
DEFINITION
BINARY
ANALOGY
TUTORIAL
MULTIPLE_CHOICE
...

Another example pattern of steps:
INTRODUCTION
TUTORIAL
ANALOGY
MULTIPLE_CHOICE
BINARY
INTRODUCTION
TUTORIAL
QUESTION
...

<reminder>
  <lesson-scope>
    Focus only on the current lesson. Do not cover material from other lessons.
    <lesson-title>
      ${lesson.title}
    </lesson-title>
  </lesson-scope>
  <step-count>
    Required step count: 15-20 steps total. 2/3 of the steps should be exercises.
  </step-count>
</reminder>

Generate an array of steps that follows this structure and ensures optimal learning progression while staying strictly within the scope of the current topic.`;
}
