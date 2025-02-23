import type { CourseWithRelations } from '@/db/types';
import type { TFunction } from '@/locales/types';
import {
  CheckIcon,
  CircleIcon,
  ClockIcon,
  FileTextIcon,
  GraduationCapIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface PrerequisiteItemProps {
  text: string;
}

interface OverviewTabProps {
  t: TFunction;
  course: CourseWithRelations;
}

export function OverviewTab({ t, course }: Readonly<OverviewTabProps>) {
  const features: FeatureItemProps[] = [
    {
      icon: <GraduationCapIcon className="h-5 w-5" />,
      title: t('course.features.beginner.title'),
      description: t('course.features.beginner.description'),
    },
    {
      icon: <ClockIcon className="h-5 w-5" />,
      title: t('course.features.duration.title'),
      description: t('course.features.duration.description'),
    },
    {
      icon: <FileTextIcon className="h-5 w-5" />,
      title: t('course.features.certificate.title'),
      description: t('course.features.certificate.description'),
    },
  ];

  const learningPoints = [
    'Database design fundamentals',
    'SQL query optimization',
    'Data modeling best practices',
    'Security and access control',
    'Performance tuning techniques',
  ].map((item) => t(`course.learningPoints.${item}` as keyof typeof t));

  const prerequisites = [
    'Basic computer literacy',
    'Understanding of basic programming concepts',
  ].map((item) => t(`course.prerequisites.${item}` as keyof typeof t));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-semibold text-lg">{t('course.about.title')}</h3>
        <p className="mt-2 text-muted-foreground">{course.description}</p>

        <div className="mt-6 grid gap-4">
          {features.map((feature) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg">
            {t('course.learningPoints.title')}
          </h3>
          <ul className="mt-2 grid gap-2">
            {learningPoints.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            {t('course.prerequisites.title')}
          </h3>
          <ul className="mt-2 grid gap-2">
            {prerequisites.map((text) => (
              <PrerequisiteItem key={text} text={text} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: Readonly<FeatureItemProps>) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
    </div>
  );
}

function PrerequisiteItem({ text }: Readonly<PrerequisiteItemProps>) {
  return (
    <li className="flex items-center gap-2">
      <CircleIcon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}
