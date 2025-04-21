import { MarkdownComponents } from '@/components/markdown-components';
import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ActiveSolvedExerciseStepProps {
  content: StepContent & {
    type: 'SOLVED_EXERCISE';
  };
}

export const ActiveSolvedExerciseStep = ({
  content,
}: ActiveSolvedExerciseStepProps) => {
  return (
    <StepCard stepType="Solved Exercise">
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Exercise Card */}
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

              {/* Problem */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={MarkdownComponents}
              >
                {content.body}
              </ReactMarkdown>

              {/* Solution */}
              <div className="space-y-4 border border-primary/10 bg-primary/[0.02] p-6">
                <h3 className="font-bold text-flexoki-blue tracking-wide">
                  Solution
                </h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={MarkdownComponents}
                >
                  {content.solution}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
