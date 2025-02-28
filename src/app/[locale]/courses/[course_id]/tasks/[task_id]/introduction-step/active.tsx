import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
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
      <div className="relative space-y-6">
        {/* Title */}
        <h1 className="text-center font-medium text-2xl text-foreground/90 tracking-tight transition-colors duration-300 group-hover:text-primary">
          {content.title}
        </h1>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert mx-auto max-w-[700px] prose-headings:text-foreground/90 prose-p:text-muted-foreground/90 prose-p:leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          >
            {content.body}
          </ReactMarkdown>
        </div>
      </div>
    </StepCard>
  );
};
