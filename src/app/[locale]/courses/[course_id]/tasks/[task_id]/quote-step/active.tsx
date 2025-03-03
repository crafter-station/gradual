import { StepCard } from '@/components/step-card';
import type { StepContent } from '@/db/schema/step';

interface ActiveQuoteStepProps {
  content: StepContent & {
    type: 'QUOTE';
  };
}

export const ActiveQuoteStep = ({ content }: ActiveQuoteStepProps) => {
  return (
    <StepCard stepType="Quote">
      <div className="relative flex h-full flex-col items-center space-y-6 pt-4">
        <div className="mx-auto max-w-[700px]">
          {/* Quote */}
          <figure className="relative">
            <blockquote className="relative">
              <p className="relative block font-serif text-[24px] leading-[1.33] md:text-[30px] [&>p]:inline [&>p]:font-medium [&>p]:font-serif [&>p]:leading-[inherit]">
                “{content.body}”
              </p>
            </blockquote>
            <figcaption className="mt-8">
              <div className="mt-[25px] ml-auto flex w-full items-center gap-2 text-base text-muted-foreground md:w-[50%]">
                <div className="hidden h-px flex-grow bg-muted-foreground/30 md:block" />
                {content.author}
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </StepCard>
  );
};
