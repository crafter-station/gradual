'use client';

import { cn } from '@/lib/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  ref?: React.Ref<HTMLDivElement>;
}) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'group/item border-b transition-all duration-300',
      'hover:bg-muted/40',
      className,
    )}
    {...props}
  />
);

const AccordionTrigger = ({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  ref?: React.Ref<HTMLButtonElement>;
}) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between py-4 font-medium text-sm transition-all hover:text-primary',
        '[&[data-state=open]>svg]:rotate-90',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

const AccordionContent = ({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  ref?: React.Ref<HTMLDivElement>;
}) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.2s] data-[state=open]:animate-[accordion-down_0.2s]"
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
