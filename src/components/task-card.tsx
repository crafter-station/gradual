import { Badge, type BadgeProps } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SelectTask, SelectTaskProgress } from '@/db/schema';
import { getTaskProgress } from '@/db/utils';
import { cn } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { CheckCircle2Icon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { TaskProgress } from './task-progress';

type PickTaskProgress = Pick<
  SelectTaskProgress,
  'stepsCompletedCount' | 'earnedExperiencePoints'
>;

export async function TaskCard({
  task,
  unitOrder,
  sectionOrder,
}: Readonly<{
  task: Omit<SelectTask, 'embedding' | 'sectionId' | 'createdAt' | 'updatedAt'>;
  unitOrder: number;
  sectionOrder: number;
}>) {
  const user = await currentUser();
  let progress: PickTaskProgress | undefined;

  if (user) {
    const userId = user.privateMetadata.userId as string | undefined;
    if (userId) {
      [progress] = await getTaskProgress.execute({
        userId,
        taskId: task.id,
      });
    }
  }

  return (
    <TaskCardXD
      task={task}
      progress={progress}
      unitOrder={unitOrder}
      sectionOrder={sectionOrder}
    />
  );
}

export function TaskCardXD({
  task,
  progress,
  unitOrder,
  sectionOrder,
}: Readonly<{
  task: Omit<SelectTask, 'embedding' | 'sectionId' | 'createdAt' | 'updatedAt'>;
  progress: PickTaskProgress | undefined;
  unitOrder: number;
  sectionOrder: number;
}>) {
  const isCompleted = progress?.stepsCompletedCount === task.stepsCount;
  const themeStyles = getThemeStyles(task.type);

  return (
    <Card
      key={task.id}
      className={cn(
        'group relative animate-fade-up overflow-hidden border-border/50 bg-gradient-to-b from-background to-background/30 transition-all duration-300 hover:border-border/80 hover:shadow-lg',
        isCompleted && [
          themeStyles.completedBg,
          themeStyles.completedBorder,
          'hover:-translate-y-0.5 hover:shadow-md',
        ],
      )}
      style={{ animationDelay: `${task.order * 50}ms` }}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          themeStyles.gradient,
        )}
      />

      {isCompleted && (
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-[2px] transition-opacity duration-500',
            task.type === 'QUIZ' && 'bg-flexoki-blue',
            task.type === 'LESSON' && 'bg-flexoki-green',
            task.type === 'MULTISTEP' && 'bg-flexoki-purple',
          )}
        />
      )}

      <CardContent className="relative z-10 space-y-4 p-4">
        <div className="flex items-center justify-between">
          <Badge
            variant={
              {
                QUIZ: 'blue',
                LESSON: 'green',
                MULTISTEP: 'purple',
              }[task.type] as BadgeProps['variant']
            }
            className={cn(
              'transition-all duration-300',
              isCompleted &&
                'opacity-80 group-hover:scale-105 group-hover:shadow-sm',
            )}
          >
            <div className="flex items-center gap-1.5">
              {isCompleted && <CheckCircle2Icon className="h-3 w-3" />}
              {task.type}
            </div>
          </Badge>
          <span
            className={cn(
              'font-mono text-xs',
              isCompleted ? themeStyles.text : 'text-muted-foreground',
            )}
          >
            {task.experiencePoints} XP
          </span>
        </div>

        <div className="space-y-1.5">
          <h3
            className={cn(
              'font-medium leading-tight transition-colors duration-300',
              isCompleted ? themeStyles.text : 'group-hover:text-primary',
            )}
          >
            {unitOrder}.{sectionOrder}.{task.order} {task.title}
          </h3>
        </div>

        {isCompleted ? (
          <div
            className={cn(
              'flex items-center gap-2 font-medium text-sm',
              themeStyles.text,
            )}
          >
            <span>✨ Mastered</span>
          </div>
        ) : (
          <TaskProgress
            stepsCount={task.stepsCount}
            stepsCompletedCount={progress?.stepsCompletedCount ?? 0}
            type={task.type}
          />
        )}

        <Link
          href={`/learn/courses/${task.courseId}/tasks/${task.id}`}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-full transition-all duration-300',
            {
              'group-hover:border-flexoki-blue/20 group-hover:bg-flexoki-blue/10 group-hover:text-flexoki-blue':
                task.type === 'QUIZ',
              'group-hover:border-flexoki-green/20 group-hover:bg-flexoki-green/10 group-hover:text-flexoki-green':
                task.type === 'LESSON',
              'group-hover:border-flexoki-purple/20 group-hover:bg-flexoki-purple/10 group-hover:text-flexoki-purple':
                task.type === 'MULTISTEP',
            },
            isCompleted && [
              themeStyles.text,
              themeStyles.border,
              'opacity-90 hover:opacity-100',
            ],
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {isCompleted
              ? 'Review'
              : progress?.stepsCompletedCount
                ? 'Continue'
                : 'Start'}
            <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}

const getThemeStyles = (type: string) => {
  switch (type) {
    case 'QUIZ':
      return {
        text: 'text-flexoki-blue',
        border: '!border-flexoki-blue/20',
        gradient: 'from-flexoki-blue/5 via-transparent to-transparent',
        completedBg: 'bg-flexoki-blue/[0.03]',
        completedBorder: '!border-flexoki-blue/30',
      };
    case 'LESSON':
      return {
        text: 'text-flexoki-green',
        border: '!border-flexoki-green/20',
        gradient: 'from-flexoki-green/5 via-transparent to-transparent',
        completedBg: 'bg-flexoki-green/[0.03]',
        completedBorder: '!border-flexoki-green/30',
      };
    case 'MULTISTEP':
      return {
        text: 'text-flexoki-purple',
        border: '!border-flexoki-purple/20',
        gradient: 'from-flexoki-purple/5 via-transparent to-transparent',
        completedBg: 'bg-flexoki-purple/[0.03]',
        completedBorder: '!border-flexoki-purple/30',
      };
    default:
      return {
        text: 'text-primary',
        border: '!border-primary/20',
        gradient: 'from-primary/5 via-transparent to-transparent',
        completedBg: 'bg-primary/[0.03]',
        completedBorder: '!border-primary/30',
      };
  }
};
