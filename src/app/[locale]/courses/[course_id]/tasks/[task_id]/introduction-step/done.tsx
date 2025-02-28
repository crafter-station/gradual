import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { CheckCircle2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface DoneIntroductionStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'INTRODUCTION';
  };
}

export const DoneIntroductionStep = ({
  content,
}: DoneIntroductionStepProps) => {
  return (
    <StepCard stepType="Introduction" isDone isCorrect>
      <div className="relative space-y-6">
        {/* Title */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-center font-medium text-2xl text-foreground/90 tracking-tight transition-colors duration-300 group-hover:text-success">
            {content.title}
          </h1>
          <CheckCircle2Icon className="h-5 w-5 text-success transition-transform duration-300 group-hover:scale-110" />
        </div>

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
