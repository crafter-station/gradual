import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { CheckCircle2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
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
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !className;
      return !isInline ? (
        <pre className="group relative rounded-lg">
          <div className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg border-b border-l bg-muted/30 px-3 py-1.5 font-mono text-muted-foreground/50 text-xs">
            {match?.[1] || 'code'}
          </div>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className="rounded bg-muted/30 px-1.5 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <StepCard stepType="Tutorial" isDone isCorrect>
      <div className="relative space-y-6">
        {/* Title */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-center font-medium font-mono text-2xl text-foreground/90 tracking-tight transition-colors duration-300 group-hover:text-success">
            {content.title}
          </h1>
          <CheckCircle2Icon className="h-5 w-5 text-success transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert mx-auto max-w-[600px] prose-pre:border prose-pre:bg-muted/50 prose-pre:shadow-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={components}
          >
            {content.body}
          </ReactMarkdown>
        </div>
      </div>
    </StepCard>
  );
};
