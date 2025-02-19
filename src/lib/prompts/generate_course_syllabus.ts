interface GenerateCourseSyllabusInput {
  documentSummary: string;
  documentChunksSummariesJoined: string;
}

export function getGenerateCourseSyllabusPrompt({
  documentSummary,
  documentChunksSummariesJoined,
}: GenerateCourseSyllabusInput): string {
  return `<role>You are a distinguished curriculum design expert with extensive experience in creating comprehensive educational content. You have a deep understanding of pedagogical principles and learning progression.</role>

<input>
  <document_summary>${documentSummary}</document_summary>
  <detailed_content>${documentChunksSummariesJoined}</detailed_content>
</input>

<instructions>
  <task>Create a detailed and pedagogically sound course structure following these comprehensive guidelines:</task>
  
  <content_structure>
    1. First, analyze the entire content to determine the optimal number of units (3-5) based on:
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
    4. Within each module, create 3-5 specific topics
  </content_structure>

  <detailed_requirements>
    Title Requirements:
    - Create an engaging, specific title that clearly communicates the course's value
    - Include both the main subject and its practical relevance
    
    Unit Requirements:
    - Must create 3-5 distinct units total
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
    - Ensure clear thematic connections between modules
    - Each module description should:
      * Detail the specific concepts covered
      * Explain the practical applications
      * Include learning methodologies
      * Connect to both previous and upcoming content
    
    Topic Requirements:
    - Topics should be highly specific and actionable
    - Each topic description should include:
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

  <duration>Structure the content for a 4-6 week course, with clear time estimates for each component.</duration>

  <output_format>
    Follow the provided JSON schema strictly:
    - Include "order" fields but don't reference them in titles
    - Ensure all descriptions are detailed and comprehensive
    - Maintain consistent formatting throughout
  </output_format>

  <example_structure>
    Here's an example of the expected structure (using a different subject to avoid copying):
    {
      "title": "Data Structures and Algorithms: From Theory to Practice",
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
              "topics": [
                {
                  "order": 1,
                  "title": "Introduction to Arrays",
                  "description": "[Detailed topic description with 3-5 sentences...]"
                },
                // 2-4 more topics...
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
    2. Between 3-5 units (typically 4)
    3. Each unit must have:
       - 3-5 modules
       - A comprehensive description
       - Clear learning objectives
    4. Each module must have:
       - 3-5 specific topics
       - A detailed description
       - Clear learning outcomes
    5. Each topic must have:
       - A clear title
       - A detailed 3-5 sentence description
  </structure_requirements>

  <planning_process>
    Before creating the syllabus, follow these steps carefully:

    1. Content Analysis (Think First):
       * Review all source material thoroughly
       * Identify the major themes and concepts
       * List potential prerequisites
       * Consider the logical progression of learning

    2. Unit Planning (3-5 units):
       * Identify truly distinct major phases of learning
       * Ensure each unit represents a complete conceptual area
       * Avoid premature introduction of advanced applications
       * Check that units build upon each other naturally
       * Common mistakes to avoid:
         - Don't mix foundational concepts with advanced applications
         - Don't split closely related concepts across units
         - Don't introduce applications before core concepts are mastered

    3. Module Planning (3-5 modules per unit):
       * Break down each unit into coherent sub-topics
       * Ensure modules within a unit are closely related
       * Verify that modules follow a logical progression
       * Common mistakes to avoid:
         - Don't create modules that could be units
         - Don't separate strongly related concepts
         - Don't introduce concepts before prerequisites

    4. Topic Planning (3-5 topics per module):
       * Create specific, focused learning points
       * Ensure topics support the module's objectives
       * Maintain consistent depth across topics

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
    2. Verify that each level (unit/module/topic) is properly scoped
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
