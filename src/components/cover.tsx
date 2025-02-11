'use client';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { Card, CardContent } from './ui/card';

const coverVariants = cva(
  'relative overflow-hidden transition-all duration-500',
  {
    variants: {
      variant: {
        default: [
          'bg-gradient-to-br from-primary via-primary/90 to-primary/80',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-black/0 after:via-black/5 after:to-black/20',
        ],
        glass: [
          'bg-gradient-to-br from-background/60 to-background/30',
          'backdrop-blur-xl',
          'border-t border-white/20',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-primary/5 after:to-primary/20',
        ],
        simple: [
          'bg-gradient-to-r from-muted/90 to-muted',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-background/0 after:to-background/10',
        ],
        gradient: [
          'bg-gradient-to-br from-[#205EA6] via-primary-foreground dark:via-primary to-[#5E409D] dark:to-[#8B7EC8]',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-black/0 after:via-black/5 after:to-black/20',
        ],
        dark: [
          'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-primary/5 after:via-primary/10 after:to-primary/5',
        ],
      },
      size: {
        sm: 'h-[120px]',
        default: 'h-[180px]',
        lg: 'h-[240px]',
        xl: 'h-[320px]',
      },
      textured: {
        true: [
          'before:absolute before:inset-0',
          'before:bg-[url("https://assets.vercel.com/image/upload/v1720554484/front/design/book-texture.avif")]',
          'before:bg-cover before:bg-center before:bg-no-repeat',
          'before:mix-blend-soft-light before:opacity-30',
          'before:animate-subtle-grain',
        ],
        false: '',
      },
      interactive: {
        true: [
          'group-hover:shadow-2xl',
          'group-hover:shadow-primary/20',
          'transition-all duration-500',
          '[transform-style:preserve-3d]',
          'group-hover:[transform:translateY(-2px)]',
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      textured: false,
      interactive: true,
    },
    compoundVariants: [
      {
        variant: 'glass',
        textured: true,
        className: 'before:opacity-10',
      },
      {
        variant: 'dark',
        textured: true,
        className: 'before:opacity-50 before:mix-blend-overlay',
      },
    ],
  },
);

interface CoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof coverVariants> {
  title: string;
  illustration?: React.ReactNode;
  badge?: React.ReactNode;
  stats?: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
  completion?: {
    icon: React.ReactNode;
    count: string;
    label: string;
  };
  interactive?: boolean;
}

const Cover = React.forwardRef<HTMLDivElement, CoverProps>(
  (
    {
      className,
      title,
      variant,
      size,
      textured,
      illustration,
      badge,
      stats,
      completion,
      interactive,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'group animate-fade-in',
          coverVariants({ variant, size, textured, interactive, className }),
        )}
        ref={ref}
        {...props}
      >
        {/* Base Cover with Illustration */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-fade-in-delay-100 transition-transform duration-500 group-hover:scale-110">
            {illustration}
          </div>
        </div>

        {/* Featured Badge */}
        {badge && (
          <div className="absolute top-6 left-6 z-20 animate-fade-in-delay-200">
            {badge}
          </div>
        )}

        {/* Completion Status */}
        {completion && (
          <div className="absolute top-6 right-6 z-20">
            <Card className="animate-fade-in bg-muted backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    {completion.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{completion.count}</div>
                    <div className="text-muted-foreground text-xs">
                      {completion.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
          <div className="mx-auto h-full max-w-7xl px-6">
            <div className="flex h-full flex-col justify-end pb-8">
              <div className="space-y-4">
                {/* Stats */}
                {stats && (
                  <div className="flex animate-fade-in flex-wrap gap-4 text-sm">
                    {stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm"
                      >
                        {stat.icon}
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="animate-fade-up font-bold text-4xl">{title}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    );
  },
);

Cover.displayName = 'Cover';

export { Cover };
