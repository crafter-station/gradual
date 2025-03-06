import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  ClockIcon,
  SparklesIcon,
  BookIcon,
  LightbulbIcon,
  LayoutGridIcon,
  PuzzleIcon,
  TargetIcon,
  UsersIcon,
  ZapIcon,
  GlobeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FeaturesPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
              <span className="text-muted-foreground">Platform Features</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">Powerful Tools for</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Effective Learning
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Discover the innovative features that make Gradual a revolutionary
              platform for mastering any subject with scientific precision and
              personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Core features section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Core Features
              </span>
            </h2>
            <p className="text-muted-foreground">
              Our platform combines these powerful features to create a
              comprehensive learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <BrainIcon className="h-6 w-6" />,
                title: 'Active Recall Testing',
                description:
                  'Strengthen memory through scientifically-designed quizzes and tests that prompt you to retrieve information from memory rather than passively reviewing it.',
              },
              {
                icon: <ClockIcon className="h-6 w-6" />,
                title: 'Spaced Repetition System',
                description:
                  'Our algorithm schedules reviews at optimal intervals to ensure long-term retention, showing you items just before you would naturally forget them.',
              },
              {
                icon: <SparklesIcon className="h-6 w-6" />,
                title: 'AI-Powered Personalization',
                description:
                  'Advanced algorithms analyze your performance to create a personalized learning path, focusing more time on challenging concepts and less on mastered material.',
              },
              {
                icon: <LayoutGridIcon className="h-6 w-6" />,
                title: 'Comprehensive Dashboard',
                description:
                  'Track your progress with detailed analytics and insights, helping you understand your strengths and areas for improvement at a glance.',
              },
              {
                icon: <PuzzleIcon className="h-6 w-6" />,
                title: 'Diverse Learning Formats',
                description:
                  'Engage with content through multiple formats including flashcards, quizzes, interactive exercises, and real-world problem-solving scenarios.',
              },
              {
                icon: <UsersIcon className="h-6 w-6" />,
                title: 'Collaborative Learning',
                description:
                  'Share decks, compete on leaderboards, and learn together with friends or classmates to enhance motivation and engagement.',
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature spotlight section */}
      <section className='relative bg-white/5 py-24'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-medium text-3xl md:text-4xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Adaptive Learning
                </span>{' '}
                Technology
              </h2>
              <p className="text-muted-foreground">
                Our adaptive learning system continuously analyzes your
                performance to create a personalized learning experience that
                evolves with you. The more you use Gradual, the smarter it
                becomes at optimizing your study time.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Performance Analysis',
                    description:
                      'Sophisticated algorithms track your response times, error patterns, and learning curves to identify your unique learning profile.',
                  },
                  {
                    title: 'Dynamic Difficulty Adjustment',
                    description:
                      'Content difficulty automatically adjusts based on your mastery level, keeping you in the optimal challenge zone for learning.',
                  },
                  {
                    title: 'Personalized Review Schedule',
                    description:
                      'Your review schedule is continuously optimized based on your forgetting curves for different types of information.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className='mt-1 text-muted-foreground text-sm'>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="border-white/10 bg-transparent hover:border-white/20"
                >
                  Learn How It Works
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0">
              <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

                <div className="absolute top-0 left-0 h-full w-full p-6">
                  <div className='flex h-full flex-col items-center justify-center'>
                    <div className="w-full max-w-xs">
                      <div className="mb-8 text-center">
                        <LightbulbIcon className='mx-auto mb-4 h-12 w-12 text-primary/70' />
                        <h3 className="font-medium text-lg">
                          Learning Efficiency
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Traditional Methods</span>
                            <span className="font-medium">100 hours</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-white/20"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Gradual Platform</span>
                            <span className="font-medium">40 hours</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: '40%' }}
                            />
                          </div>
                          <p className='text-right text-primary text-xs'>
                            60% time savings
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="-top-4 -right-4 absolute h-24 w-24 rounded-full bg-primary/10 blur-xl" />
              <div className="-bottom-8 -left-8 absolute h-32 w-32 rounded-full bg-primary/10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Use cases section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Perfect For
              </span>
            </h2>
            <p className="text-muted-foreground">
              Gradual adapts to various learning needs and contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <BookIcon className="h-6 w-6" />,
                title: 'Students',
                description:
                  'Master course material more efficiently, prepare for exams with confidence, and retain knowledge long-term.',
              },
              {
                icon: <TargetIcon className="h-6 w-6" />,
                title: 'Professionals',
                description:
                  'Stay current in your field, acquire new skills, and prepare for certifications or career advancement.',
              },
              {
                icon: <GlobeIcon className="h-6 w-6" />,
                title: 'Language Learners',
                description:
                  'Build vocabulary, master grammar, and develop conversational skills through optimized practice.',
              },
              {
                icon: <ZapIcon className="h-6 w-6" />,
                title: 'Lifelong Learners',
                description:
                  'Pursue personal interests and hobbies with a system that helps you retain what you learn.',
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <div className="text-primary">{useCase.icon}</div>
                </div>

                <h3 className="mb-2 font-medium text-xl">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative overflow-hidden py-24">
        <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
              <div className="-z-10 -translate-y-1/2 absolute top-0 right-0 h-64 w-64 translate-x-1/2 transform rounded-full bg-primary/10 blur-3xl" />
              <div className="-z-10 -translate-x-1/2 absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 transform rounded-full bg-primary/10 blur-3xl" />

              <div className="relative space-y-6 text-center">
                <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-medium text-3xl text-transparent md:text-4xl">
                  Ready to transform your learning?
                </h2>
                <p className="mx-auto max-w-lg text-muted-foreground">
                  Experience the power of science-backed learning methods and
                  see the difference in your retention and understanding.
                </p>

                <div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
                  <Button size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10">Get Started Free</span>
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
                    View Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
