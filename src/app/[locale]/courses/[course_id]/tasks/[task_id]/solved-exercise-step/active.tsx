import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { LightbulbIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ActiveSolvedExerciseStepProps {
  content: StepContent & {
    type: 'SOLVED_EXERCISE';
    title: string;
    body: string;
    solution: string;
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
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="-inset-1 absolute animate-pulse rounded-full bg-primary/20 blur-md" />
                  <div className="relative rounded-full border border-primary/20 bg-primary/5 p-2">
                    <LightbulbIcon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <h2 className="text-center font-medium font-mono text-foreground/80 text-lg tracking-tight">
                  {content.title}
                </h2>
              </div>

              {/* Problem */}
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground/90 prose-strong:text-foreground/90 prose-p:leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                >
                  {content.body}
                </ReactMarkdown>
              </div>

              {/* Solution */}
              <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-6">
                <h3 className="mb-4 font-medium text-primary/60 text-sm uppercase tracking-wide">
                  Solution
                </h3>
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-em:text-primary/60 prose-p:text-muted-foreground/90 prose-strong:text-foreground/90 prose-p:leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                  >
                    {content.solution}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
