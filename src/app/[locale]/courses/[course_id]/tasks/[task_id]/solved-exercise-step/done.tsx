import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { CheckCircle2Icon, LightbulbIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface DoneSolvedExerciseStepProps {
  content: StepContent & {
    type: 'SOLVED_EXERCISE';
    title: string;
    body: string;
    solution: string;
  };
}

export const DoneSolvedExerciseStep = ({
  content,
}: DoneSolvedExerciseStepProps) => {
  return (
    <StepCard stepType="Solved Exercise" isDone isCorrect>
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Exercise Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="-top-12 -left-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-green/20 via-flexoki-blue/10 to-transparent blur-2xl" />
            <div className="-bottom-12 -right-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-blue/20 via-flexoki-green/10 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative space-y-6">
              {/* Title */}
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="-inset-1 absolute animate-pulse rounded-full bg-success/20 blur-md" />
                  <div className="relative rounded-full border border-success/20 bg-success/5 p-2">
                    <LightbulbIcon className="h-4 w-4 text-success" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-center font-medium font-mono text-foreground/80 text-lg tracking-tight transition-colors duration-300 group-hover:text-success/90">
                    {content.title}
                  </h2>
                  <CheckCircle2Icon className="h-4 w-4 text-success transition-transform duration-300 group-hover:scale-110" />
                </div>
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
              <div className="rounded-xl border border-success/10 bg-success/[0.02] p-6">
                <h3 className="mb-4 font-medium text-sm text-success/60 uppercase tracking-wide">
                  Solution
                </h3>
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-em:text-success/60 prose-p:text-muted-foreground/90 prose-strong:text-foreground/90 prose-p:leading-relaxed">
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
