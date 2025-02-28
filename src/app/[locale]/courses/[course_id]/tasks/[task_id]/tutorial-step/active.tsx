'use client';

import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ActiveTutorialStepProps {
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'TUTORIAL';
  };
}

export const ActiveTutorialStep = ({ content }: ActiveTutorialStepProps) => {
  const status = useFormStatus();
  const components: Components = {
    p({ className, children, ...props }) {
      return (
        <p className={cn('my-4', className)} {...props}>
          {children}
        </p>
      );
    },
    ul({ className, children, ...props }) {
      return (
        <ul className={cn('list-inside list-disc', className)} {...props}>
          {children}
        </ul>
      );
    },
    ol({ className, children, ...props }) {
      return (
        <ol className={cn('list-inside list-decimal', className)} {...props}>
          {children}
        </ol>
      );
    },
    li({ className, children, ...props }) {
      return (
        <li className={cn('my-4', className)} {...props}>
          {children}
        </li>
      );
    },
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
    <StepCard stepType="Tutorial">
      <div className="relative space-y-6">
        {/* Title */}
        <h1 className="text-center font-medium font-mono text-2xl text-foreground/90 tracking-tight transition-colors duration-300 group-hover:text-primary">
          {content.title}
        </h1>

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

      {/* Loading state */}
      {status.pending && (
        <div className="flex items-center justify-center gap-1">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30 [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/30" />
        </div>
      )}
    </StepCard>
  );
};
