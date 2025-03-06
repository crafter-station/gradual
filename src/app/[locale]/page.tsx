import { GradualLogo } from '@/components/gradual-logo';
import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { WaitlistForm } from './form';
import Link from 'next/link';
import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  SparklesIcon,
  ClockIcon,
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
      {/* Advanced background with layered elements */}
      <div className="-z-10 fixed inset-0 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Abstract shapes */}
        <div
          className="absolute top-1/4 left-[15%] h-[400px] w-[400px] animate-float-slow"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-blue) 0%, transparent 70%)',
            opacity: 0.15,
            filter: 'blur(60px)',
            animation: 'float 20s ease-in-out infinite',
            transformOrigin: 'center center',
          }}
        />
        <div
          className="absolute right-[15%] bottom-1/3 h-[350px] w-[350px] animate-float"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-green) 0%, transparent 70%)',
            opacity: 0.12,
            filter: 'blur(50px)',
            animation: 'float 25s ease-in-out infinite reverse',
            transformOrigin: '60% 40%',
          }}
        />

        {/* Diagonal lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full">
            {[
              { id: 'line-1', position: 10 },
              { id: 'line-2', position: 25 },
              { id: 'line-3', position: 40 },
              { id: 'line-4', position: 55 },
              { id: 'line-5', position: 70 },
              { id: 'line-6', position: 85 },
              { id: 'line-7', position: 100 },
              { id: 'line-8', position: 115 },
            ].map((line, i) => (
              <div
                key={line.id}
                className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{
                  top: `${line.position}%`,
                  left: '-50%',
                  transform: 'rotate(-15deg)',
                  opacity: 0.5 - i * 0.05,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Asymmetrical header with dynamic elements */}
      <header className="relative z-10 w-full border-white/5 border-b">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <GradualLogo width={32} height={32} className="text-primary" />
            <span className="font-mono text-lg tracking-tight">Gradual</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="group relative text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Features
              <span className="-bottom-1 absolute left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#methodology"
              className="group relative text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Methodology
              <span className="-bottom-1 absolute left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#about"
              className="group relative text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              About
              <span className="-bottom-1 absolute left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden border-white/10 bg-transparent hover:border-white/20 sm:flex"
            >
              Sign In
            </Button>
            <Button size="sm" className="group relative overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section with asymmetrical layout */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
              <div className="space-y-8 lg:col-span-3">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  <span className="mr-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-primary text-xs">
                    New
                  </span>
                  <span className="text-muted-foreground">
                    {t('landing.badge.introducing')}
                  </span>
                </div>

                <h1 className="max-w-3xl font-medium text-4xl leading-[0.95] tracking-tight md:text-6xl xl:text-7xl">
                  <span className="block text-foreground">
                    Master anything with
                  </span>
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    scientific precision
                  </span>
                </h1>

                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                  {t('landing.hero.description')}
                </p>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
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
                    className="border-white/10 bg-transparent hover:border-white/20"
                  >
                    <BookOpenIcon className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <div className="-space-x-2 flex">
                    {[
                      {
                        id: 'avatar-1',
                        gradient: 'from-blue-400/30 to-blue-500/10',
                      },
                      {
                        id: 'avatar-2',
                        gradient: 'from-purple-400/30 to-purple-500/10',
                      },
                      {
                        id: 'avatar-3',
                        gradient: 'from-green-400/30 to-green-500/10',
                      },
                      {
                        id: 'avatar-4',
                        gradient: 'from-amber-400/30 to-amber-500/10',
                      },
                    ].map((avatar) => (
                      <div
                        key={avatar.id}
                        className="h-8 w-8 overflow-hidden rounded-full border-2 border-background bg-muted"
                      >
                        <div
                          className={`h-full w-full bg-gradient-to-br ${avatar.gradient}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">2,500+</span>{' '}
                    learners already joined
                  </div>
                </div>
              </div>

              <div className="relative lg:col-span-2">
                <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0">
                  <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

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
                          },
                          {
                            id: 'feature-spaced-repetition',
                            icon: (
                              <ClockIcon className="h-5 w-5 text-primary" />
                            ),
                            title: 'Spaced Repetition',
                            description: 'Review at optimal intervals',
                          },
                          {
                            id: 'feature-ai-learning',
                            icon: (
                              <SparklesIcon className="h-5 w-5 text-primary" />
                            ),
                            title: 'AI-Enhanced Learning',
                            description: 'Personalized learning path',
                          },
                        ].map((feature) => (
                          <div
                            key={feature.id}
                            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                {feature.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-sm">
                                  {feature.title}
                                </h3>
                                <p className="mt-1 text-muted-foreground text-xs">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="-top-4 -right-4 absolute h-24 w-24 rounded-full bg-primary/10 blur-xl" />
                  <div className="-bottom-8 -left-8 absolute h-32 w-32 rounded-full bg-primary/10 blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section with staggered layout */}
        <section id="features" className="relative py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 font-medium text-3xl md:text-4xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Science-backed
                </span>{' '}
                learning methods
              </h2>
              <p className="text-muted-foreground">
                Our platform is built on proven cognitive science principles to
                maximize your learning efficiency.
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
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
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
          </div>
        </section>

        {/* Stats section with dynamic elements */}
        <section className="relative py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
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

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="border-white/10 bg-transparent hover:border-white/20"
                  >
                    View Success Stories
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Active Learners', value: '10,000+', delay: '0' },
                  { label: 'Retention Rate', value: '94%', delay: '100' },
                  { label: 'Courses Created', value: '500+', delay: '200' },
                  { label: 'Success Rate', value: '89%', delay: '300' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                    style={{ animationDelay: `${stat.delay}ms` }}
                  >
                    <div className="mb-2 font-medium text-3xl">
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

        {/* Waitlist section with unique design */}
        <section className="relative overflow-hidden py-24">
          <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
                <div className="-z-10 -translate-y-1/2 absolute top-0 right-0 h-64 w-64 translate-x-1/2 transform rounded-full bg-primary/10 blur-3xl" />
                <div className="-z-10 -translate-x-1/2 absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 transform rounded-full bg-primary/10 blur-3xl" />

                <div className="relative space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-medium text-3xl text-transparent md:text-4xl">
                      {t('landing.waitlist.title')}
                    </h2>
                    <p className="mx-auto max-w-lg text-muted-foreground">
                      {t('landing.waitlist.description')}
                    </p>
                  </div>

                  <WaitlistForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with original structure but enhanced styling */}
      <footer className="border-border/10 border-t bg-background/50 py-16 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GradualLogo width={28} height={28} className="text-primary" />
                <span className="font-mono text-lg tracking-tight">
                  Gradual
                </span>
              </div>
              <p className="max-w-xs text-muted-foreground text-sm">
                Redefining self-directed learning with an emphasis on efficiency
                and engagement through scientific principles.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#methodology"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://docs.google.com/document/d/1kOZ_caLqJvJDXPQlEduQfuKQnJCYlCdxRtZs8emLJW4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.google.com/document/d/1HomOFWn-_bIMSOyykRzRMS0PJWUpSL8WxQ_QXnbc5eM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-border/10 border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Gradual. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
