import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { CheckCircle2Icon, Lightbulb } from 'lucide-react';

interface DoneFunFactStepProps {
  content: StepContent & {
    type: 'FUN_FACT';
  };
}

export const DoneFunFactStep = ({ content }: DoneFunFactStepProps) => {
  return (
    <StepCard stepType="Fun Fact" isDone isCorrect>
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Fun Fact Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="-top-12 -left-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-green/20 via-flexoki-blue/10 to-transparent blur-2xl" />
            <div className="-bottom-12 -right-12 absolute h-24 w-24 rounded-full bg-gradient-to-br from-flexoki-purple/20 via-flexoki-green/10 to-transparent blur-2xl" />

            {/* Content */}
            <div className="relative rounded-2xl border border-flexoki-green/10 bg-gradient-to-b from-flexoki-green/[0.02] to-transparent p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="-inset-1 absolute animate-pulse rounded-full bg-flexoki-green/20 blur-md" />
                  <div className="relative rounded-full border border-flexoki-green/20 bg-flexoki-green/5 p-3">
                    <Lightbulb className="h-6 w-6 text-flexoki-green" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4 flex items-center justify-center gap-2">
                <h2 className="text-center font-medium font-mono text-foreground/80 text-lg tracking-tight transition-colors duration-300 group-hover:text-success/90">
                  {content.title}
                </h2>
                <CheckCircle2Icon className="h-5 w-5 text-success transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Body */}
              <p className="text-base text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/80">
                {content.body}
              </p>

              {/* Decorative elements */}
              <div className="-translate-y-1/2 absolute top-1/2 left-6 h-24 w-[1px] bg-gradient-to-b from-transparent via-flexoki-green/10 to-transparent" />
              <div className="-translate-y-1/2 absolute top-1/2 right-6 h-24 w-[1px] bg-gradient-to-b from-transparent via-flexoki-green/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
};
