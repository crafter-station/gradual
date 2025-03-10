import type { StepContent } from '@/db/schema/step';
import type { StepProgressState } from '@/db/schema/step-progress/progress-state';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';

interface DoneFillInTheBlankStepProps {
  progressState: StepProgressState & {
    type: 'FILL_IN_THE_BLANK';
  };
  content: StepContent & {
    type: 'FILL_IN_THE_BLANK';
  };
}

export const DoneFillInTheBlankStep = ({
  content,
  progressState,
}: DoneFillInTheBlankStepProps) => {
  // Split the body text into parts using __ as delimiter
  const parts = content.body.split('__');

  // Create an array of all possible answers
  const allAnswers = [...content.blanks, ...content.distractors].sort((a, b) =>
    a.localeCompare(b),
  );

  // Check if all answers are correct
  const isAllCorrect = progressState.filledBlanks.every(
    (answer: string, index: number) => answer === content.blanks[index],
  );

  // Generate unique keys for sentence parts
  const sentenceParts = parts.map((part, index) => ({
    id: `sentence-part-${index}`,
    content: part,
    isLast: index === parts.length - 1,
  }));

  return (
    <div className="relative w-full">
      <div className="group relative w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-background to-background/80 transition-all duration-500 hover:border-border/60 hover:shadow-lg hover:shadow-success/5">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-success/[0.075] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-success/[0.03] to-transparent" />

        {/* Task type indicator */}
        <div className="-translate-x-1/2 absolute top-4 left-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 font-medium text-success text-xs">
            Fill in the Blank
          </span>
        </div>

        <div className="relative px-8 pt-14 pb-12">
          <div className="relative mx-auto max-w-[640px] space-y-8">
            {/* Main content */}
            <div className="space-y-8">
              {/* Result indicator */}
              <div
                className={cn(
                  'rounded-lg border px-4 py-3 transition-all duration-300',
                  isAllCorrect
                    ? 'border-success/20 bg-success/[0.03] group-hover:bg-success/[0.05]'
                    : 'border-destructive/20 bg-destructive/[0.03] group-hover:bg-destructive/[0.05]',
                )}
              >
                <p
                  className={cn(
                    'font-medium text-sm',
                    isAllCorrect ? 'text-success' : 'text-destructive',
                  )}
                >
                  {isAllCorrect
                    ? 'All answers are correct!'
                    : 'Some answers are incorrect'}
                </p>
              </div>

              {/* Sentence with filled blanks */}
              <div className="text-center font-medium text-2xl leading-relaxed">
                {sentenceParts.map((part) => (
                  <span key={part.id} className="whitespace-normal">
                    {part.content}
                    {!part.isLast && (
                      <span
                        className={cn(
                          'relative mx-1 inline-flex min-w-[120px] py-1',
                          'border-b-2 transition-colors duration-300',
                          progressState.filledBlanks[
                            sentenceParts.findIndex((p) => p.id === part.id)
                          ] ===
                            content.blanks[
                              sentenceParts.findIndex((p) => p.id === part.id)
                            ]
                            ? 'border-success/40 text-success'
                            : 'border-destructive/40 text-destructive',
                        )}
                      >
                        <div className="flex w-full items-center justify-center">
                          {
                            progressState.filledBlanks[
                              sentenceParts.findIndex((p) => p.id === part.id)
                            ]
                          }
                        </div>
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* Answer pool */}
              <div className="mx-auto">
                <div
                  className={cn(
                    'flex flex-wrap justify-center gap-2 py-4',
                    'min-h-[60px] transition-all duration-300',
                    'rounded-xl border border-border/40 bg-muted/[0.02]',
                    'group-hover:border-border/60 group-hover:bg-muted/[0.04]',
                  )}
                >
                  {allAnswers.map((answer) => {
                    const isUsed = progressState.filledBlanks.includes(answer);
                    const isCorrect = content.blanks.includes(answer);
                    return (
                      <div
                        key={answer}
                        className={cn(
                          'rounded-2xl px-4 py-2 font-medium text-lg transition-all duration-200',
                          'border',
                          isUsed
                            ? isCorrect
                              ? 'border-success/20 bg-success/[0.03] text-success'
                              : 'border-destructive/20 bg-destructive/[0.03] text-destructive'
                            : 'border-muted/5 bg-muted/10 text-muted-foreground/60',
                        )}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {answer}
                          {isUsed &&
                            (isCorrect ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <XIcon className="h-4 w-4" />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="relative mt-8 opacity-40 transition-opacity duration-300 group-hover:opacity-60">
              <svg
                className="h-6 w-full text-success/30"
                viewBox="0 0 400 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M200 8c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                  fill="currentColor"
                />
                <path
                  d="M200 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                  fill="currentColor"
                />
                <path
                  d="M180 12h-160c-.6 0-1-.4-1-1s.4-1 1-1h160c.6 0 1 .4 1 1s-.4 1-1 1zm200 0h-160c-.6 0-1-.4-1-1s.4-1 1-1h160c.6 0 1 .4 1 1s-.4 1-1 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
