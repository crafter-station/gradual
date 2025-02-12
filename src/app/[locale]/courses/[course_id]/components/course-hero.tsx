import { Cover } from '@/components/cover';
import { Badge } from '@/components/ui/badge';
import type { CourseWithRelations } from '@/db/types';
import type { TFunction } from '@/locales/types';
import {
  BookOpenIcon,
  ClockIcon,
  DatabaseIcon,
  LayersIcon,
  StarIcon,
  TrophyIcon,
} from 'lucide-react';

interface CourseHeroProps {
  course: CourseWithRelations;
  t: TFunction;
}

export function CourseHero({ course, t }: CourseHeroProps) {
  return (
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
  );
}
