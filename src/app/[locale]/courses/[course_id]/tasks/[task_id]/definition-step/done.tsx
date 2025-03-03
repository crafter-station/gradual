import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';

interface DoneDefinitionStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'DEFINITION';
  };
}

export const DoneDefinitionStep = ({ content }: DoneDefinitionStepProps) => {
  return (
    <StepCard stepType="Definition" isDone isCorrect>
      <h1 className="mt-1 text-center font-extrabold font-serif text-flexoki-black/90 text-xl uppercase tracking-wide [word-spacing:6px]">
        {content.term}
      </h1>

      <p className="text-center leading-[1.58rem]">{content.definition}</p>
    </StepCard>
  );
};
