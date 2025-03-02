import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function TaskProgress({
  stepsCount,
  stepsCompletedCount,
  type,
}: Readonly<{
  stepsCount: number;
  stepsCompletedCount: number;
  type: string;
}>) {
  const progressClasses =
    {
      QUIZ: '[&>div]:bg-flexoki-blue/50',
      LESSON: '[&>div]:bg-flexoki-green/50',
      MULTISTEP: '[&>div]:bg-flexoki-purple/50',
    }[type] ?? '[&>div]:bg-primary/50';

  return (
    <div className="space-y-1.5">
      <Progress
        value={(stepsCompletedCount / stepsCount) * 100}
        className={cn(
          'h-1 overflow-hidden rounded-full bg-muted/30 transition-all group-hover:bg-muted/50',
          progressClasses,
        )}
      />
      <p className="text-muted-foreground text-xs">
        {stepsCompletedCount} of {stepsCount} steps completed
      </p>
    </div>
  );
}
