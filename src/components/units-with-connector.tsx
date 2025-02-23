'use client';

import { cn } from '@/lib/utils';
import {
  BookOpenIcon,
  ChevronRightIcon,
  ClockIcon,
  LayersIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
  type: 'LESSON' | 'QUIZ' | 'MULTISTEP';
  experiencePoints: number;
  stepsCount: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

interface Unit {
  id: string;
  title: string;
  order: number;
  modules: Module[];
}

interface UnitsWithConnectorProps {
  units: Unit[];
}

export function UnitsWithConnector({ units }: UnitsWithConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pathD, setPathD] = useState('');

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const unitElements =
        containerRef.current.querySelectorAll('.unit-circle');
      if (unitElements.length < 2) return;

      const points = Array.from(unitElements).map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];

        const midY = (prevPoint.y + currentPoint.y) / 2;
        d += ` C ${prevPoint.x} ${midY}, ${currentPoint.x} ${midY}, ${currentPoint.x} ${currentPoint.y}`;
      }
      setPathD(d);
    };

    // Initial update with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updatePath, 0);

    // Update on resize
    window.addEventListener('resize', updatePath);
    const resizeObserver = new ResizeObserver(updatePath);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePath);
      resizeObserver.disconnect();
    };
  }, []);

  // Add another effect to handle animation completion
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        if (containerRef.current) {
          const updateEvent = new Event('resize');
          window.dispatchEvent(updateEvent);
        }
      },
      units.length * 100 + 100,
    ); // Wait for all animations to complete

    return () => clearTimeout(timeoutId);
  }, [units.length]);

  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ minHeight: '100%', width: '100%' }}
      >
        <title>Units Connection Line</title>
        <path
          d={pathD}
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,6"
          className="transition-all duration-300"
        />
      </svg>

      <div ref={containerRef} className="relative z-10 space-y-12">
        {units
          .toSorted((a, b) => a.order - b.order)
          .map((unit) => (
            <div
              key={unit.id}
              className="animate-fade-up"
              style={{ animationDelay: `${unit.order * 100}ms` }}
            >
              <div
                className={cn(
                  'relative flex items-center gap-4 py-8',
                  unit.order % 2 === 1 ? 'flex-row' : 'flex-row-reverse',
                )}
              >
                <div className="group relative">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl transition-colors duration-500 group-hover:bg-primary/20" />
                  <div className="unit-circle relative flex h-12 w-12 items-center justify-center bg-gradient-to-b from-primary/90 to-primary shadow-lg">
                    <span className="font-medium font-mono text-lg text-primary-foreground">
                      {unit.order}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="inline-block rounded-md px-3 py-1.5 font-medium text-base uppercase leading-none">
                    {unit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {unit.modules.length} modules •{' '}
                    {unit.modules.reduce(
                      (acc, module) =>
                        acc +
                        module.tasks.reduce(
                          (sum, task) => sum + task.stepsCount,
                          0,
                        ),
                      0,
                    )}{' '}
                    steps
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  'grid gap-3',
                  unit.order % 2 === 1 ? 'pl-16' : 'pr-16',
                )}
              >
                {unit.modules
                  .toSorted((a, b) => a.order - b.order)
                  .map((module) => (
                    <div
                      key={module.id}
                      className="group hover:-translate-y-0.5 relative transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/5 to-[#BFE8D9] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-[#122F2C]" />

                      <div className="relative flex items-center gap-4 border border-border/50 bg-card/50 p-4 backdrop-blur-xs transition-colors group-hover:shadow-lg">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 font-mono text-primary text-sm">
                          {unit.order}.{module.order}
                        </div>

                        <div className="flex flex-1 items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-medium text-sm leading-none">
                              {module.title}
                            </span>
                            <div className="flex items-center gap-3 text-muted-foreground text-xs">
                              <div className="flex items-center gap-1">
                                <BookOpenIcon className="h-3 w-3" />
                                <span>{module.tasks.length} tasks</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <LayersIcon className="h-3 w-3" />
                                <span>
                                  {module.tasks.reduce(
                                    (sum, task) => sum + task.experiencePoints,
                                    0,
                                  )}{' '}
                                  XP
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>
                                  {module.tasks.reduce(
                                    (sum, task) => sum + task.stepsCount,
                                    0,
                                  )}{' '}
                                  steps
                                </span>
                              </div>
                            </div>
                          </div>

                          <ChevronRightIcon className="h-4 w-4 text-muted-foreground/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
