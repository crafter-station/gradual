'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  index?: number;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, index = 0, ...props }, ref) => {
  const letter = String.fromCharCode(97 + index); // 97 is 'a' in ASCII

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'relative h-8 w-8 rounded-full border-2 text-center font-medium transition-colors',
        'data-[state=checked]:border-current data-[state=unchecked]:border-muted-foreground/30',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:!text-foreground',
        'data-[state=checked]:!text-background',
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 z-10 flex items-center justify-center text-sm">
        {letter}
      </span>
      <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
