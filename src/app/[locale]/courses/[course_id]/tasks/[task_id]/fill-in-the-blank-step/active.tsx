'use client';
import type { StepContent } from '@/db/schema/step';
import { cn } from '@/lib/utils';
import type { ParentConfig, ParentRecord } from '@formkit/drag-and-drop';
import { animations } from '@formkit/drag-and-drop';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { useFormStatus } from 'react-dom';

interface ActiveFillInTheBlankStepProps {
  id: string;
  stepOrder: number;
  totalSteps: number;
  content: StepContent & {
    type: 'FILL_IN_THE_BLANK';
    body: string;
    blanks: string[];
    distractors: string[];
  };
}

export const ActiveFillInTheBlankStep = ({
  id,
  content,
}: ActiveFillInTheBlankStepProps) => {
  const status = useFormStatus();

  // Split the body text into parts using ____ as delimiter
  const parts = content.body.split('____');

  // Create initial pool of answers
  const initialAnswers = (() => {
    const correctPair = content.blanks;
    const distractorPairs = content.distractors.map((d) => d.split('; '));
    return [...correctPair, ...distractorPairs.flat()];
  })();

  // Configure drag and drop zones with the same group
  const dragConfig: Partial<ParentConfig<string>> = {
    group: 'answers',
    sortable: false,
    plugins: [animations()],
    dropZone: true,
  };

  // Configure pool to allow dragging out
  const poolConfig: Partial<ParentConfig<string>> = {
    ...dragConfig,
    sortable: true,
  };

  // Configure blank zones to only accept if empty
  const blank1Config: Partial<ParentConfig<string>> = {
    ...dragConfig,
    accepts: (
      _targetParent: ParentRecord<string>,
      _initialParent: ParentRecord<string>,
      _currentParent: ParentRecord<string>,
    ) => {
      return blank1Value.length === 0;
    },
  };

  const blank2Config: Partial<ParentConfig<string>> = {
    ...dragConfig,
    accepts: (
      _targetParent: ParentRecord<string>,
      _initialParent: ParentRecord<string>,
      _currentParent: ParentRecord<string>,
    ) => {
      return blank2Value.length === 0;
    },
  };

  const [parent, pool, setPool] = useDragAndDrop<HTMLDivElement, string>(
    initialAnswers,
    poolConfig,
  );

  const [blank1, blank1Value, setBlank1Value] = useDragAndDrop<
    HTMLDivElement,
    string
  >([], blank1Config);

  const [blank2, blank2Value, setBlank2Value] = useDragAndDrop<
    HTMLDivElement,
    string
  >([], blank2Config);

  // Fixed width for blanks and options
  const FIXED_WIDTH = '160px';

  // Handle double click to unselect
  const handleDoubleClick = (blankIndex: number) => {
    const value = blankIndex === 0 ? blank1Value[0] : blank2Value[0];
    if (value) {
      if (blankIndex === 0) {
        setBlank1Value([]);
        setPool([...pool, value]);
      } else {
        setBlank2Value([]);
        setPool([...pool, value]);
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="group relative w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-background to-background/80 transition-all duration-500 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.075] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />

        {/* Task type indicator */}
        <div className="-translate-x-1/2 absolute top-4 left-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
            Fill in the Blank
          </span>
        </div>

        <div className="relative px-8 pt-14 pb-12">
          <div className="relative mx-auto max-w-[640px] space-y-8">
            {/* Main content */}
            <div className="space-y-8">
              {/* Sentence with blanks */}
              <div className="text-center font-medium text-2xl leading-relaxed">
                {parts.map((part, i) => (
                  <span
                    key={`${id}-part-${part}`}
                    className="whitespace-normal"
                  >
                    {part}
                    {i < parts.length - 1 && (
                      <span
                        ref={i === 0 ? blank1 : blank2}
                        className={cn(
                          'relative mx-1 inline-flex min-w-[120px]',
                          'border-muted-foreground/20 border-b-2',
                          'transition-colors duration-300 hover:border-primary/30',
                          (i === 0 ? blank1Value : blank2Value).length > 0 && [
                            'border-primary/40',
                          ],
                        )}
                        onDoubleClick={() => handleDoubleClick(i)}
                      >
                        {(i === 0 ? blank1Value : blank2Value).map(
                          (value: string) => (
                            <div
                              key={value}
                              className={cn(
                                'relative z-10 flex w-full items-center justify-center py-1',
                                'font-medium text-2xl',
                                'cursor-grab active:cursor-grabbing',
                              )}
                            >
                              {value}
                            </div>
                          ),
                        )}
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/* Answer pool */}
              <div className="mx-auto">
                <div
                  ref={parent}
                  className={cn(
                    'flex flex-wrap justify-center gap-2 py-4',
                    'min-h-[60px] transition-all duration-300',
                    'rounded-xl border border-border/40 bg-muted/[0.02]',
                    'group-hover:border-border/60 group-hover:bg-muted/[0.04]',
                  )}
                >
                  {pool.map((answer) => (
                    <div
                      key={answer}
                      className={cn(
                        'rounded-2xl px-4 py-2 font-medium text-lg',
                        'cursor-grab transition-all duration-200 active:cursor-grabbing',
                        'border border-muted/5 bg-muted/10',
                        'hover:bg-muted/20 active:scale-[0.97]',
                        'hover:border-primary/20',
                      )}
                    >
                      <div className="flex items-center justify-center">
                        {answer}
                      </div>
                      {/* Ghost placeholder */}
                      <div
                        className={cn(
                          'pointer-events-none absolute inset-0 rounded-2xl opacity-0',
                          'border border-muted/20 border-dashed bg-muted/5',
                          '[&:has(+.formkit-is-dragging)]:opacity-100',
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                  {pool.length === 0 && (
                    <div className="py-4 text-center text-base text-muted-foreground/40">
                      All words used
                    </div>
                  )}
                </div>
              </div>

              {/* Hidden inputs for form submission */}
              <input
                type="hidden"
                name="blank_0"
                value={blank1Value[0] || ''}
              />
              <input
                type="hidden"
                name="blank_1"
                value={blank2Value[0] || ''}
              />

              {/* Loading state */}
              {status.pending && (
                <div className="flex items-center justify-center gap-1.5">
                  <div className="h-1 w-1 animate-pulse rounded-full bg-primary/40" />
                  <div className="h-1 w-1 animate-pulse rounded-full bg-primary/40 [animation-delay:-0.15s]" />
                  <div className="h-1 w-1 animate-pulse rounded-full bg-primary/40 [animation-delay:-0.3s]" />
                </div>
              )}
            </div>

            {/* Decorative divider */}
            <div className="relative mt-8 opacity-40 transition-opacity duration-300 group-hover:opacity-60">
              <svg
                className="h-6 w-full text-primary/30"
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
