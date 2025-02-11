import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  BookOpenIcon,
  GraduationCapIcon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Background Patterns */}
      <div className="-z-10 fixed inset-0">
        <div className="absolute inset-0 animate-fade-in bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Gradient Orbs */}
      <div className="-z-10 fixed inset-0 overflow-hidden">
        {/* Primary Orb */}
        <div
          className="absolute top-1/4 left-[15%] h-[300px] w-[300px] animate-delay-300 animate-pulse"
          style={{
            background:
              'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)',
            opacity: 0.15,
            filter: 'blur(40px)',
          }}
        />
        {/* Secondary Orb */}
        <div
          className="absolute top-2/3 right-[15%] h-[250px] w-[250px] animate-delay-500 animate-pulse"
          style={{
            background:
              'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)',
            opacity: 0.1,
            filter: 'blur(40px)',
          }}
        />
        {/* Accent Orb */}
        <div
          className="absolute top-1/2 left-1/3 h-[400px] w-[400px] animate-delay-700 animate-pulse"
          style={{
            background:
              'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)',
            opacity: 0.05,
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 md:px-6 lg:px-8">
          <div className="w-full max-w-5xl space-y-12">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex animate-delay-[50ms] animate-duration-300 animate-fade-in items-center gap-2 border border-border/50 bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                <div className="relative flex items-center">
                  <SparklesIcon className="h-3.5 w-3.5 text-primary" />
                  <div className="absolute inset-0 animate-ping">
                    <SparklesIcon className="h-3.5 w-3.5 text-primary opacity-40" />
                  </div>
                </div>
                <span>Introducing Gradual Learning Platform</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative space-y-8 text-center">
              {/* Glow behind title */}
              <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-32 w-96 animate-duration-[2000ms] animate-pulse bg-primary/10 blur-[120px]" />

              <h1 className="relative animate-delay-[100ms] animate-duration-300 animate-fade-in bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text font-bold text-5xl text-transparent tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Master anything{' '}
                <span className="animate-delay-[150ms] animate-duration-300 animate-fade-in bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text">
                  gradually
                </span>
              </h1>

              <p className="mx-auto max-w-2xl animate-delay-[200ms] animate-duration-300 animate-fade-in text-lg text-muted-foreground md:text-xl">
                A revolutionary platform that breaks down complex subjects into
                digestible steps. Learn at your own pace with our adaptive
                learning system.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="group h-12 min-w-[160px] animate-delay-[250ms] animate-duration-300 animate-fade-in gap-2 text-base transition-all hover:scale-105"
                  >
                    <GraduationCapIcon className="h-4 w-4" />
                    Start Learning
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 min-w-[160px] animate-delay-[300ms] animate-duration-300 animate-fade-in gap-2 text-base transition-all hover:scale-105"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  label: 'Active Learners',
                  value: '10K+',
                  description: 'Growing community',
                  delay: '500',
                },
                {
                  label: 'Courses Created',
                  value: '500+',
                  description: 'Curated content',
                  delay: '600',
                },
                {
                  label: 'Success Rate',
                  value: '94%',
                  description: 'Completion rate',
                  delay: '700',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    'group relative animate-fade-in border border-border/50 bg-background/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/50',
                    {
                      'animate-delay-500': stat.delay === '500',
                      'animate-delay-600': stat.delay === '600',
                      'animate-delay-700': stat.delay === '700',
                    },
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative space-y-2">
                    <div className="font-semibold text-3xl md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="font-medium text-sm">{stat.label}</div>
                    <div className="text-muted-foreground text-sm">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
