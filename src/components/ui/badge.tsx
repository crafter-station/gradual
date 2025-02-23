import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-border/40 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/90',
        warning:
          'border-transparent bg-warning text-warning-foreground hover:bg-warning/90',
        outline:
          'border-border/40 bg-background/40 hover:bg-muted/40 hover:border-border/80 text-foreground/80',
        red: 'border-flexoki-red/20 bg-flexoki-red/10 text-flexoki-red hover:bg-flexoki-red/20 hover:border-flexoki-red/30',
        orange:
          'border-flexoki-orange/20 bg-flexoki-orange/10 text-flexoki-orange hover:bg-flexoki-orange/20 hover:border-flexoki-orange/30',
        yellow:
          'border-flexoki-yellow/20 bg-flexoki-yellow/10 text-flexoki-yellow hover:bg-flexoki-yellow/20 hover:border-flexoki-yellow/30',
        green:
          'border-flexoki-green/20 bg-flexoki-green/10 text-flexoki-green hover:bg-flexoki-green/20 hover:border-flexoki-green/30',
        blue: 'border-flexoki-blue/20 bg-flexoki-blue/10 text-flexoki-blue hover:bg-flexoki-blue/20 hover:border-flexoki-blue/30',
        purple:
          'border-flexoki-purple/20 bg-flexoki-purple/10 text-flexoki-purple hover:bg-flexoki-purple/20 hover:border-flexoki-purple/30',
        pink: 'border-flexoki-pink/20 bg-flexoki-pink/10 text-flexoki-pink hover:bg-flexoki-pink/20 hover:border-flexoki-pink/30',
        gray: 'border-flexoki-gray/20 bg-flexoki-gray/10 text-flexoki-gray hover:bg-flexoki-gray/20 hover:border-flexoki-gray/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        'group relative overflow-hidden',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-current/5 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };
