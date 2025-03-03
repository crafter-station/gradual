import { MarkdownComponents } from '@/components/markdown-components';
import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { CheckCircle2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface DoneTutorialStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'TUTORIAL';
  };
}

export const DoneTutorialStep = ({ content }: DoneTutorialStepProps) => {
  return (
    <StepCard stepType="Tutorial" isDone={true}>
      <div className="relative space-y-6">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-center font-bold font-serif text-xl uppercase tracking-wide [word-spacing:6px]">
            {content.title}
          </h1>
          <CheckCircle2Icon className="h-5 w-5 text-success transition-transform duration-300 group-hover:scale-110" />
        </div>

        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={MarkdownComponents}
        >
          {content.body}
        </ReactMarkdown>
      </div>
    </StepCard>
  );
};
