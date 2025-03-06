import { cn } from '@/lib/utils';
import {
  BookOpen,
  Brain,
  CheckCircle,
  CheckCircle2,
  Edit3,
  FileText,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  List,
  Quote,
  XCircle,
} from 'lucide-react';

const stepIcons = {
  Introduction: BookOpen,
  Definition: FileText,
  Analogy: Brain,
  Tutorial: GraduationCap,
  'Solved Exercise': CheckCircle,
  'Fun Fact': Lightbulb,
  Quote: Quote,
  Question: HelpCircle,
  'Fill in the blank': Edit3,
  'Multiple Choice': List,
  'True or False': List,
} as const;

const stepColors = {
  Introduction: {
    badge: {
      light: 'bg-purple-50/80 text-purple-600 border-purple-200/30',
      dark: 'dark:bg-purple-950/80 dark:text-purple-400 dark:border-purple-600/20',
    },
    card: {
      background: '!bg-purple-50/20 dark:!bg-purple-950/20',
      border: '!border-purple-200/30 dark:!border-purple-800/30',
      shadow: '!shadow-purple-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-purple/20 via-flexoki-blue/10 to-transparent blur-2xl',
    },
  },
  Definition: {
    badge: {
      light: 'bg-blue-50/80 text-blue-600 border-blue-200/30',
      dark: 'dark:bg-blue-950/80 dark:text-blue-400 dark:border-blue-600/20',
    },
    card: {
      background: '!bg-blue-50/20 dark:!bg-blue-950/20',
      border: '!border-blue-200/30 dark:!border-blue-800/30',
      shadow: '!shadow-blue-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-blue/20 via-flexoki-purple/10 to-transparent blur-2xl',
    },
  },
  Analogy: {
    badge: {
      light: 'bg-cyan-50/80 text-cyan-600 border-cyan-200/30',
      dark: 'dark:bg-cyan-950/80 dark:text-cyan-400 dark:border-cyan-600/20',
    },
    card: {
      background: '!bg-cyan-50/20 dark:!bg-cyan-950/20',
      border: '!border-cyan-200/30 dark:!border-cyan-800/30',
      shadow: '!shadow-cyan-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-blue/20 via-flexoki-purple/10 to-transparent blur-2xl',
    },
  },
  Tutorial: {
    badge: {
      light: 'bg-green-50/80 text-green-600 border-green-200/30',
      dark: 'dark:bg-green-950/80 dark:text-green-400 dark:border-green-600/20',
    },
    card: {
      background: '!bg-green-50/20 dark:!bg-green-950/20',
      border: '!border-green-200/30 dark:!border-green-800/30',
      shadow: '!shadow-green-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-green/20 via-flexoki-blue/10 to-transparent blur-2xl',
    },
  },
  'Solved Exercise': {
    badge: {
      light: 'bg-yellow-50/80 text-yellow-600 border-yellow-200/30',
      dark: 'dark:bg-yellow-950/80 dark:text-yellow-400 dark:border-yellow-600/20',
    },
    card: {
      background: '!bg-yellow-50/20 dark:!bg-yellow-950/20',
      border: '!border-yellow-200/30 dark:!border-yellow-800/30',
      shadow: '!shadow-yellow-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl',
    },
  },
  'Fun Fact': {
    badge: {
      light: 'bg-orange-50/80 text-orange-600 border-orange-200/30',
      dark: 'dark:bg-orange-950/80 dark:text-orange-400 dark:border-orange-600/20',
    },
    card: {
      background: '!bg-orange-50/20 dark:!bg-orange-950/20',
      border: '!border-orange-200/30 dark:!border-orange-800/30',
      shadow: '!shadow-orange-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl',
    },
  },
  Quote: {
    badge: {
      light: 'bg-red-50/80 text-red-600 border-red-200/30',
      dark: 'dark:bg-red-950/80 dark:text-red-400 dark:border-red-600/20',
    },
    card: {
      background: '!bg-red-50/20 dark:!bg-red-950/20',
      border: '!border-red-200/30 dark:!border-red-800/30',
      shadow: '!shadow-red-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl',
    },
  },
  Question: {
    badge: {
      light: 'bg-base-50 text-base-600 border-base-200',
      dark: 'dark:bg-base-950 dark:text-base-400 dark:border-base-600',
    },
    card: {
      background: '!bg-base-50/20 dark:!bg-base-950/20',
      border: '!border-base-200/30 dark:!border-base-800/30',
      shadow: '!shadow-base-900/5',
      decoration: '',
    },
  },
  'Fill in the blank': {
    badge: {
      light: 'bg-pink-50/80 text-pink-600 border-pink-200/30',
      dark: 'dark:bg-pink-950/80 dark:text-pink-400 dark:border-pink-600/20',
    },
    card: {
      background: '!bg-pink-50/20 dark:!bg-pink-950/20',
      border: '!border-pink-200/30 dark:!border-pink-800/30',
      shadow: '!shadow-pink-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl',
    },
  },
  'Multiple Choice': {
    badge: {
      light: 'bg-lime-50/80 text-lime-600 border-lime-200/30',
      dark: 'dark:bg-lime-950/80 dark:text-lime-400 dark:border-lime-600/20',
    },
    card: {
      background: '!bg-lime-50/20 dark:!bg-lime-950/20',
      border: '!border-lime-200/30 dark:!border-lime-800/30',
      shadow: '!shadow-lime-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl',
    },
  },
  'True or False': {
    badge: {
      light: 'bg-emerald-50/80 text-emerald-600 border-emerald-200/30',
      dark: 'dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-600/20',
    },
    card: {
      background: '!bg-emerald-50/20 dark:!bg-emerald-950/20',
      border: '!border-emerald-200/30 dark:!border-emerald-800/30',
      shadow: '!shadow-emerald-900/5',
      decoration:
        'bg-gradient-to-br from-flexoki-yellow/20 via-flexoki-orange/10 to-transparent blur-2xl',
    },
  },
} as const;

interface StepCardProps {
  children: React.ReactNode;
  stepType: keyof typeof stepIcons;
  isDone?: boolean;
  isCorrect?: boolean;
}

export const StepCard = ({
  children,
  stepType,
  isDone = false,
  isCorrect,
}: StepCardProps) => {
  const Icon = stepIcons[stepType];
  const colors = stepColors[stepType];

  const getBadgeColors = () => {
    if (!isDone) return [colors.badge.light, colors.badge.dark];
    if (isCorrect === false) {
      return [
        'bg-flexoki-red/5 text-flexoki-red border-flexoki-red/30',
        'dark:bg-flexoki-red/950/5 dark:text-flexoki-red dark:border-flexoki-red/60/20',
      ];
    }
    return [
      'bg-flexoki-green/5 text-flexoki-green border-flexoki-green/30',
      'dark:bg-flexoki-green/5 dark:text-flexoki-green dark:border-flexoki-green/60/20',
    ];
  };

  const getBadgeIcon = () => {
    if (isDone || isCorrect) return <CheckCircle2 className="h-3.5 w-3.5" />;
    if (isCorrect === false) return <XCircle className="h-3.5 w-3.5" />;
    return <Icon className="h-3.5 w-3.5" />;
  };

  return (
    <div className={cn('w-full bg-card/50', colors.card.shadow)}>
      <div
        className={cn(
          'w-full overflow-hidden border transition-all duration-500',
          'shadow-[0_2px_15px_-3px_rgba(16,15,15,0.08),0_4px_6px_-4px_rgba(16,15,15,0.1)]',
          colors.card.border,
          colors.card.background,
        )}
      >
        <div className="relative flex flex-col items-center">
          {/* Background decoration */}
          <div
            className={`-top-12 -left-12 absolute h-24 w-24 rounded-full ${colors.card.decoration} blur-2xl`}
          />
          <div
            className={`-bottom-12 -right-12 absolute h-24 w-24 rounded-full ${colors.card.decoration} blur-2xl`}
          />
          {/* Task type indicator */}
          <div className="mt-[1.4rem] mb-6">
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-medium text-xs shadow-sm backdrop-blur-[2px] transition-all duration-500',
                ...getBadgeColors(),
              )}
            >
              {getBadgeIcon()}
              {stepType}
            </span>
          </div>

          <div className="w-full px-8 pb-12">
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
