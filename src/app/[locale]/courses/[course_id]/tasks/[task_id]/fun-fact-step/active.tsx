import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { Lightbulb } from 'lucide-react';

interface ActiveFunFactStepProps {
  content: StepContent & {
    type: 'FUN_FACT';
  };
}

export const ActiveFunFactStep = ({ content }: ActiveFunFactStepProps) => {
  return (
    <StepCard stepType="Fun Fact">
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Fun Fact Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="-top-12 -left-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl" />
            <div className="-bottom-12 -right-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative rounded-2xl border border-flexoki-yellow/10 bg-background/20 bg-gradient-to-b from-flexoki-yellow/[0.02] to-transparent p-8 backdrop-blur-xs">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="-inset-1 absolute animate-pulse rounded-full bg-flexoki-yellow/20 blur-md" />
                  <div className="relative rounded-full border border-flexoki-yellow/20 bg-flexoki-yellow/5 p-3">
                    <Lightbulb className="h-6 w-6 text-flexoki-yellow" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-6 text-center font-bold font-serif text-xl uppercase tracking-wide [word-spacing:6px]">
                {content.title}
              </h2>

              {/* Body */}
              <p className="text-base leading-relaxed">{content.body}</p>
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
