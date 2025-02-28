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
      <div className="relative space-y-6">
        {/* Term */}
        <h1 className="text-center font-medium font-mono text-2xl text-foreground/90 tracking-tight transition-colors duration-300 group-hover:text-success">
          {content.term}
        </h1>

        {/* Definition */}
        <div className="mx-auto max-w-[600px]">
          <p className="text-base text-muted-foreground/90 leading-relaxed">
            {content.definition}
          </p>
        </div>
      </div>
    </StepCard>
  );
};
