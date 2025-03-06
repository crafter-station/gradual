import { MarkdownComponents } from '@/components/markdown-components';
import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ActiveIntroductionStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'INTRODUCTION';
  };
}

export const ActiveIntroductionStep = ({
  content,
}: ActiveIntroductionStepProps) => {
  return (
    <StepCard stepType="Introduction">
      {/* Title */}
      <h1 className="text-center font-bold font-serif text-flexoki-black/90 text-xl uppercase tracking-wide [word-spacing:6px]">
        {content.title}
      </h1>

      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={MarkdownComponents}
      >
        {content.body}
      </ReactMarkdown>
    </StepCard>
  );
};
