import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  CourseWithRelations,
  TaskProgress,
  TaskWithRelations,
} from '@/db/types';
import type { TFunction } from '@/locales/types';
import { DiscussionsTab } from './tabs/discussions-tab';
import { FlashcardsTab } from './tabs/flashcards-tab';
import { LessonsTab } from './tabs/lessons-tab';
import { NotesTab } from './tabs/notes-tab';
import { OverviewTab } from './tabs/overview-tab';

interface CourseTabsProps {
  course: CourseWithRelations;
  selectedTasks: TaskWithRelations[];
  selectedTasksProgresses: TaskProgress[];
  t: TFunction;
}

export function CourseTabs({
  course,
  selectedTasks,
  selectedTasksProgresses,
  t,
}: Readonly<CourseTabsProps>) {
  return (
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
              <TabsTrigger
                value="syllabus"
                className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                Syllabus
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                Lessons
              </TabsTrigger>
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

          <TabsContent value="overview" className="py-6">
            <OverviewTab t={t} course={course} />
          </TabsContent>

          <TabsContent value="lessons" className="py-6">
            <LessonsTab
              course={course}
              selectedTasks={selectedTasks}
              selectedTasksProgresses={selectedTasksProgresses}
            />
          </TabsContent>

          <TabsContent value="flashcards" className="py-6">
            <FlashcardsTab />
          </TabsContent>

          <TabsContent value="notes" className="py-6">
            <NotesTab />
          </TabsContent>

          <TabsContent value="discussions" className="py-6">
            <DiscussionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
