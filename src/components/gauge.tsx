import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const gaugeVariants = cva(
  'relative inline-flex items-center justify-center rounded-full',
  {
    variants: {
      size: {
        tiny: 'size-8 text-xs',
        small: 'size-12 text-sm',
        medium: 'size-16 text-base',
        large: 'size-24 text-lg',
      },
      variant: {
        default: '[&>svg>circle:last-child]:stroke-primary',
        success: '[&>svg>circle:last-child]:stroke-success',
        warning: '[&>svg>circle:last-child]:stroke-warning',
        danger: '[&>svg>circle:last-child]:stroke-destructive',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'default',
    },
  },
);

export interface GaugeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    Omit<VariantProps<typeof gaugeVariants>, 'variant'> {
  ref?: React.Ref<HTMLDivElement>;
  value: number;
  showValue?: boolean;
}

function getVariantFromValue(value: number) {
  if (value >= 100) return 'success';
  if (value >= 70) return 'default';
  if (value >= 40) return 'warning';
  return 'danger';
}

const Gauge = ({
  className,
  size,
  value,
  showValue = false,
  ref,
  ...props
}: GaugeProps) => {
  const percentage = Math.max(0, Math.min(100, value));
  const variant = getVariantFromValue(percentage);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage * circumference) / 100
  } ${circumference}`;

  return (
    <div
      ref={ref}
      className={cn(gaugeVariants({ size, variant, className }))}
      {...props}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <svg className="-rotate-90 size-full" viewBox="0 0 100 100">
        {/* Background Track */}
        <circle
          className="stroke-muted"
          fill="none"
          strokeWidth="6"
          cx="50"
          cy="50"
          r={radius}
        />
        {/* Progress Circle */}
        <circle
          className="transition-[stroke-dasharray] duration-300 ease-in-out"
          fill="none"
          strokeWidth="6"
          cx="50"
          cy="50"
          r={radius}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center font-medium tabular-nums">
          {Math.round(percentage)}
        </div>
      )}
    </div>
  );
};

export { Gauge };
