import { Cover } from '@/components/cover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnitsWithConnector } from '@/components/units-with-connector';
import { db } from '@/db';
import { taskProgress } from '@/db/schema';
import { cn } from '@/lib/utils';
import { getI18n } from '@/locales/server';
import { eq, inArray } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import {
  BookOpenIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  DatabaseIcon,
  FileTextIcon,
  GraduationCapIcon,
  HeartIcon,
  HomeIcon,
  LayersIcon,
  ListTodoIcon,
  MessageSquareIcon,
  NotebookIcon,
  PlusIcon,
  StarIcon,
  TrophyIcon,
} from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from './tasks/[task_id]/helpers';

export const metadata = {
  title: 'Course',
};

export const revalidate = 0;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id: courseId } = await params;
  const t = await getI18n();
  const currentUser = await getCurrentUser();

  const course = await db.query.courses.findFirst({
    where: (courses, { eq }) => eq(courses.id, courseId),
    with: {
      units: {
        with: {
          modules: {
            with: {
              tasks: true,
            },
          },
        },
      },
    },
  });

  console.log({ course: JSON.stringify(course, null, 2) });

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t('course.notFound')}
      </div>
    );
  }

  const selectedTasks = course.units
    .flatMap((unit) =>
      unit.modules.flatMap((module) =>
        module.tasks.map((task) => ({
          ...task,
          module: {
            ...module,
            tasks: undefined,
            unit: {
              ...unit,
              modules: undefined,
            },
          },
        })),
      ),
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  const selectedTasksProgresses = currentUser
    ? await db.query.taskProgress.findMany({
        where: and(
          eq(taskProgress.userId, currentUser.id),
          inArray(
            taskProgress.taskId,
            selectedTasks.map((task) => task.id),
          ),
        ),
      })
    : [];

  return (
    <div className="flex h-full flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex h-16 shrink-0 animate-fade-in items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-6">
          <SidebarTrigger className="-ml-1 transition-transform duration-300 hover:rotate-180" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/home"
                  className="transition-transform hover:scale-105"
                >
                  <HomeIcon size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">{t('breadcrumbs.home')}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/courses"
                  className="transition-colors hover:text-primary"
                >
                  {t('breadcrumbs.courses')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {/* Hero Section - Updated for full-width cover */}
        <div className="relative animate-fade-in">
          <Cover
            title={course.title ?? ''}
            variant="gradient"
            size="lg"
            textured
            interactive
            className="w-full rounded-none"
            illustration={<DatabaseIcon className="h-16 w-16 animate-pulse" />}
            badge={
              <Badge className="animate-bounce-slow">
                <StarIcon className="mr-1 h-3 w-3" /> Featured
              </Badge>
            }
            stats={[
              {
                icon: <LayersIcon className="h-4 w-4" />,
                label: t('course.stats.topics', { count: course.units.length }),
              },
              {
                icon: <BookOpenIcon className="h-4 w-4" />,
                label: t('course.stats.sections', { count: 5 }),
              },
              {
                icon: <TrophyIcon className="h-4 w-4" />,
                label: '500 XP Available',
              },
            ]}
            completion={{
              icon: <ClockIcon className="h-4 w-4" />,
              count: t('course.stats.completed.count', {
                completed: 6,
                total: 10,
              }),
              label: t('course.stats.completed.title'),
            }}
          />
        </div>

        {/* Tabs Section - Updated to be directly below cover */}
        <div className="border-b bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <Tabs defaultValue="overview" className="-mb-px relative">
              <div className="flex items-center justify-between pt-2 pb-3">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="overview"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                  <TabsTrigger value="lessons">Lessons</TabsTrigger>
                  <TabsTrigger
                    value="flashcards"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    Flashcards
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="discussions"
                    className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    Discussions
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Syllabus Tab */}
              <TabsContent value="syllabus" className="py-6">
                <div className="w-full">
                  <div className="mb-8 flex items-center justify-between px-6">
                    <div className="space-y-1">
                      <h2 className="animate-fade-up font-semibold text-2xl">
                        Course Syllabus
                      </h2>
                      <p className="animate-fade-up text-muted-foreground delay-100">
                        Master the fundamentals through structured learning
                        paths
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="animate-fade-left gap-2"
                    >
                      <FileTextIcon className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>

                  <div className="relative min-h-[400px] w-full">
                    <div className="mx-auto max-w-4xl">
                      <UnitsWithConnector units={course.units} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Lessons Tab */}
              <TabsContent value="lessons" className="py-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="animate-fade-up font-semibold text-xl">
                      Continue Learning
                    </h2>
                    <Button
                      variant="outline"
                      className="animate-fade-left gap-2"
                    >
                      <ListTodoIcon className="h-4 w-4" />
                      View All Lessons
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedTasks.map((task, index) => (
                      <Card
                        key={task.id}
                        className="group relative animate-fade-up overflow-hidden transition-all duration-300 hover:shadow-lg"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <Badge
                                variant={
                                  {
                                    QUIZ: 'outline' as const,
                                    LESSON: 'default' as const,
                                    MULTISTEP: 'secondary' as const,
                                  }[task.type]
                                }
                                className="transition-transform duration-300 group-hover:scale-105"
                              >
                                {task.type}
                              </Badge>
                              <span className="font-mono text-muted-foreground text-xs">
                                {task.experiencePoints} XP
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium transition-colors duration-300 group-hover:text-primary">
                                {task.title}
                              </h3>
                              <p className="mt-1 text-muted-foreground text-sm">
                                {task.module.unit.order}.{task.module.order}{' '}
                                {task.module.title}
                              </p>
                            </div>
                            <TaskProgress
                              stepsCount={task.stepsCount}
                              stepsCompletedCount={
                                selectedTasksProgresses.find(
                                  (progress) => progress.taskId === task.id,
                                )?.stepsCompletedCount ?? 0
                              }
                            />
                            <Link
                              href={`/courses/${course.id}/tasks/${task.id}`}
                              className={cn(
                                buttonVariants({ variant: 'outline' }),
                                'transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground',
                              )}
                            >
                              <span className="flex items-center gap-2">
                                {(selectedTasksProgresses.find(
                                  (progress) => progress.taskId === task.id,
                                )?.stepsCompletedCount ?? 0) > 0
                                  ? 'Continue'
                                  : 'Start'}
                                <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Overview Tab */}
              <TabsContent value="overview" className="py-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-lg">About this course</h3>
                    <p className="mt-2 text-muted-foreground">
                      Master the fundamentals of database management and SQL
                      with hands-on projects and real-world scenarios. Perfect
                      for beginners and intermediate developers looking to
                      strengthen their data skills.
                    </p>

                    <div className="mt-6 grid gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <GraduationCapIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Beginner Friendly</div>
                          <div className="text-muted-foreground text-sm">
                            No prior experience needed
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ClockIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">6 Hours of Content</div>
                          <div className="text-muted-foreground text-sm">
                            Complete at your own pace
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileTextIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Certificate</div>
                          <div className="text-muted-foreground text-sm">
                            Earn upon completion
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg">
                        What you'll learn
                      </h3>
                      <ul className="mt-2 grid gap-2">
                        {[
                          'Database design fundamentals',
                          'SQL query optimization',
                          'Data modeling best practices',
                          'Security and access control',
                          'Performance tuning techniques',
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <CheckIcon className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">Prerequisites</h3>
                      <ul className="mt-2 grid gap-2">
                        <li className="flex items-center gap-2">
                          <CircleIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Basic computer literacy
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CircleIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Understanding of basic programming concepts
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Flashcards Tab */}
              <TabsContent value="flashcards" className="py-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl">Flashcards</h2>
                    <Button variant="outline" className="gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Create New
                    </Button>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="group relative overflow-hidden">
                        <CardContent className="p-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          <div className="relative space-y-4">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">Basic Concepts</Badge>
                              <BookmarkIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
                            </div>
                            <p className="font-medium">
                              What is a primary key in a database?
                            </p>
                            <div className="pt-4">
                              <Button variant="outline" className="w-full">
                                Show Answer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="py-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl">My Notes</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <FileTextIcon className="h-4 w-4" />
                        Export
                      </Button>
                      <Button className="gap-2">
                        <PlusIcon className="h-4 w-4" />
                        New Note
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <NotebookIcon className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Lecture Notes</h3>
                          </div>
                          <Button variant="ghost" size="icon">
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <ScrollArea className="mt-4 h-[300px]">
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">
                                    Database Normalization
                                  </div>
                                  <span className="text-muted-foreground text-xs">
                                    2 days ago
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  Key points about 1NF, 2NF, and 3NF. Remember
                                  that each normalization level builds upon the
                                  previous one...
                                </p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ListTodoIcon className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Study Tasks</h3>
                          </div>
                          <Button variant="ghost" size="icon">
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <ScrollArea className="mt-4 h-[300px]">
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-3">
                                <CheckIcon />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    Review SQL Joins
                                  </div>
                                  <div className="text-muted-foreground text-xs">
                                    Due tomorrow
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Discussions Tab */}
              <TabsContent value="discussions" className="py-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea
                          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Start a discussion..."
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end">
                          <Button>Post</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={`/avatars/0${i}.png`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">John Doe</span>
                              <span className="text-muted-foreground text-xs">
                                2 hours ago
                              </span>
                            </div>
                            <p className="mt-1 text-muted-foreground text-sm">
                              Can someone explain the difference between INNER
                              JOIN and LEFT JOIN in more detail?
                            </p>
                            <div className="mt-2 flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <MessageSquareIcon className="mr-2 h-4 w-4" />
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm">
                                <HeartIcon className="mr-2 h-4 w-4" />
                                Like
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

async function TaskProgress({
  stepsCount,
  stepsCompletedCount,
}: {
  stepsCount: number;
  stepsCompletedCount: number;
}) {
  return (
    <Progress
      value={(stepsCompletedCount / stepsCount) * 100}
      className="h-1.5 overflow-hidden rounded-full"
    />
  );
}
