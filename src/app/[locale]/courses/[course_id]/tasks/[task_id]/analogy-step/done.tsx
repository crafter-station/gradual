import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';

interface DoneAnalogyStepProps {
  content: StepContent & {
    type: 'ANALOGY';
  };
}

export const DoneAnalogyStep = ({ content }: DoneAnalogyStepProps) => {
  return (
    <StepCard stepType="Analogy" isDone isCorrect>
      {/* Title */}
      <h1 className="text-center font-bold font-serif text-xl uppercase tracking-wide [word-spacing:6px]">
        {content.title}
      </h1>
      {/* Body */}
      <p className="leading-[1.58rem]">{content.body}</p>
    </StepCard>
  );
};
