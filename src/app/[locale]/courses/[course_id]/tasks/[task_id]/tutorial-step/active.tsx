'use client';

import { MarkdownComponents } from '@/components/markdown-components';
import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface CodeNodePosition {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}

interface CodeNode {
  type: string;
  tagName: string;
  properties: Record<string, unknown>;
  position: CodeNodePosition;
}

interface ActiveTutorialStepProps {
  content: StepContent & {
    type: 'TUTORIAL';
  };
}

export const ActiveTutorialStep = ({ content }: ActiveTutorialStepProps) => {
  return (
    <StepCard stepType="Tutorial">
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          <div className="relative">
            {/* Background decoration */}
            <div className="-top-12 -left-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-blue/20 via-flexoki-purple/10 to-transparent blur-2xl" />
            <div className="-bottom-12 -right-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-purple/20 via-flexoki-blue/10 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative space-y-6">
              {/* Title */}
              <h2 className="text-center font-bold font-serif text-xl uppercase tracking-wide [word-spacing:6px]">
                {content.title}
              </h2>

              {/* Body */}
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={MarkdownComponents}
              >
                {content.body}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
