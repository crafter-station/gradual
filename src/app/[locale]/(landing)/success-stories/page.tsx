import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  ClockIcon,
  StarIcon,
  QuoteIcon,
  GraduationCapIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuccessStoriesPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="text-muted-foreground">Real Results</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">
                Success Stories from
              </span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Our Community
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Discover how learners from around the world have transformed their
              learning experience and achieved remarkable results with Gradual's
              scientific approach.
            </p>
          </div>
        </div>
      </section>

      {/* Stats overview section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
            {[
              {
                value: '94%',
                label: 'Retention Rate',
                icon: <BrainIcon className="h-5 w-5 text-primary/70" />,
              },
              {
                value: '215%',
                label: 'Learning Efficiency',
                icon: <TrendingUpIcon className="h-5 w-5 text-primary/70" />,
              },
              {
                value: '60%',
                label: 'Time Saved',
                icon: <ClockIcon className="h-5 w-5 text-primary/70" />,
              },
              {
                value: '10,000+',
                label: 'Active Learners',
                icon: <UsersIcon className="h-5 w-5 text-primary/70" />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className='rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10'
              >
                <div className='mb-3 flex items-center gap-3'>
                  {stat.icon}
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
                <div className="mb-2 font-medium text-3xl text-foreground">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured success stories */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Featured Stories
              </span>
            </h2>
            <p className="text-muted-foreground">
              Real experiences from students, professionals, and lifelong
              learners who have transformed their learning journey with Gradual.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Medical Student',
                image: '/avatars/sarah.jpg',
                quote:
                  'Gradual helped me master complex medical terminology in half the time it would have taken with traditional methods. My retention rate improved dramatically.',
                stats: { retention: '+85%', time: '-40%' },
                subject: 'Medicine',
              },
              {
                name: 'David Chen',
                role: 'Software Engineer',
                image: '/avatars/david.jpg',
                quote:
                  'Learning new programming languages used to take months. With Gradual, I can pick up the fundamentals in weeks while maintaining better long-term recall.',
                stats: { retention: '+92%', time: '-60%' },
                subject: 'Computer Science',
              },
              {
                name: 'Maya Patel',
                role: 'Language Enthusiast',
                image: '/avatars/maya.jpg',
                quote:
                  "I've tried countless language apps, but Gradual's approach to vocabulary acquisition is revolutionary. I'm retaining words I learned months ago.",
                stats: { retention: '+78%', time: '-35%' },
                subject: 'Languages',
              },
            ].map((story) => (
              <div
                key={story.name}
                className='group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
              >
                {/* Subtle gradient background */}
                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

                <div className="relative z-10">
                  <div className='mb-6 flex items-start gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/10'>
                      <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/10" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{story.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {story.role}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <QuoteIcon className='mb-2 h-6 w-6 text-primary/40' />
                    <p className="text-muted-foreground leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className='mb-4 flex items-center gap-4'>
                    <div className="flex items-center gap-1">
                      <GraduationCapIcon className="h-4 w-4 text-primary/70" />
                      <span className='text-muted-foreground text-sm'>
                        {story.subject}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-amber-400/80" />
                      <StarIcon className="h-4 w-4 text-amber-400/80" />
                      <StarIcon className="h-4 w-4 text-amber-400/80" />
                      <StarIcon className="h-4 w-4 text-amber-400/80" />
                      <StarIcon className="h-4 w-4 text-amber-400/80" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className='text-muted-foreground text-xs'>
                        Retention
                      </div>
                      <div className="font-medium text-lg text-primary">
                        {story.stats.retention}
                      </div>
                    </div>
                    <div className="flex-1 rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className='text-muted-foreground text-xs'>
                        Time Saved
                      </div>
                      <div className="font-medium text-lg text-primary">
                        {story.stats.time}
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 border-white/10 border-t pt-6'>
                    <Button
                      variant="ghost"
                      size="sm"
                      className='w-full justify-between text-primary hover:bg-white/5 hover:text-primary/80'
                    >
                      Read full story
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
            >
              View More Success Stories
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Results by field section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              Results by{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Field of Study
              </span>
            </h2>
            <p className="text-muted-foreground">
              Gradual's methodology has proven effective across diverse
              disciplines and learning objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                field: 'Language Learning',
                description:
                  'From vocabulary acquisition to grammar mastery, language learners see dramatic improvements in retention and fluency development.',
                stats: [
                  { label: 'Vocabulary Retention', value: '87%' },
                  { label: 'Grammar Mastery', value: '76%' },
                  { label: 'Time to Fluency', value: '-40%' },
                ],
                color: 'from-blue-500/20 to-blue-600/5',
              },
              {
                field: 'STEM Subjects',
                description:
                  'Complex mathematical concepts, scientific principles, and technical knowledge are retained longer and with greater understanding.',
                stats: [
                  { label: 'Concept Retention', value: '92%' },
                  { label: 'Problem-Solving Speed', value: '+65%' },
                  { label: 'Test Performance', value: '+43%' },
                ],
                color: 'from-green-500/20 to-green-600/5',
              },
            ].map((field) => (
              <div
                key={field.field}
                className='relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-10 ${field.color}`}
                />

                <div className="relative z-10">
                  <h3 className='mb-3 font-medium text-2xl'>{field.field}</h3>
                  <p className='mb-6 text-muted-foreground'>
                    {field.description}
                  </p>

                  <div className="space-y-4">
                    {field.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between"
                      >
                        <div className="text-muted-foreground">
                          {stat.label}
                        </div>
                        <div className="font-medium text-lg">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-6 border-white/10 border-t pt-6'>
                    <Button
                      variant="ghost"
                      size="sm"
                      className='p-0 text-primary hover:bg-white/5 hover:text-primary/80'
                    >
                      View case studies
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial carousel section */}
      <section className='relative bg-white/5 py-24'>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className='mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm'>
              <span className="text-muted-foreground">Testimonials</span>
            </div>
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
          </div>

          <div className='relative mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm md:p-12'>
            <div className="-z-10 -translate-y-1/2 absolute top-0 right-0 h-64 w-64 translate-x-1/2 transform rounded-full bg-primary/10 blur-3xl" />
            <div className="-z-10 -translate-x-1/2 absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 transform rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">
              <QuoteIcon className='mx-auto mb-6 h-12 w-12 text-primary/20' />

              <p className='mb-8 text-center text-xl leading-relaxed'>
                "Gradual has completely transformed how I approach learning. The
                combination of active recall and spaced repetition has helped me
                retain information I would have otherwise forgotten. It's like
                having a personal tutor that knows exactly when I need to review
                something."
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/10'>
                  <div className="h-full w-full bg-gradient-to-br from-purple-400/30 to-purple-500/10" />
                </div>
                <div>
                  <div className="font-medium">Michael Torres</div>
                  <div className="text-muted-foreground text-sm">
                    PhD Student, Neuroscience
                  </div>
                </div>
              </div>

              <div className='mt-8 flex justify-center gap-2'>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-white/10 bg-white/5"
                >
                  <ArrowRightIcon className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-white/10 bg-white/5"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className='relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12'>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

            {/* Decorative elements */}
            <div className='-translate-y-1/3 absolute top-0 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-primary/10 blur-3xl' />
            <div className='-translate-x-1/3 absolute bottom-0 left-0 h-64 w-64 translate-y-1/3 rounded-full bg-primary/10 blur-3xl' />

            <div className="relative z-10 text-center">
              <h2 className='mb-6 font-medium text-3xl md:text-4xl'>
                Ready to{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  transform
                </span>{' '}
                your learning?
              </h2>
              <p className='mx-auto mb-8 max-w-xl text-muted-foreground'>
                Join thousands of learners who have already discovered the power
                of scientifically-backed learning methods with Gradual.
              </p>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Get Started for Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
                >
                  <BookOpenIcon className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
