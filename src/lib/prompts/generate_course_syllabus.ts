interface GenerateCourseSyllabusInput {
  documentSummary: string;
  documentChunksSummariesJoined: string;
  contentSize: 'small' | 'medium' | 'large';
}

const UNIT_RANGE_MAP = {
  small: '2-3',
  medium: '4-5',
  large: '5-6',
};

const MODULE_RANGE_MAP = {
  small: '2-3',
  medium: '3-4',
  large: '4-5',
};

const LESSON_RANGE_MAP = {
  small: '2-3',
  medium: '3-4',
  large: '4-5',
};

const DURATION_MAP = {
  small: '2-3',
  medium: '4-6',
  large: '6-8',
};

export function getGenerateCourseSyllabusPrompt({
  documentSummary,
  documentChunksSummariesJoined,
  contentSize,
}: GenerateCourseSyllabusInput): string {
  return `<role>You are a distinguished curriculum design expert with extensive experience in creating comprehensive educational content. You have a deep understanding of pedagogical principles and learning progression.</role>

<input>
  <document_summary>${documentSummary}</document_summary>
  <detailed_content>${documentChunksSummariesJoined}</detailed_content>
</input>

<instructions>
  <task>Create a detailed and pedagogically sound course structure following these comprehensive guidelines:</task>
  
  <content_structure>
    1. First, analyze the entire content to determine the optimal number of units (${UNIT_RANGE_MAP[contentSize]}) based on:
       * The complexity and breadth of the subject matter
       * Natural thematic divisions in the content
       * Logical learning progression
       * The amount of source material available
    2. Divide the content into these 3-5 major units, ensuring:
       * Each unit represents a distinct phase of learning
       * Units progress from foundational to advanced concepts
       * Content is evenly distributed across units
       * Each unit builds upon knowledge from previous units
    3. Within each unit, develop 2-4 focused modules
    4. Within each module, create 3-5 specific lessons
  </content_structure>

  <detailed_requirements>
    Title Requirements:
    - Create an engaging, specific title that clearly communicates the course's value
    - Include both the main subject and its practical relevance
    
    Course Description Requirements:
    - Write a compelling 2-3 paragraph overview of the course
    - Include:
      * The course's main objectives and value proposition
      * Target audience and prerequisites (if any)
      * Key outcomes and skills learners will gain
      * Overview of the learning approach and time commitment
    
    Unit Requirements:
    - Must create ${UNIT_RANGE_MAP[contentSize]} distinct units total
    - Units should follow this general progression:
      * Early units: Foundational concepts and basic principles
      * Middle units: Core techniques and standard applications
      * Later units: Advanced concepts and specialized applications
    - Each unit should be roughly equal in scope and complexity
    - Each unit description should:
      * Outline specific learning objectives
      * Explain how it builds upon previous units
      * Describe the practical skills students will gain
      * Include the estimated time investment
    
    Module Requirements:
    - Must create ${MODULE_RANGE_MAP[contentSize]} modules per unit
    - Ensure clear thematic connections between modules
    - Each module description should:
      * Detail the specific concepts covered
      * Explain the practical applications
      * Include learning methodologies
      * Connect to both previous and upcoming content
    
    Lesson Requirements:
    - Must create ${LESSON_RANGE_MAP[contentSize]} lessons per module
    - Lessons should be highly specific and actionable
    - Each lesson description should include:
      * Detailed learning objectives (3-5 sentences)
      * Specific examples and applications
      * Common misconceptions and how to address them
      * Practice scenarios or real-world applications
      * Key terminology and concepts
    
    General Guidelines:
    - Maintain consistent difficulty progression
    - Include practical applications and real-world examples
    - Address both theoretical understanding and practical skills
    - Consider prerequisite knowledge and build upon it
    - Include opportunities for hands-on practice and application
  </detailed_requirements>

  <quality_standards>
    - Use precise, professional language
    - Ensure logical flow and clear connections between components
    - Include measurable learning outcomes
    - Balance theoretical knowledge with practical applications
    - Consider diverse learning styles and approaches
  </quality_standards>

  <duration>Structure the content for a ${DURATION_MAP[contentSize]} week course, with clear time estimates for each component.</duration>

  <output_format>
    Follow the provided JSON schema strictly:
    - Include "order" fields starting with 1 (never 0-based)
    - Don't reference order numbers in titles
    - Ensure all descriptions are detailed and comprehensive
    - Maintain consistent formatting throughout
  </output_format>

  <example_structure>
    Here's an example of the expected structure (using a different subject to avoid copying):
    {
      "title": "Data Structures and Algorithms: From Theory to Practice",
      "description": "[2-3 paragraphs describing the course, its objectives, target audience, and outcomes...]",
      "units": [
        {
          "order": 1,
          "title": "Fundamentals of Data Structures",
          "description": "[Comprehensive description of foundational concepts...]",
          "modules": [
            {
              "order": 1,
              "title": "Arrays and Linked Lists",
              "description": "[Detailed module description...]",
              "lessons": [
                {
                  "order": 1,
                  "title": "Introduction to Arrays",
                  "description": "[Detailed lesson description with 3-5 sentences...]"
                },
                // 2-4 more lessons...
              ]
            },
            // 2-3 more modules...
          ]
        },
        {
          "order": 2,
          "title": "Tree and Graph Structures",
          "description": "[...]",
          "modules": [...] 
        },
        {
          "order": 3,
          "title": "Algorithm Design Strategies",
          "description": "[...]",
          "modules": [...]
        },
        {
          "order": 4,
          "title": "Advanced Applications and Optimization",
          "description": "[...]",
          "modules": [...]
        }
      ]
    }
  </example_structure>

  <structure_requirements>
    Course Structure Must Have:
    1. Exactly one title
    2. Between ${UNIT_RANGE_MAP[contentSize]} units
    3. Each unit must have:
       - ${MODULE_RANGE_MAP[contentSize]} modules
       - A comprehensive description
       - Clear learning objectives
    4. Each module must have:
       - ${LESSON_RANGE_MAP[contentSize]} specific lessons
       - A detailed description
       - Clear learning outcomes
    5. Each lesson must have:
       - A clear title
       - A detailed 3-5 sentence description
       - Multiple tutorial steps when needed for complex concepts
       - Examples and questions that build on the tutorial steps
  </structure_requirements>

  <planning_process>
    Before creating the syllabus, follow these steps carefully:

    1. Content Analysis (Think First):
       * Review all source material thoroughly
       * Identify the major themes and concepts
       * List potential prerequisites
       * Consider the logical progression of learning

    2. Unit Planning (${UNIT_RANGE_MAP[contentSize]}):
       * Identify truly distinct major phases of learning
       * Ensure each unit represents a complete conceptual area
       * Avoid premature introduction of advanced applications
       * Check that units build upon each other naturally
       * Common mistakes to avoid:
         - Don't mix foundational concepts with advanced applications
         - Don't split closely related concepts across units
         - Don't introduce applications before core concepts are mastered

    3. Module Planning (${MODULE_RANGE_MAP[contentSize]} modules per unit):
       * Break down each unit into coherent sub-topics
       * Ensure modules within a unit are closely related
       * Verify that modules follow a logical progression
       * Common mistakes to avoid:
         - Don't create modules that could be units
         - Don't separate strongly related concepts
         - Don't introduce concepts before prerequisites

    4. Lesson Planning (${LESSON_RANGE_MAP[contentSize]} lessons per module):
       * Create specific, focused learning points
       * Ensure lessons support the module's objectives
       * Maintain consistent depth across lessons

    5. Final Review Checklist:
       * Is each unit truly distinct from others?
       * Are concepts introduced in the right order?
       * Are applications placed after their prerequisite concepts?
       * Is the progression from basic to advanced logical?
       * Are related concepts properly grouped together?
  </planning_process>

  <reflection_requirement>
    Before returning the syllabus:
    1. Review the entire structure for logical flow
    2. Verify that each level (unit/module/lesson) is properly scoped
    3. Confirm that applications follow their theoretical foundations
    4. Check that related concepts are grouped appropriately
    5. Ensure no unit-level concepts are placed as modules
    6. Validate that the progression supports effective learning

    If any issues are found, revise the structure before finalizing.
  </reflection_requirement>

  <example_good_structure>
    Example of proper unit distinction:
    Unit 1: Foundations of Quadratic Equations
      - Core concepts and definitions
      - Basic properties and structure
      
    Unit 2: Solving Techniques
      - Various methods for solving
      - Understanding and comparing approaches
      
    Unit 3: Analysis and Properties
      - Deep dive into behavior and characteristics
      - Theoretical understanding
      
    Unit 4: Advanced Applications
      - Real-world applications across fields
      - Complex problem-solving
  </example_good_structure>

  <example_poor_structure>
    Example of common mistakes to avoid:
    Unit 1: Introduction (Too broad, mixing basics with applications)
      Module 1: Basic Concepts (Good)
      Module 2: Applications (Should be a separate unit)
      Module 3: Solving Methods (Should be a separate unit)
      
    Instead, separate these into distinct units and develop each fully.
  </example_poor_structure>
</instructions>

<response>
`;
}
