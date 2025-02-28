import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { StepContent } from '@/db/schema/step';
import type { StepProgressState } from '@/db/schema/step/progress-state';
import { cn } from '@/lib/utils';
import { CheckIcon, XIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const shapes = [
  {
    name: 'triangle',
    color: 'var(--color-flexoki-red)',
    successColor: 'var(--color-flexoki-green)',
    errorColor: 'var(--color-flexoki-red)',
    bgClass: 'bg-flexoki-red',
    textClass: 'text-flexoki-red',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Triangle shape"
      >
        <title>Triangle</title>
        <path d="M12 2L2 22h20L12 2z" />
      </svg>
    ),
  },
  {
    name: 'diamond',
    color: 'var(--color-flexoki-blue)',
    successColor: 'var(--color-flexoki-green)',
    errorColor: 'var(--color-flexoki-red)',
    bgClass: 'bg-flexoki-blue',
    textClass: 'text-flexoki-blue',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Diamond shape"
      >
        <title>Diamond</title>
        <rect
          x="12"
          y="2"
          width="14"
          height="14"
          transform="rotate(45 12 12)"
        />
      </svg>
    ),
  },
  {
    name: 'circle',
    color: 'var(--color-flexoki-yellow)',
    successColor: 'var(--color-flexoki-green)',
    errorColor: 'var(--color-flexoki-red)',
    bgClass: 'bg-flexoki-yellow',
    textClass: 'text-flexoki-yellow',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Circle shape"
      >
        <title>Circle</title>
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    name: 'square',
    color: 'var(--color-flexoki-green)',
    successColor: 'var(--color-flexoki-green)',
    errorColor: 'var(--color-flexoki-red)',
    bgClass: 'bg-flexoki-green',
    textClass: 'text-flexoki-green',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        aria-label="Square shape"
      >
        <title>Square</title>
        <rect x="2" y="2" width="20" height="20" />
      </svg>
    ),
  },
];

interface DoneQuestionStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  progressState: StepProgressState & {
    type: 'QUESTION';
  };
  content: StepContent & {
    type: 'QUESTION';
  };
}

export const DoneQuestionStep = ({
  id,
  stepOrder,
  totalSteps,
  progressState,
  content,
}: DoneQuestionStepProps) => {
  const alternatives = [
    {
      alternative: content.correctAlternative,
      explanation: content.correctAlternativeExplanation,
    },
    ...content.distractors,
  ].sort(() => Math.random() - 0.5);

  const isCorrect =
    progressState.selectedAlternative === content.correctAlternative;

  const explanation = alternatives.find(
    ({ alternative }) => alternative === progressState.selectedAlternative,
  )?.explanation;

  return (
    <div className="relative w-full">
      <div className="group relative w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-background to-background/80 transition-all duration-500 hover:border-border/60 hover:shadow-lg hover:shadow-success/5">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-success/[0.075] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-success/[0.03] to-transparent" />

        {/* Task type indicator */}
        <div className="-translate-x-1/2 absolute top-4 left-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/5 px-2.5 py-0.5 font-medium text-success/70 text-xs">
            Question
          </span>
        </div>

        <div className="relative px-8 pt-14 pb-12">
          <div className="relative space-y-10">
            {/* Question body */}
            <div className="mx-auto max-w-[700px] text-center">
              <h1 className="font-medium text-2xl text-foreground/90 tracking-tight md:text-3xl">
                {content.questionBody}
              </h1>
            </div>

            {/* Result indicator */}
            <div className="mx-auto w-full max-w-[700px]">
              <div
                className={cn(
                  'rounded-lg border px-4 py-3 transition-all duration-300',
                  isCorrect
                    ? 'border-flexoki-green/10 bg-flexoki-green/[0.02] group-hover:bg-flexoki-green/[0.03]'
                    : 'border-flexoki-red/10 bg-flexoki-red/[0.02] group-hover:bg-flexoki-red/[0.03]',
                )}
              >
                <p
                  className={cn(
                    'font-medium text-sm',
                    isCorrect ? 'text-flexoki-green/70' : 'text-flexoki-red/70',
                  )}
                >
                  {isCorrect ? 'Correct answer' : 'Incorrect answer'}
                </p>
              </div>
            </div>

            {/* Alternatives */}
            <RadioGroup
              className="mx-auto w-full max-w-[700px]"
              name="selectedAlternativeOrder"
              defaultValue={progressState.selectedAlternative}
              disabled={true}
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                {alternatives.map(({ alternative }, index) => {
                  const shape = shapes[index % shapes.length];
                  const isSelected =
                    progressState.selectedAlternative === alternative;
                  const isCorrectAnswer =
                    alternative === content.correctAlternative;
                  const stateColor = isSelected
                    ? isCorrectAnswer
                      ? shape.successColor
                      : shape.errorColor
                    : shape.color;

                  return (
                    <div
                      key={alternative}
                      className={cn(
                        'group/option relative transition-all duration-300',
                        isSelected && 'ring-2',
                        isSelected &&
                          (isCorrectAnswer
                            ? 'bg-flexoki-green/[0.02] ring-flexoki-green'
                            : 'bg-flexoki-red/[0.02] ring-flexoki-red'),
                      )}
                      style={
                        {
                          '--shape-color': stateColor,
                          color: stateColor,
                        } as React.CSSProperties
                      }
                    >
                      {/* Content */}
                      <div className="relative flex h-full items-center gap-3 rounded-lg border border-current/10 p-4 transition-all duration-300 hover:bg-current/[0.02] group-data-[state=checked]/option:bg-current/[0.03]">
                        <div className="shrink-0 opacity-40 group-data-[state=checked]/option:opacity-80">
                          {shape.icon}
                        </div>
                        <RadioGroupItem
                          value={alternative}
                          id={`question-${id}-answer-${index}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`question-${id}-answer-${index}`}
                          className="grow cursor-pointer font-medium text-base"
                        >
                          {alternative}
                        </Label>
                        {isSelected && (
                          <div className="ml-2 shrink-0">
                            {isCorrectAnswer ? (
                              <CheckIcon className="h-4 w-4 text-flexoki-green/70" />
                            ) : (
                              <XIcon className="h-4 w-4 text-flexoki-red/70" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Explanation */}
            {explanation && (
              <div
                className={cn(
                  'mx-auto w-full max-w-[700px] rounded-lg border p-4 transition-all duration-300',
                  isCorrect
                    ? 'border-flexoki-green/10 bg-flexoki-green/[0.02]'
                    : 'border-flexoki-red/10 bg-flexoki-red/[0.02]',
                )}
              >
                <h3
                  className={cn(
                    'mb-3 font-medium text-xs uppercase tracking-wide',
                    isCorrect ? 'text-flexoki-green/60' : 'text-flexoki-red/60',
                  )}
                >
                  Explanation
                </h3>
                <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert">
                  <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
                {!isCorrect && (
                  <p className="mt-3 text-sm">
                    <span className="text-muted-foreground/60">
                      Correct answer:{' '}
                    </span>
                    <span className="font-medium text-flexoki-green/70">
                      {content.correctAlternative}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Decorative divider */}
            <div className="relative mt-8 opacity-20 transition-opacity duration-300 group-hover:opacity-30">
              <svg
                className="h-6 w-full text-success/30"
                viewBox="0 0 400 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
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
