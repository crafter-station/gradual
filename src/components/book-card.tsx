'use client';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const bookCardVariants = cva(
  'group relative w-full h-full [perspective:900px]',
  {
    variants: {
      variant: {
        default: '',
        minimal: '',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
      color: {
        cyan: '',
        red: '',
        orange: '',
        yellow: '',
        green: '',
        blue: '',
        purple: '',
        magenta: '',
        amber: '',
        lime: '',
        emerald: '',
        teal: '',
        sky: '',
        indigo: '',
        violet: '',
        fuchsia: '',
        pink: '',
        rose: '',
        slate: '',
        gray: '',
        zinc: '',
        neutral: '',
        stone: '',
      },
    },
    defaultVariants: {
      variant: 'minimal',
      size: 'default',
      color: 'cyan',
    },
  },
);

const bookCardContentVariants = cva(
  'relative h-full w-full transform-gpu transition-transform duration-300 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-20deg)_scale(1.066)_translateX(-8px)]',
  {
    variants: {
      variant: {
        default: 'flex flex-col',
        minimal: 'flex flex-col',
      },
    },
    defaultVariants: {
      variant: 'minimal',
    },
  },
);

interface BookCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bookCardVariants> {
  title: string;
  author?: string;
  year?: string;
  category?: string;
  unitCount?: number;
  color?:
    | 'cyan'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'magenta'
    | 'amber'
    | 'lime'
    | 'emerald'
    | 'teal'
    | 'sky'
    | 'indigo'
    | 'violet'
    | 'fuchsia'
    | 'pink'
    | 'rose'
    | 'slate'
    | 'gray'
    | 'zinc'
    | 'neutral'
    | 'stone';
}

const BookCard = React.forwardRef<HTMLDivElement, BookCardProps>(
  (
    {
      className,
      title,
      author = 'unknown',
      year,
      category,
      unitCount,
      variant,
      size,
      color = 'cyan',
      ...props
    },
    ref,
  ) => {
    // Map color to appropriate Tailwind classes
    const getColorClasses = (colorName: string) => {
      const colorMap: Record<
        string,
        {
          bg: string;
          darkBg: string;
          border: string;
          darkBorder: string;
          badgeBg: string;
          darkBadgeBg: string;
        }
      > = {
        cyan: {
          bg: 'bg-cyan-100',
          darkBg: 'dark:bg-cyan-900',
          border: 'border-cyan-400',
          darkBorder: 'dark:border-cyan-50/20',
          badgeBg: 'bg-cyan-50',
          darkBadgeBg: 'dark:bg-cyan-50/10',
        },
        red: {
          bg: 'bg-red-100',
          darkBg: 'dark:bg-red-900',
          border: 'border-red-400',
          darkBorder: 'dark:border-red-50/20',
          badgeBg: 'bg-red-50',
          darkBadgeBg: 'dark:bg-red-50/10',
        },
        orange: {
          bg: 'bg-orange-100',
          darkBg: 'dark:bg-orange-900',
          border: 'border-orange-400',
          darkBorder: 'dark:border-orange-50/20',
          badgeBg: 'bg-orange-50',
          darkBadgeBg: 'dark:bg-orange-50/10',
        },
        yellow: {
          bg: 'bg-yellow-100',
          darkBg: 'dark:bg-yellow-900',
          border: 'border-yellow-400',
          darkBorder: 'dark:border-yellow-50/20',
          badgeBg: 'bg-yellow-50',
          darkBadgeBg: 'dark:bg-yellow-50/10',
        },
        green: {
          bg: 'bg-green-100',
          darkBg: 'dark:bg-green-900',
          border: 'border-green-400',
          darkBorder: 'dark:border-green-50/20',
          badgeBg: 'bg-green-50',
          darkBadgeBg: 'dark:bg-green-50/10',
        },
        blue: {
          bg: 'bg-blue-100',
          darkBg: 'dark:bg-blue-900',
          border: 'border-blue-400',
          darkBorder: 'dark:border-blue-50/20',
          badgeBg: 'bg-blue-50',
          darkBadgeBg: 'dark:bg-blue-50/10',
        },
        purple: {
          bg: 'bg-purple-100',
          darkBg: 'dark:bg-purple-900',
          border: 'border-purple-400',
          darkBorder: 'dark:border-purple-50/20',
          badgeBg: 'bg-purple-50',
          darkBadgeBg: 'dark:bg-purple-50/10',
        },
        magenta: {
          bg: 'bg-magenta-100',
          darkBg: 'dark:bg-magenta-900',
          border: 'border-magenta-400',
          darkBorder: 'dark:border-magenta-50/20',
          badgeBg: 'bg-magenta-50',
          darkBadgeBg: 'dark:bg-magenta-50/10',
        },
        amber: {
          bg: 'bg-amber-100',
          darkBg: 'dark:bg-amber-900',
          border: 'border-amber-400',
          darkBorder: 'dark:border-amber-50/20',
          badgeBg: 'bg-amber-50',
          darkBadgeBg: 'dark:bg-amber-50/10',
        },
        lime: {
          bg: 'bg-lime-100',
          darkBg: 'dark:bg-lime-900',
          border: 'border-lime-400',
          darkBorder: 'dark:border-lime-50/20',
          badgeBg: 'bg-lime-50',
          darkBadgeBg: 'dark:bg-lime-50/10',
        },
        emerald: {
          bg: 'bg-emerald-100',
          darkBg: 'dark:bg-emerald-900',
          border: 'border-emerald-400',
          darkBorder: 'dark:border-emerald-50/20',
          badgeBg: 'bg-emerald-50',
          darkBadgeBg: 'dark:bg-emerald-50/10',
        },
        teal: {
          bg: 'bg-teal-100',
          darkBg: 'dark:bg-teal-900',
          border: 'border-teal-400',
          darkBorder: 'dark:border-teal-50/20',
          badgeBg: 'bg-teal-50',
          darkBadgeBg: 'dark:bg-teal-50/10',
        },
        sky: {
          bg: 'bg-sky-100',
          darkBg: 'dark:bg-sky-900',
          border: 'border-sky-400',
          darkBorder: 'dark:border-sky-50/20',
          badgeBg: 'bg-sky-50',
          darkBadgeBg: 'dark:bg-sky-50/10',
        },
        indigo: {
          bg: 'bg-indigo-100',
          darkBg: 'dark:bg-indigo-900',
          border: 'border-indigo-400',
          darkBorder: 'dark:border-indigo-50/20',
          badgeBg: 'bg-indigo-50',
          darkBadgeBg: 'dark:bg-indigo-50/10',
        },
        violet: {
          bg: 'bg-violet-100',
          darkBg: 'dark:bg-violet-900',
          border: 'border-violet-400',
          darkBorder: 'dark:border-violet-50/20',
          badgeBg: 'bg-violet-50',
          darkBadgeBg: 'dark:bg-violet-50/10',
        },
        fuchsia: {
          bg: 'bg-fuchsia-100',
          darkBg: 'dark:bg-fuchsia-900',
          border: 'border-fuchsia-400',
          darkBorder: 'dark:border-fuchsia-50/20',
          badgeBg: 'bg-fuchsia-50',
          darkBadgeBg: 'dark:bg-fuchsia-50/10',
        },
        pink: {
          bg: 'bg-pink-100',
          darkBg: 'dark:bg-pink-900',
          border: 'border-pink-400',
          darkBorder: 'dark:border-pink-50/20',
          badgeBg: 'bg-pink-50',
          darkBadgeBg: 'dark:bg-pink-50/10',
        },
        rose: {
          bg: 'bg-rose-100',
          darkBg: 'dark:bg-rose-900',
          border: 'border-rose-400',
          darkBorder: 'dark:border-rose-50/20',
          badgeBg: 'bg-rose-50',
          darkBadgeBg: 'dark:bg-rose-50/10',
        },
        slate: {
          bg: 'bg-slate-100',
          darkBg: 'dark:bg-slate-900',
          border: 'border-slate-400',
          darkBorder: 'dark:border-slate-50/20',
          badgeBg: 'bg-slate-50',
          darkBadgeBg: 'dark:bg-slate-50/10',
        },
        gray: {
          bg: 'bg-gray-100',
          darkBg: 'dark:bg-gray-900',
          border: 'border-gray-400',
          darkBorder: 'dark:border-gray-50/20',
          badgeBg: 'bg-gray-50',
          darkBadgeBg: 'dark:bg-gray-50/10',
        },
        zinc: {
          bg: 'bg-zinc-100',
          darkBg: 'dark:bg-zinc-900',
          border: 'border-zinc-400',
          darkBorder: 'dark:border-zinc-50/20',
          badgeBg: 'bg-zinc-50',
          darkBadgeBg: 'dark:bg-zinc-50/10',
        },
        neutral: {
          bg: 'bg-neutral-100',
          darkBg: 'dark:bg-neutral-900',
          border: 'border-neutral-400',
          darkBorder: 'dark:border-neutral-50/20',
          badgeBg: 'bg-neutral-50',
          darkBadgeBg: 'dark:bg-neutral-50/10',
        },
        stone: {
          bg: 'bg-stone-100',
          darkBg: 'dark:bg-stone-900',
          border: 'border-stone-400',
          darkBorder: 'dark:border-stone-50/20',
          badgeBg: 'bg-stone-50',
          darkBadgeBg: 'dark:bg-stone-50/10',
        },
      };

      return colorMap[colorName] || colorMap.cyan;
    };

    const colorClasses = getColorClasses(color);

    return (
      <div
        className={cn(bookCardVariants({ variant, size, color, className }))}
        ref={ref}
        {...props}
      >
        <div className={bookCardContentVariants({ variant })}>
          {/* Main Card Face */}
          <div
            className={cn(
              'absolute inset-0 z-10 flex h-full w-full flex-col overflow-hidden rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-lg border transition-all [transform:translateZ(10px)] hover:brightness-105 dark:hover:brightness-120',
              colorClasses.bg,
              colorClasses.darkBg,
              colorClasses.border,
              colorClasses.darkBorder,
            )}
          >
            {/* Top badges */}
            <div className="flex items-center justify-between p-4">
              {year && (
                <span
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium text-accent-foreground/80 text-xs',
                    colorClasses.badgeBg,
                    colorClasses.darkBadgeBg,
                  )}
                >
                  {year}
                </span>
              )}
              {category && (
                <span className="font-medium text-accent-foreground/80 text-xs">
                  {category}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="flex flex-col gap-2">
                <h3 className="line-clamp-5 text-balance font-medium font-serif text-foreground text-lg leading-tight tracking-tight">
                  {title}
                </h3>
                <div className="text-accent-foreground/80 text-xs">
                  {author}
                </div>
              </div>

              <div className="space-y-4">
                {unitCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full',
                        colorClasses.badgeBg,
                        colorClasses.darkBadgeBg,
                      )}
                    >
                      <span className="font-medium text-accent-foreground/80 text-xs">
                        {unitCount}
                      </span>
                    </div>
                    <span className="text-accent-foreground/80 text-xs">
                      {unitCount === 1 ? 'Unit' : 'Units'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div
            className={cn(
              'absolute inset-0 h-full w-full rounded-3xl border brightness-90 [transform:translateZ(-16px)]',
              colorClasses.bg,
              colorClasses.darkBg,
              colorClasses.border,
              colorClasses.darkBorder,
            )}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  },
);

BookCard.displayName = 'BookCard';

export { BookCard };
