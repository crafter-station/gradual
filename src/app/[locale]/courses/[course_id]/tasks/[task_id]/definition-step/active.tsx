import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';

interface ActiveDefinitionStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'DEFINITION';
  };
}

export const ActiveDefinitionStep = ({
  content,
}: ActiveDefinitionStepProps) => {
  return (
    <StepCard stepType="Definition">
      <h1 className="mt-1 text-center font-extrabold font-serif text-flexoki-black/90 text-xl uppercase tracking-wide [word-spacing:6px]">
        {content.term}
      </h1>

      <p className="text-center leading-[1.58rem]">{content.definition}</p>
    </StepCard>
  );
};
