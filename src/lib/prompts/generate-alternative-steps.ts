import type { QuestionStepContent, Step } from '@/core/domain/step';

export const generateAlternativesWithRatingPromptForQuestionStep = (
  hasAnsweredOk: boolean,
  answeredSeconds: number,
  step: Step,
): string => {
  const { questionBody, correctAlternative, correctAlternativeExplanation } =
    step.content as QuestionStepContent;

  return `<role>
You are an expert in educational assessment and question design with extensive experience in generating alternative question steps to enhance learning outcomes. You understand pedagogical strategies and common student misconceptions.
</role>

<input>
  <original_step>
    <questionBody>${questionBody}</questionBody>
    <correctAlternative>${correctAlternative}</correctAlternative>
    <correctAlternativeExplanation>${correctAlternativeExplanation}</correctAlternativeExplanation>
  </original_step>
  <response_context>
    <has_answered_correctly>${hasAnsweredOk}</has_answered_correctly>
    <answered_seconds>${answeredSeconds}</answered_seconds>
  </response_context>
</input>

<instructions>
  <task>
    Generate new alternative question steps based on the original step provided. If the response was correct, create alternatives that deepen the challenge and expand on the concept. If the response was incorrect, propose alternatives that address common misconceptions and offer remedial insights.
  </task>

  <requirements>
    - Include a "rating" that evaluates the original step in terms of answer correctness and the time taken to answer. The rating must be one of the following values: 'hard', 'again', 'good', or 'easy'.
    - Generate a list of alternative question steps. Each alternative must include:
      * "questionBody": A potentially rephrased or extended version of the original question.
      * "correctAlternative": The correct answer for the alternative question.
      * "correctAlternativeExplanation": An explanation that details why this answer is correct.
      * "distractors": An array of 2-4 items, each containing:
         - "alternative": A plausible but incorrect option.
         - "explanation": A brief explanation of why this option is incorrect.
    - Ensure that the alternatives are clear, pedagogically sound, and logically consistent.
  </requirements>

  <guidelines>
    1. If the answer was correct, propose alternatives that further challenge the student and encourage deeper understanding.
    2. If the answer was incorrect, propose alternatives that help clarify misconceptions and reinforce the correct reasoning.
    3. The rating should incorporate both the correctness of the response and the response time, offering constructive feedback.
  </guidelines>

  <output_format>
    Strictly follow this JSON schema:
    {
      "rating": string,
      "contents": [
        {
          "type": "QUESTION_STEP_TYPE",
          "questionBody": string,
          "correctAlternative": string,
          "correctAlternativeExplanation": string,
          "distractors": [
            {
              "alternative": string,
              "explanation": string
            }
          ]
        }
      ]
    }
  </output_format>
</instructions>

<response>
`;
};
