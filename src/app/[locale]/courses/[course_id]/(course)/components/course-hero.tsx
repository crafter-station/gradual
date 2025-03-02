import { Cover } from '@/components/cover';
import { Badge } from '@/components/ui/badge';
import type { TFunction } from '@/locales/types';
import {
  ClockIcon,
  DatabaseIcon,
  LayersIcon,
  StarIcon,
  TrophyIcon,
} from 'lucide-react';

interface CourseHeroProps {
  courseTitle: string;
  unitCount: number;
  t: TFunction;
}

export function CourseHero({
  courseTitle,
  unitCount,
  t,
}: Readonly<CourseHeroProps>) {
  return (
    <div className="relative animate-fade-in">
      <Cover
        title={courseTitle}
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
            label: t('course.stats.units', { count: unitCount }),
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
