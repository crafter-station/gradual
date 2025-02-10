'use client';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const bookVariants = cva('relative inline-block w-fit [perspective:900px]', {
  variants: {
    variant: {
      simple: '',
      default: '',
    },
    size: {
      sm: 'w-[150px]',
      default: 'w-[196px]',
      lg: 'w-[300px]',
    },
    textured: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    textured: false,
  },
});

const bookRotateVariants = cva(
  'relative aspect-49/60 w-full transform-gpu transition-transform duration-300 ease-out [transform-style:preserve-3d] [container-type:inline-size] group-hover:[transform:rotateY(-20deg)_scale(1.066)_translateX(-8px)]',
  {
    variants: {
      variant: {
        simple: '',
        default: 'flex flex-col',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface BookProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bookVariants> {
  title: string;
  illustration?: React.ReactNode;
  color?: string;
  textColor?: string;
}

const Book = React.forwardRef<HTMLDivElement, BookProps>(
  (
    {
      className,
      title,
      variant,
      size,
      textured,
      illustration,
      color,
      textColor,
      ...props
    },
    ref,
  ) => {
    const bookColor = color || 'hsl(var(--primary))' || 'hsl(var(--secondary))';
    const bookTextColor = textColor || 'hsl(var(--primary-foreground))';

    return (
      <div
        className={cn(
          'group',
          bookVariants({ variant, size, textured, className }),
        )}
        ref={ref}
        {...props}
      >
        <div className={bookRotateVariants({ variant })}>
          {/* Main Book Face */}
          <div
            className="absolute inset-0 h-full w-full overflow-hidden rounded-[6px_4px_4px_6px] border [transform:translateZ(14.5cqw)]"
            style={{
              background: 'var(--border)',
              boxShadow: 'var(--book-shadow)',
            }}
          >
            <div className="flex h-full w-full flex-col">
              {variant === 'simple' && illustration ? (
                <div className="flex flex-1">
                  <div
                    className="relative w-[8.2%] opacity-20"
                    style={{ background: 'var(--bg-shadow)' }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-1 flex-col justify-between p-[6.1%]">
                    <span
                      className="text-balance font-semibold text-sm leading-5 tracking-tight"
                      style={{ color: bookTextColor }}
                    >
                      {title}
                    </span>
                    <div className="flex items-center justify-center p-4">
                      {illustration}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="relative h-[40%] w-full"
                    style={{ background: bookColor }}
                  >
                    <div className="absolute inset-0 z-100 flex items-center justify-center">
                      {illustration}
                    </div>
                  </div>
                  <div className="flex flex-1 bg-book!">
                    <div
                      className="relative w-[8.2%] opacity-20"
                      style={{ background: 'var(--bg-shadow)' }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-1 flex-col justify-between bg-book! p-[6.1%]">
                      <span className="text-balance font-semibold text-sm leading-5 tracking-tight">
                        {title}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {textured && (
              <div
                // biome-ignore lint/nursery/useSortedClasses: <explanation>
                className="pointer-events-none absolute inset-0 rounded-[6px_4px_4px_6px] bg-[url('https://assets.vercel.com/image/upload/v1720554484/front/design/book-texture.avif')] bg-cover bg-no-repeat mix-blend-hard-light opacity-50 brightness-110 dark:opacity-100 dark:brightness-100"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Book Pages */}
          <div
            className={cn(
              'absolute top-[3px] h-[calc(100%-6px)] w-[calc(29cqw-2px)] bg-linear-to-r from-gray-200 via-white to-transparent [transform:translateX(calc(83.5cqw))_rotateY(90deg)]',
              textured &&
                'bg-[repeating-linear-gradient(90deg,white,var(--color-gray-100)_1px,white_3px,var(--color-gray-400)_0)]',
            )}
            aria-hidden="true"
          />

          {/* Book Back */}
          <div
            className="absolute inset-0 h-full w-full rounded-[6px_4px_4px_6px] brightness-90 [transform:translateZ(-14.5cqw)]"
            style={{
              background:
                variant === 'simple' && illustration
                  ? bookColor
                  : `linear-gradient(to bottom, ${bookColor} 40%, hsl(var(--card)) 40%)`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  },
);
Book.displayName = 'Book';

export { Book };
