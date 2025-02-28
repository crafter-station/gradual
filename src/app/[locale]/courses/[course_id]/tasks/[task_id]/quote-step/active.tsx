import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';
import { QuoteIcon } from 'lucide-react';

interface ActiveQuoteStepProps {
  content: StepContent & {
    type: 'QUOTE';
    body: string;
    author: string;
  };
}

export const ActiveQuoteStep = ({ content }: ActiveQuoteStepProps) => {
  return (
    <StepCard stepType="Quote">
      <div className="relative space-y-8">
        <div className="mx-auto max-w-[700px]">
          {/* Quote */}
          <figure className="relative">
            <QuoteIcon
              className="-top-8 -left-8 absolute h-16 w-16 text-primary/5"
              aria-hidden="true"
            />
            <blockquote className="relative">
              <p className="text-left font-serif text-3xl text-foreground/90 italic tracking-tight md:text-4xl">
                “{content.body}”
              </p>
            </blockquote>
            <figcaption className="mt-8">
              <div className="text-right font-medium text-base text-muted-foreground">
                — {content.author}
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </StepCard>
  );
};
