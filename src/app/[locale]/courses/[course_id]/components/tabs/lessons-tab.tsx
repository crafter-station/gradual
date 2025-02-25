import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type {
  CourseWithRelations,
  TaskProgress as SelectTaskProgress,
  TaskWithRelations,
} from '@/db/types';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, ChevronRightIcon, ListTodoIcon } from 'lucide-react';
import Link from 'next/link';

interface LessonsTabProps {
  course: CourseWithRelations;
  selectedTasks: TaskWithRelations[];
  selectedTasksProgresses: SelectTaskProgress[];
}

export function LessonsTab({
  course,
  selectedTasks,
  selectedTasksProgresses,
}: Readonly<LessonsTabProps>) {
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

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between">
        <h2 className="animate-fade-up font-semibold text-2xl tracking-tight">
          Continue Learning
        </h2>
        <Button
          variant="outline"
          className="animate-fade-left gap-2 transition-all hover:bg-background/50 hover:shadow-sm"
        >
          <ListTodoIcon className="h-4 w-4" />
          View All Lessons
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selectedTasks.map((task, index) => {
          const progress = selectedTasksProgresses.find(
            (p) => p.taskId === task.id,
          );
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
              style={{ animationDelay: `${index * 50}ms` }}
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
                      'font-medium leading-none transition-colors duration-300',
                      isCompleted
                        ? themeStyles.text
                        : 'group-hover:text-primary',
                    )}
                  >
                    {task.section.unit.order}.{task.section.order}.{task.order}{' '}
                    {task.title}
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
                  href={`/courses/${course.id}/tasks/${task.id}`}
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
        })}
      </div>
    </div>
  );
}

function TaskProgress({
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
