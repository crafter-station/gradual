import { cn } from '@/lib/utils';

interface StepCardProps {
  children: React.ReactNode;
  stepType: string;
  isDone?: boolean;
  isCorrect?: boolean;
}

export const StepCard = ({
  children,
  stepType,
  isDone = false,
  isCorrect = false,
}: StepCardProps) => {
  const accentColor = isDone ? (isCorrect ? 'success' : 'success') : 'primary';

  return (
    <div className="relative w-full">
      <div className="group relative w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-background to-background/80 transition-all duration-500 hover:border-border/60 hover:shadow-lg hover:shadow-primary/5">
        {/* Background gradients */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            `from-${accentColor}/[0.075]`,
          )}
        />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b to-transparent',
            `from-${accentColor}/[0.03]`,
          )}
        />

        {/* Task type indicator */}
        <div className="-translate-x-1/2 absolute top-4 left-1/2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium text-xs',
              isDone
                ? 'bg-success/5 text-success/70'
                : 'bg-primary/5 text-primary/70',
            )}
          >
            {stepType}
          </span>
        </div>

        <div className="relative px-8 pt-14 pb-12">
          <div className="relative space-y-10">
            {children}

            {/* Decorative divider */}
            <div className="relative mt-8 opacity-20 transition-opacity duration-300 group-hover:opacity-30">
              <svg
                className={cn(
                  'h-6 w-full',
                  isDone ? 'text-success/30' : 'text-primary/30',
                )}
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
