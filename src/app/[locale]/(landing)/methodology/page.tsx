import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  ClockIcon,
  SparklesIcon,
  BarChart2Icon,
  BookIcon,
  GraduationCapIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MethodologyPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
              <span className="text-muted-foreground">Our Approach</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">The Science Behind</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Effective Learning
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Gradual's methodology is built on decades of cognitive science
              research, combining proven learning techniques with cutting-edge
              technology to create a personalized learning experience that
              maximizes retention and understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Core principles section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Core Principles
              </span>
            </h2>
            <p className="text-muted-foreground">
              Our platform is built on these fundamental cognitive science
              principles that have been proven to enhance learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <BrainIcon className="h-6 w-6" />,
                title: 'Active Recall',
                description:
                  'The practice of actively stimulating memory during the learning process. Instead of passively consuming information, we prompt you to retrieve knowledge from memory, strengthening neural pathways.',
              },
              {
                icon: <ClockIcon className="h-6 w-6" />,
                title: 'Spaced Repetition',
                description:
                  'A technique that involves reviewing information at increasing intervals. This method leverages the psychological spacing effect, which demonstrates that information is more effectively encoded into long-term memory when studied over time.',
              },
              {
                icon: <SparklesIcon className="h-6 w-6" />,
                title: 'Interleaved Practice',
                description:
                  'Mixing different topics or types of problems within a single study session. This approach improves the ability to discriminate between different types of problems and select appropriate strategies for each.',
              },
            ].map((principle) => (
              <div
                key={principle.title}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <div className="text-primary">{principle.icon}</div>
                </div>

                <h3 className="mb-2 font-medium text-xl">{principle.title}</h3>
                <p className="text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research-backed section */}
      <section className='relative bg-white/5 py-24'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-medium text-3xl md:text-4xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Research-Backed
                </span>{' '}
                Methodology
              </h2>
              <p className="text-muted-foreground">
                Our approach is grounded in decades of cognitive science
                research and educational psychology. We've synthesized findings
                from hundreds of studies to create a learning system that works
                with your brain, not against it.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Ebbinghaus Forgetting Curve',
                    description:
                      'Our spaced repetition algorithms are designed to counteract the natural forgetting curve identified by Hermann Ebbinghaus in the 19th century.',
                  },
                  {
                    title: 'Retrieval Practice Effect',
                    description:
                      'Research by Roediger and Karpicke (2006) demonstrated that the act of retrieving information strengthens memory more effectively than re-reading or reviewing.',
                  },
                  {
                    title: 'Desirable Difficulty',
                    description:
                      'We incorporate the concept of "desirable difficulty" introduced by Robert Bjork, making learning challenging enough to promote deep processing without overwhelming.',
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
                  Explore Our Research
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
                        <BarChart2Icon className='mx-auto mb-4 h-12 w-12 text-primary/70' />
                        <h3 className="font-medium text-lg">
                          Retention Rate Comparison
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            method: 'Traditional Learning',
                            rate: 20,
                            color: 'bg-white/20',
                          },
                          {
                            method: 'Active Recall',
                            rate: 60,
                            color: 'bg-primary/40',
                          },
                          {
                            method: 'Gradual Method',
                            rate: 85,
                            color: 'bg-primary',
                          },
                        ].map((item) => (
                          <div key={item.method} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.method}</span>
                              <span className="font-medium">{item.rate}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/5">
                              <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${item.rate}%` }}
                              />
                            </div>
                          </div>
                        ))}
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

      {/* Learning process section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              The Gradual{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Learning Process
              </span>
            </h2>
            <p className="text-muted-foreground">
              Our methodology follows a structured approach to ensure maximum
              retention and understanding.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className='-translate-x-1/2 absolute top-0 left-1/2 h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-transparent' />

            {[
              {
                icon: <BookIcon className="h-6 w-6" />,
                title: 'Initial Learning',
                description:
                  'Begin with focused, distraction-free content consumption to build a foundation of knowledge.',
                align: 'right',
              },
              {
                icon: <BrainIcon className="h-6 w-6" />,
                title: 'Active Recall Testing',
                description:
                  'Test your understanding through various question formats designed to strengthen memory retrieval.',
                align: 'left',
              },
              {
                icon: <ClockIcon className="h-6 w-6" />,
                title: 'Spaced Review',
                description:
                  'Review material at scientifically optimized intervals to prevent forgetting and reinforce learning.',
                align: 'right',
              },
              {
                icon: <SparklesIcon className="h-6 w-6" />,
                title: 'AI-Powered Adaptation',
                description:
                  'Our system adapts to your performance, focusing more time on challenging concepts and less on mastered material.',
                align: 'left',
              },
              {
                icon: <GraduationCapIcon className="h-6 w-6" />,
                title: 'Mastery Achievement',
                description:
                  'Reach a high level of proficiency through consistent practice and reinforcement of key concepts.',
                align: 'right',
              },
            ].map((step, index) => (
              <div key={step.title} className="relative mb-16 last:mb-0">
                <div
                  className={`flex items-start gap-8 ${
                    step.align === 'left' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    <div
                      className={`rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm ${
                        step.align === 'left'
                          ? 'rounded-tr-none'
                          : 'rounded-tl-none'
                      }`}
                    >
                      <h3 className="mb-2 font-medium text-xl">{step.title}</h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex h-16 w-16 flex-none items-center justify-center">
                    <div className='-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-12 w-12 rounded-full border border-white/20 bg-background' />
                    <div className='-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-10 w-10 rounded-full bg-primary/20' />
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      {step.icon}
                    </div>
                  </div>

                  <div className="flex-1" />
                </div>
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
                    <span className="relative z-10">Get Started</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
