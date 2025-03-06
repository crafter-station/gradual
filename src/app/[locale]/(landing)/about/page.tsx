import {
  ArrowRightIcon,
  BookOpenIcon,
  GlobeIcon,
  HeartIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradualLogo } from '@/components/gradual-logo';

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
              <span className="text-muted-foreground">Our Story</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">
                Transforming Education
              </span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                One Mind at a Time
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Gradual was founded with a simple mission: to make effective
              learning accessible to everyone. We believe that with the right
              tools and methods, anyone can master any subject.
            </p>
          </div>
        </div>
      </section>

      {/* Our mission section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-medium text-3xl md:text-4xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <p className="text-muted-foreground">
                At Gradual, we're on a mission to revolutionize how people learn
                by combining cutting-edge cognitive science with innovative
                technology. We believe that education should be efficient,
                engaging, and accessible to everyone, regardless of background
                or learning style.
              </p>
              <p className="text-muted-foreground">
                Our platform is designed to adapt to each learner's unique
                needs, providing personalized learning experiences that maximize
                retention and understanding. By leveraging proven scientific
                principles, we help learners achieve their goals faster and with
                greater confidence.
              </p>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="border-white/10 bg-transparent hover:border-white/20"
                >
                  Learn More About Our Approach
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0">
              <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

                <div className="absolute top-0 left-0 h-full w-full p-6">
                  <div className='flex h-full flex-col items-center justify-center'>
                    <GradualLogo
                      width={200}
                      height={200}
                      className='mb-6 text-primary'
                    />
                    <div className="text-center">
                      <h3 className='mb-2 font-medium text-xl'>Gradual</h3>
                      <p className='max-w-xs text-muted-foreground text-sm'>
                        Founded in 2023 with the vision of making effective
                        learning accessible to everyone through science-backed
                        methods.
                      </p>
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

      {/* Values section */}
      <section className='relative bg-white/5 py-24'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-muted-foreground">
              These core principles guide everything we do at Gradual.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <ZapIcon className="h-6 w-6" />,
                title: 'Efficiency',
                description:
                  'We believe learning should be efficient. Our methods are designed to help you learn more in less time, focusing on what matters most.',
              },
              {
                icon: <UsersIcon className="h-6 w-6" />,
                title: 'Accessibility',
                description:
                  'Education should be accessible to everyone. We are committed to creating tools that work for diverse learning styles and backgrounds.',
              },
              {
                icon: <HeartIcon className="h-6 w-6" />,
                title: 'Empowerment',
                description:
                  'We empower learners to take control of their education. Our platform provides the tools and insights needed for self-directed learning.',
              },
              {
                icon: <GlobeIcon className="h-6 w-6" />,
                title: 'Global Impact',
                description:
                  'We aim to make a positive impact on education worldwide, breaking down barriers to knowledge and fostering a culture of lifelong learning.',
              },
              {
                icon: <BookOpenIcon className="h-6 w-6" />,
                title: 'Evidence-Based',
                description:
                  'Our methods are grounded in scientific research. We continuously refine our approach based on the latest findings in cognitive science.',
              },
              {
                icon: <ZapIcon className="h-6 w-6" />,
                title: 'Innovation',
                description:
                  'We are constantly innovating to improve the learning experience. Our team is dedicated to pushing the boundaries of educational technology.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <div className="text-primary">{value.icon}</div>
                </div>

                <h3 className="mb-2 font-medium text-xl">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Our Team
              </span>
            </h2>
            <p className="text-muted-foreground">
              Meet the passionate individuals behind Gradual who are dedicated
              to transforming education.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                name: 'Alex Chen',
                role: 'Founder & CEO',
                bio: 'Former cognitive science researcher with a passion for making education more effective and accessible.',
                gradient: 'from-blue-400/30 to-blue-500/10',
              },
              {
                name: 'Maya Rodriguez',
                role: 'Chief Learning Officer',
                bio: 'Educational psychologist with 15+ years of experience designing learning systems that work with human cognition.',
                gradient: 'from-purple-400/30 to-purple-500/10',
              },
              {
                name: 'David Kim',
                role: 'CTO',
                bio: 'AI specialist focused on creating adaptive learning algorithms that personalize the educational experience.',
                gradient: 'from-green-400/30 to-green-500/10',
              },
              {
                name: 'Sarah Johnson',
                role: 'Head of Product',
                bio: 'Former educator turned product designer, passionate about creating intuitive learning experiences.',
                gradient: 'from-amber-400/30 to-amber-500/10',
              },
              {
                name: 'James Wilson',
                role: 'Lead Engineer',
                bio: 'Full-stack developer with expertise in building scalable educational platforms and interactive learning tools.',
                gradient: 'from-red-400/30 to-red-500/10',
              },
              {
                name: 'Priya Patel',
                role: 'Learning Experience Designer',
                bio: 'Combines expertise in UX design and educational psychology to create engaging learning journeys.',
                gradient: 'from-cyan-400/30 to-cyan-500/10',
              },
              {
                name: 'Michael Torres',
                role: 'Data Scientist',
                bio: 'Analyzes learning patterns to continuously improve our algorithms and personalization features.',
                gradient: 'from-indigo-400/30 to-indigo-500/10',
              },
              {
                name: 'Emma Lewis',
                role: 'Community Manager',
                bio: 'Builds and nurtures our community of learners, gathering feedback to improve the platform.',
                gradient: 'from-pink-400/30 to-pink-500/10',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className='mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-background'>
                  <div
                    className={`h-full w-full bg-gradient-to-br ${member.gradient}`}
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-medium text-lg">{member.name}</h3>
                  <p className='mb-2 text-primary text-sm'>{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join us section */}
      <section className="relative overflow-hidden py-24">
        <div className="-z-10 absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
              <div className="-z-10 -translate-y-1/2 absolute top-0 right-0 h-64 w-64 translate-x-1/2 transform rounded-full bg-primary/10 blur-3xl" />
              <div className="-z-10 -translate-x-1/2 absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 transform rounded-full bg-primary/10 blur-3xl" />

              <div className="relative space-y-6 text-center">
                <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-medium text-3xl text-transparent md:text-4xl">
                  Join Our Mission
                </h2>
                <p className="mx-auto max-w-lg text-muted-foreground">
                  We are always looking for passionate individuals who share our
                  vision of transforming education. Whether you are an educator,
                  developer, designer, or simply passionate about learning, we
                  would love to hear from you.
                </p>

                <div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
                  <Button size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10">View Open Positions</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/10 bg-transparent hover:border-white/20"
                  >
                    Contact Us
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
