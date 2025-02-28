import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { StarIcon } from 'lucide-react';

interface ActiveAnalogyStepProps {
  content: StepContent & {
    type: 'ANALOGY';
  };
}

export const ActiveAnalogyStep = ({ content }: ActiveAnalogyStepProps) => {
  return (
    <StepCard stepType="Analogy">
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Analogy Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="-top-12 -left-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl" />
            <div className="-bottom-12 -right-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-blue/20 via-flexoki-purple/10 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative rounded-2xl border border-flexoki-yellow/10 bg-gradient-to-b from-flexoki-yellow/[0.02] to-transparent p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="-inset-1 absolute animate-pulse rounded-full bg-flexoki-yellow/20 blur-md" />
                  <div className="relative rounded-full border border-flexoki-yellow/20 bg-flexoki-yellow/5 p-3">
                    <StarIcon className="h-6 w-6 text-flexoki-orange" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-4 text-center font-medium font-mono text-foreground/80 text-lg tracking-tight">
                {content.title}
              </h2>

              {/* Body */}
              <p className="text-base text-muted-foreground leading-relaxed">
                {content.body}
              </p>

              {/* Decorative elements */}
              <div className="-translate-y-1/2 absolute top-1/2 left-6 h-24 w-[1px] bg-gradient-to-b from-transparent via-flexoki-yellow/10 to-transparent" />
              <div className="-translate-y-1/2 absolute top-1/2 right-6 h-24 w-[1px] bg-gradient-to-b from-transparent via-flexoki-yellow/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
