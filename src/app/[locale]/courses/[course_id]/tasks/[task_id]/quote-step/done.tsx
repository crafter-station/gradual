import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { CheckCircle2Icon, QuoteIcon } from 'lucide-react';

interface DoneQuoteStepProps {
  content: StepContent & {
    type: 'QUOTE';
  };
}

export const DoneQuoteStep = ({ content }: DoneQuoteStepProps) => {
  return (
    <StepCard stepType="Quote" isDone isCorrect>
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Quote */}
          <figure className="relative">
            <QuoteIcon
              className="-top-8 -left-8 absolute h-16 w-16 text-success/5"
              aria-hidden="true"
            />
            <blockquote className="relative">
              <p className="text-left font-serif text-3xl text-foreground/90 leading-12 tracking-wide transition-colors duration-300 group-hover:text-success/90 md:text-4xl">
                “{content.body}”
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-end gap-2">
              <div className="font-medium text-base text-muted-foreground">
                — {content.author}
              </div>
              <CheckCircle2Icon className="h-5 w-5 text-success transition-transform duration-300 group-hover:scale-110" />
            </figcaption>
          </figure>
        </div>
      </div>
    </StepCard>
  );
};
