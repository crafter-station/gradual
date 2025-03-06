
import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { WaitlistForm } from '../form';
import Link from 'next/link';
import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return getStaticParams();
}

export default async function Home({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Enhanced background with more dynamic elements */}
      <div className="-z-10 fixed inset-0 overflow-hidden">
        {/* Improved gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

        {/* Enhanced grid overlay with animation */}
        <div
          className='absolute inset-0 animate-pulse-slow opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* More vibrant abstract shapes */}
        <div
          className="absolute top-1/4 left-[15%] h-[500px] w-[500px] animate-float-slow"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-blue) 0%, transparent 70%)',
            opacity: 0.18,
            filter: 'blur(60px)',
            animation: 'float 20s ease-in-out infinite',
            transformOrigin: 'center center',
          }}
        />
        <div
          className="absolute right-[15%] bottom-1/3 h-[450px] w-[450px] animate-float"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-green) 0%, transparent 70%)',
            opacity: 0.15,
            filter: 'blur(50px)',
            animation: 'float 25s ease-in-out infinite reverse',
            transformOrigin: '60% 40%',
          }}
        />
        <div
          className='absolute top-[60%] left-[30%] h-[400px] w-[400px] animate-float-slow'
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-purple) 0%, transparent 70%)',
            opacity: 0.12,
            filter: 'blur(70px)',
            animation: 'float 30s ease-in-out infinite',
            transformOrigin: '40% 60%',
          }}
        />

        {/* Enhanced diagonal lines with animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full">
            {[
              { id: 'line-1', position: 10, delay: '0s' },
              { id: 'line-2', position: 25, delay: '0.5s' },
              { id: 'line-3', position: 40, delay: '1s' },
              { id: 'line-4', position: 55, delay: '1.5s' },
              { id: 'line-5', position: 70, delay: '2s' },
              { id: 'line-6', position: 85, delay: '2.5s' },
              { id: 'line-7', position: 100, delay: '3s' },
              { id: 'line-8', position: 115, delay: '3.5s' },
              { id: 'line-9', position: 130, delay: '4s' },
              { id: 'line-10', position: 145, delay: '4.5s' },
            ].map((line, i) => (
              <div
                key={line.id}
                className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{
                  top: `${line.position}%`,
                  left: '-50%',
                  transform: 'rotate(-15deg)',
                  opacity: 0.5 - i * 0.04,
                  animation: 'pulse 8s ease-in-out infinite',
                  animationDelay: line.delay,
                }}
              />
            ))}
          </div>
        </div>

        {/* Particle effect (subtle dots) */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={Math.random()}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <main className="flex-1">
        {/* Enhanced hero section with more dynamic elements */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
              <div className="space-y-8 lg:col-span-3">
                <div className='inline-flex animate-fade-in items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-md'>
                  <span className="mr-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-primary text-xs">
                    New
                  </span>
                  <span className="text-muted-foreground">
                    {t('landing.badge.introducing')}
                  </span>
                </div>

                <h1
                  className='max-w-3xl animate-fade-in-up font-medium text-4xl leading-[0.95] tracking-tight md:text-6xl xl:text-7xl'
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="block text-foreground">
                    Master anything with
                  </span>
                  <span className='relative bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                    scientific precision
                    <span className='-bottom-1 absolute left-0 h-[2px] w-full bg-gradient-to-r from-primary to-transparent opacity-30' />
                  </span>
                </h1>

                <p
                  className='max-w-xl animate-fade-in-up text-lg text-muted-foreground leading-relaxed'
                  style={{ animationDelay: '0.2s' }}
                >
                  {t('landing.hero.description')}
                </p>

                <div
                  className='flex animate-fade-in-up flex-col gap-4 pt-4 sm:flex-row'
                  style={{ animationDelay: '0.3s' }}
                >
                  <Button size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10">
                      {t('landing.hero.startButton')}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
                  >
                    <BookOpenIcon className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>

                <div
                  className='flex animate-fade-in-up flex-col gap-8 pt-6'
                  style={{ animationDelay: '0.4s' }}
                >
                  {/* Refined user avatars with subtle animation */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-[140px]">
                      {[
                        {
                          id: 'avatar-1',
                          gradient: 'from-blue-400/30 to-blue-500/10',
                          position: '0%',
                        },
                        {
                          id: 'avatar-2',
                          gradient: 'from-purple-400/30 to-purple-500/10',
                          position: '20%',
                        },
                        {
                          id: 'avatar-3',
                          gradient: 'from-green-400/30 to-green-500/10',
                          position: '40%',
                        },
                        {
                          id: 'avatar-4',
                          gradient: 'from-amber-400/30 to-amber-500/10',
                          position: '60%',
                        },
                        {
                          id: 'avatar-5',
                          gradient: 'from-red-400/30 to-red-500/10',
                          position: '80%',
                        },
                      ].map((avatar) => (
                        <div
                          key={avatar.id}
                          className='absolute h-10 w-10 overflow-hidden rounded-full border border-background/50 bg-muted shadow-sm transition-all duration-300 hover:z-10 hover:scale-110 hover:border-white/20'
                          style={{ left: avatar.position }}
                        >
                          <div
                            className={`h-full w-full bg-gradient-to-br ${avatar.gradient}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <span className="font-medium text-foreground">
                        2,500+
                      </span>{' '}
                      learners already joined
                    </div>
                  </div>

                  {/* Refined trust indicators */}
                  <div className="flex flex-wrap gap-3">
                    <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                      <StarIcon className='h-3.5 w-3.5 text-amber-400/80 transition-colors group-hover:text-amber-400' />
                      <span className='text-muted-foreground transition-colors group-hover:text-foreground'>
                        4.9/5 average rating
                      </span>
                    </div>
                    <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                      <ShieldIcon className='h-3.5 w-3.5 text-primary/80 transition-colors group-hover:text-primary' />
                      <span className='text-muted-foreground transition-colors group-hover:text-foreground'>
                        Enterprise-grade security
                      </span>
                    </div>
                    <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                      <CheckCircleIcon className='h-3.5 w-3.5 text-green-400/80 transition-colors group-hover:text-green-400' />
                      <span className='text-muted-foreground transition-colors group-hover:text-foreground'>
                        Scientifically validated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className='relative animate-fade-in lg:col-span-2'
                style={{ animationDelay: '0.3s' }}
              >
                <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0">
                  <div className='group absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-primary/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-primary/10'>
                    {/* Animated gradient background */}
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-70 transition-opacity duration-500 group-hover:opacity-100' />

                    {/* Animated grid pattern */}
                    <div
                      className='absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.05]'
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />

                    {/* Glowing orb that follows mouse */}
                    <div
                      className='absolute h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100'
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'float 8s ease-in-out infinite',
                      }}
                    />

                    <div className="absolute top-0 left-0 h-full w-full p-6">
                      <div className="space-y-6">
                        {[
                          {
                            id: 'feature-active-recall',
                            icon: (
                              <BrainIcon className="h-5 w-5 text-primary" />
                            ),
                            title: 'Active Recall',
                            description: 'Test yourself to strengthen memory',
                            gradient: 'from-blue-500/20 to-blue-600/5',
                            animation: '0s',
                          },
                          {
                            id: 'feature-spaced-repetition',
                            icon: (
                              <ClockIcon className="h-5 w-5 text-primary" />
                            ),
                            title: 'Spaced Repetition',
                            description: 'Review at optimal intervals',
                            gradient: 'from-green-500/20 to-green-600/5',
                            animation: '0.1s',
                          },
                          {
                            id: 'feature-ai-learning',
                            icon: (
                              <SparklesIcon className="h-5 w-5 text-primary" />
                            ),
                            title: 'AI-Enhanced Learning',
                            description: 'Personalized learning path',
                            gradient: 'from-purple-500/20 to-purple-600/5',
                            animation: '0.2s',
                          },
                        ].map((feature, index) => (
                          <div
                            key={feature.id}
                            className='feature-card hover:-translate-y-1 group/card relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-500 hover:translate-x-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
                            style={{
                              animationDelay: feature.animation,
                              transform: 'perspective(1000px) rotateX(0deg)',
                              transformStyle: 'preserve-3d',
                            }}
                          >
                            {/* Gradient background that changes on hover */}
                            <div
                              className={`-z-10 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 ${feature.gradient}`}
                            />

                            {/* Animated border glow */}
                            <div
                              className='-z-5 absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover/card:opacity-100'
                              style={{
                                boxShadow:
                                  '0 0 15px 1px rgba(var(--color-primary-rgb), 0.3)',
                                animation: 'pulse 2s ease-in-out infinite',
                              }}
                            />

                            <div className='relative z-10 flex items-start gap-4'>
                              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 shadow-md ring-4 ring-primary/5 transition-all duration-300 group-hover/card:ring-primary/20'>
                                <div className='transform text-primary transition-transform duration-300 group-hover/card:scale-110'>
                                  {feature.icon}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className='font-medium text-sm transition-colors duration-300 group-hover/card:text-primary'>
                                  {feature.title}
                                </h3>
                                <p className='mt-1 text-muted-foreground text-xs transition-colors duration-300 group-hover/card:text-foreground/80'>
                                  {feature.description}
                                </p>

                                {/* Animated arrow that appears on hover */}
                                <div className='mt-2 flex translate-x-[-10px] transform items-center text-primary text-xs opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100'>
                                  <span>Learn more</span>
                                  <ArrowRightIcon className="ml-1 h-3 w-3 transition-transform group-hover/card:translate-x-1" />
                                </div>
                              </div>
                            </div>

                            {/* Particle effects on hover */}
                            <div className='absolute right-0 bottom-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100'>
                              {Array(5)
                                .fill(null)
                                .map((_, i) => (
                                  <div
                                    key={`${feature.id}-particle-${i}`}
                                    className="absolute rounded-full bg-primary/30"
                                    style={{
                                      width: `${Math.random() * 4 + 2}px`,
                                      height: `${Math.random() * 4 + 2}px`,
                                      bottom: `${Math.random() * 40}px`,
                                      right: `${Math.random() * 40}px`,
                                      opacity: Math.random() * 0.7,
                                      animation:
                                        'float 3s ease-in-out infinite',
                                      animationDelay: `${i * 0.4}s`,
                                    }}
                                  />
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced decorative elements */}
                  <div className='-top-4 -right-4 absolute h-32 w-32 animate-pulse-slow rounded-full bg-primary/10 blur-xl' />
                  <div
                    className='-bottom-8 -left-8 absolute h-40 w-40 animate-pulse-slow rounded-full bg-primary/10 blur-xl'
                    style={{ animationDelay: '2s' }}
                  />
                  <div
                    className='-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-24 w-24 animate-pulse-slow rounded-full bg-primary/5 blur-lg'
                    style={{ animationDelay: '1s' }}
                  />

                  {/* Floating elements around the card */}
                  <div
                    className='-top-6 absolute left-1/4 h-12 w-12 animate-float-slow rounded-full border border-white/10 bg-white/5 backdrop-blur-sm'
                    style={{ animationDelay: '0.5s' }}
                  />
                  <div
                    className='-bottom-4 absolute right-1/4 h-8 w-8 animate-float rounded-full border border-white/10 bg-white/5 backdrop-blur-sm'
                    style={{ animationDelay: '1.5s' }}
                  />
                  <div
                    className='-right-4 absolute top-1/3 h-10 w-10 rotate-12 animate-float-slow rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm'
                    style={{ animationDelay: '1s' }}
                  />

                  {/* Animated code snippets floating around */}
                  <div className='-left-12 absolute top-1/4 max-w-[120px] rotate-[-6deg] transform animate-float-slow rounded-lg border border-white/10 bg-white/5 p-2 font-mono text-[8px] text-primary/70 opacity-70 backdrop-blur-sm transition-opacity hover:opacity-100'>
                    <pre>{'function recall() {\n  return memory * 2;\n}'}</pre>
                  </div>
                  <div
                    className='-right-10 absolute bottom-1/4 max-w-[100px] rotate-[8deg] transform animate-float rounded-lg border border-white/10 bg-white/5 p-2 font-mono text-[8px] text-primary/70 opacity-70 backdrop-blur-sm transition-opacity hover:opacity-100'
                    style={{ animationDelay: '2s' }}
                  >
                    <pre>{'const interval = \nlastReview * 2.5;'}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced features section with staggered layout */}
        <section id="features" className="relative py-24">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className='container relative mx-auto px-4 md:px-6'>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className='mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm'>
                <span className="text-muted-foreground">Backed by Science</span>
              </div>
              <h2 className="mb-4 font-medium text-3xl md:text-4xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Science-backed
                </span>{' '}
                learning methods
              </h2>
              <p className='mx-auto max-w-2xl text-muted-foreground'>
                Our platform is built on proven cognitive science principles to
                maximize your learning efficiency and retention.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: <BrainIcon className="h-6 w-6" />,
                  title: 'Active Recall',
                  description:
                    'Test yourself to strengthen neural connections and improve long-term memory retention.',
                },
                {
                  icon: <ClockIcon className="h-6 w-6" />,
                  title: 'Spaced Repetition',
                  description:
                    'Review material at scientifically optimized intervals to prevent forgetting.',
                },
                {
                  icon: <SparklesIcon className="h-6 w-6" />,
                  title: 'AI-Enhanced Learning',
                  description:
                    'Personalized learning paths adapted to your progress and learning style.',
                },
              ].map((feature, idx) => (
                <div
                  key={feature.title}
                  className='group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/10">
                    <div className="text-primary">{feature.icon}</div>
                  </div>

                  <h3 className="mb-2 font-medium text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>

                  <div className="mt-4 flex items-center text-primary text-sm group-hover:underline">
                    Learn more
                    <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Code snippet preview */}
            <div className='mx-auto mt-20 max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm'>
              <div className='flex items-center justify-between border-white/10 border-b px-4 py-2'>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/50" />
                  <div className="h-3 w-3 rounded-full bg-green-400/50" />
                </div>
                <div className='text-muted-foreground text-xs'>
                  gradual-algorithm.ts
                </div>
                <div />
              </div>
              <div className='overflow-x-auto p-4 font-mono text-muted-foreground text-sm'>
                <pre className="text-xs">
                  <code>
                    {`// Gradual's Spaced Repetition Algorithm
function calculateNextReviewDate(
  difficulty: number,  // 0-1 scale of item difficulty
  consecutiveCorrect: number,  // number of times correctly recalled
  lastInterval: number  // previous interval in days
): number {
  const baseMultiplier = 2.5;
  const difficultyFactor = 1 - (difficulty * 0.5);
  const correctnessFactor = Math.min(2, 1 + (consecutiveCorrect * 0.2));
  
  // Calculate new interval with exponential backoff
  const newInterval = lastInterval * baseMultiplier * 
                      difficultyFactor * correctnessFactor;
                      
  // Apply randomization to prevent clustering
  const jitter = 0.95 + (Math.random() * 0.1);
  
  return Math.round(newInterval * jitter);
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced stats section with dynamic elements */}
        <section className='relative bg-white/5 py-24'>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

          <div className='container relative mx-auto px-4 md:px-6'>
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  <span className="text-muted-foreground">Real Results</span>
                </div>
                <h2 className="font-medium text-3xl md:text-4xl">
                  Proven results for{' '}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    thousands of learners
                  </span>
                </h2>
                <p className="max-w-md text-muted-foreground">
                  Our platform has helped students and professionals achieve
                  their learning goals with greater efficiency and retention.
                </p>

                <div className="space-y-4 pt-4">
                  {[
                    { label: 'Average retention increase', value: '215%' },
                    { label: 'Time saved on studying', value: '60%' },
                  ].map((stat, idx) => (
                    <div key={stat.label} className="flex items-center gap-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <div className="font-medium">{stat.value}</div>
                      <div className="text-muted-foreground text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
                  >
                    <Link href="/success-stories" className="flex items-center">
                      View Success Stories
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    label: 'Active Learners',
                    value: '10,000+',
                    delay: '0',
                    icon: <UsersIcon className="h-5 w-5 text-primary/70" />,
                  },
                  {
                    label: 'Retention Rate',
                    value: '94%',
                    delay: '100',
                    icon: <BrainIcon className="h-5 w-5 text-primary/70" />,
                  },
                  {
                    label: 'Courses Created',
                    value: '500+',
                    delay: '200',
                    icon: <BookOpenIcon className="h-5 w-5 text-primary/70" />,
                  },
                  {
                    label: 'Success Rate',
                    value: '89%',
                    delay: '300',
                    icon: (
                      <CheckCircleIcon className="h-5 w-5 text-primary/70" />
                    ),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className='group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
                    style={{ animationDelay: `${stat.delay}ms` }}
                  >
                    <div className='mb-3 flex items-center gap-3'>
                      {stat.icon}
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                    </div>
                    <div className='mb-2 font-medium text-3xl transition-colors group-hover:text-primary'>
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced waitlist section with unique design */}
        <section className="relative overflow-hidden py-24">
          <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

          {/* Decorative elements */}
          <div className='-translate-y-1/3 absolute top-0 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-primary/10 blur-3xl' />
          <div className='-translate-x-1/3 absolute bottom-0 left-0 h-64 w-64 translate-y-1/3 rounded-full bg-primary/10 blur-3xl' />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className='relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm md:p-12'>
                <div className="-z-10 -translate-y-1/2 absolute top-0 right-0 h-64 w-64 translate-x-1/2 transform rounded-full bg-primary/10 blur-3xl" />
                <div className="-z-10 -translate-x-1/2 absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 transform rounded-full bg-primary/10 blur-3xl" />

                <div className="relative space-y-6">
                  <div className='mx-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm'>
                    <span className="mr-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-primary text-xs">
                      Beta
                    </span>
                    <span className="text-muted-foreground">
                      Limited Access
                    </span>
                  </div>

                  <div className="space-y-2 text-center">
                    <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-medium text-3xl text-transparent md:text-4xl">
                      {t('landing.waitlist.title')}
                    </h2>
                    <p className="mx-auto max-w-lg text-muted-foreground">
                      {t('landing.waitlist.description')}
                    </p>
                  </div>

                  <WaitlistForm />

                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    {[
                      { text: 'No credit card required', id: 'no-cc' },
                      { text: 'Cancel anytime', id: 'cancel' },
                      { text: '14-day free trial', id: 'trial' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center gap-2 text-muted-foreground text-xs'
                      >
                        <CheckCircleIcon className="h-3.5 w-3.5 text-primary/70" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
