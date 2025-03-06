import {
  ArrowRightIcon,
  BrainIcon,
  HeartIcon,
  GlobeIcon,
  LightbulbIcon,
  BarChart2Icon,
  UsersIcon,
  BuildingIcon,
  CheckIcon,
  StarIcon,
  MapPinIcon,
  BriefcaseIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GradualLogo } from '@/components/gradual-logo';

export default function CareersPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="text-muted-foreground">Join Our Team</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">Build the Future of</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Learning Technology
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Join our mission to transform education through cognitive science
              and cutting-edge technology. We're looking for passionate
              individuals to help us revolutionize how people learn.
            </p>
          </div>
        </div>
      </section>

      {/* Company values section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-muted-foreground">
              These core principles guide everything we do at Gradual and define
              our company culture.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <LightbulbIcon className="h-6 w-6" />,
                title: 'Innovation',
                description:
                  'We constantly push boundaries and explore new approaches to learning technology.',
              },
              {
                icon: <UsersIcon className="h-6 w-6" />,
                title: 'Inclusivity',
                description:
                  'We believe effective learning tools should be accessible to everyone, regardless of background.',
              },
              {
                icon: <BrainIcon className="h-6 w-6" />,
                title: 'Evidence-Based',
                description:
                  'Our methods and features are grounded in rigorous cognitive science research.',
              },
              {
                icon: <HeartIcon className="h-6 w-6" />,
                title: 'User-Centered',
                description:
                  'We design with deep empathy for learners and their diverse needs and goals.',
              },
              {
                icon: <GlobeIcon className="h-6 w-6" />,
                title: 'Global Impact',
                description:
                  'We aim to transform education worldwide and make quality learning accessible to all.',
              },
              {
                icon: <BarChart2Icon className="h-6 w-6" />,
                title: 'Continuous Growth',
                description:
                  'We foster a culture of learning and improvement in everything we do.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className='group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/10">
                  <div className="text-primary">{value.icon}</div>
                </div>

                <h3 className="mb-2 font-medium text-xl">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                <span className="text-muted-foreground">Benefits & Perks</span>
              </div>
              <h2 className="font-medium text-3xl md:text-4xl">
                We take care of our{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  team
                </span>
              </h2>
              <p className="text-muted-foreground">
                At Gradual, we believe in supporting our team members both
                professionally and personally. We offer competitive benefits
                designed to promote wellbeing, growth, and work-life balance.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  {
                    title: 'Flexible Remote Work',
                    description: 'Work from anywhere with flexible hours',
                  },
                  {
                    title: 'Competitive Compensation',
                    description: 'Salary, equity, and performance bonuses',
                  },
                  {
                    title: 'Learning & Development',
                    description: '$2,500 annual learning stipend',
                  },
                  {
                    title: 'Health & Wellness',
                    description:
                      'Comprehensive health coverage and wellness programs',
                  },
                  {
                    title: 'Paid Time Off',
                    description: 'Generous vacation policy and paid holidays',
                  },
                  {
                    title: 'Team Retreats',
                    description:
                      'Regular company retreats to connect in person',
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <CheckIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{benefit.title}</h3>
                      <p className="text-muted-foreground text-xs">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0">
              <div className='absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-primary/5 backdrop-blur-sm'>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

                <div className="absolute top-0 left-0 h-full w-full p-6">
                  <div className='flex h-full flex-col items-center justify-center'>
                    <div className="w-full max-w-xs space-y-8">
                      <div className="text-center">
                        <GradualLogo
                          width={48}
                          height={48}
                          className='mx-auto mb-4 text-primary'
                        />
                        <h3 className='mb-2 font-medium text-lg'>
                          Team Testimonial
                        </h3>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <p className='mb-4 text-muted-foreground text-sm italic'>
                          "Working at Gradual has been the most rewarding
                          experience of my career. I get to solve challenging
                          problems while making a real impact on how people
                          learn."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10'>
                            <div className="h-full w-full bg-gradient-to-br from-blue-400/30 to-blue-500/10" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Alex Chen</div>
                            <div className="text-muted-foreground text-xs">
                              Senior Engineer
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-amber-400" />
                          <StarIcon className="h-4 w-4 text-amber-400" />
                          <StarIcon className="h-4 w-4 text-amber-400" />
                          <StarIcon className="h-4 w-4 text-amber-400" />
                          <StarIcon className="h-4 w-4 text-amber-400" />
                        </div>
                        <span className='ml-2 text-muted-foreground text-xs'>
                          4.9/5 on Glassdoor
                        </span>
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

      {/* Open positions section */}
      <section className='relative bg-white/5 py-24'>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className='mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm'>
              <span className="text-muted-foreground">Open Roles</span>
            </div>
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Join Our Mission
              </span>
            </h2>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              We're looking for talented individuals who are passionate about
              transforming education through technology and cognitive science.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                title: 'Senior Full-Stack Engineer',
                team: 'Engineering',
                location: 'Remote (US/Europe)',
                type: 'Full-time',
                description:
                  'Build and scale our learning platform with React, Next.js, and Node.js.',
              },
              {
                title: 'Machine Learning Engineer',
                team: 'AI & Data',
                location: 'Remote (US/Europe)',
                type: 'Full-time',
                description:
                  'Develop algorithms to personalize learning experiences based on user behavior.',
              },
              {
                title: 'Product Designer',
                team: 'Design',
                location: 'Remote (US/Europe)',
                type: 'Full-time',
                description:
                  'Create intuitive, engaging interfaces for our learning platform.',
              },
              {
                title: 'Learning Experience Researcher',
                team: 'Research',
                location: 'Remote (US/Europe)',
                type: 'Full-time',
                description:
                  'Conduct research to improve our learning methodologies and user experience.',
              },
            ].map((job) => (
              <div
                key={job.title}
                className='group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
              >
                <div className="mb-4">
                  <h3 className='mb-1 font-medium text-xl'>{job.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                      <BuildingIcon className="h-3.5 w-3.5 text-primary/70" />
                      <span>{job.team}</span>
                    </div>
                    <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                      <MapPinIcon className="h-3.5 w-3.5 text-primary/70" />
                      <span>{job.location}</span>
                    </div>
                    <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                      <BriefcaseIcon className="h-3.5 w-3.5 text-primary/70" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>

                <p className='mb-6 text-muted-foreground'>{job.description}</p>

                <Button
                  variant="ghost"
                  size="sm"
                  className='p-0 text-primary hover:bg-white/5 hover:text-primary/80'
                >
                  View Job Details
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
            >
              View All Open Positions
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Application process section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              Our{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h2>
            <p className="text-muted-foreground">
              We've designed a thoughtful process to find the right candidates
              while respecting your time.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className='md:-translate-x-1/2 absolute top-0 left-[40px] h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-transparent md:left-1/2' />

            {[
              {
                step: 1,
                title: 'Application Review',
                description:
                  'We review your resume, portfolio, and application questions to assess your qualifications and alignment with our mission.',
                align: 'right',
              },
              {
                step: 2,
                title: 'Initial Conversation',
                description:
                  'A 30-minute call with a team member to discuss your background, interests, and answer any questions about Gradual.',
                align: 'left',
              },
              {
                step: 3,
                title: 'Technical Assessment',
                description:
                  'A take-home assignment or live coding session relevant to the role, designed to be completed in 2-3 hours.',
                align: 'right',
              },
              {
                step: 4,
                title: 'Team Interviews',
                description:
                  'Meet with 3-4 team members to dive deeper into your experience, skills, and how you approach problems.',
                align: 'left',
              },
              {
                step: 5,
                title: 'Final Conversation',
                description:
                  'A discussion with a founder or senior leader about your career goals and how you can contribute to our mission.',
                align: 'right',
              },
              {
                step: 6,
                title: 'Offer & Onboarding',
                description:
                  "We'll present an offer and, upon acceptance, begin our comprehensive onboarding process to set you up for success.",
                align: 'left',
              },
            ].map((step) => (
              <div
                key={step.step}
                className={`relative mb-12 md:grid md:grid-cols-2 md:gap-8 ${
                  step.align === 'left' ? 'md:text-right' : ''
                }`}
              >
                <div
                  className={`relative ${
                    step.align === 'left' ? 'md:col-start-1' : 'md:col-start-2'
                  }`}
                >
                  <div className='mb-4 flex items-center md:mb-0'>
                    <div className='md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-medium text-primary md:absolute md:top-1/2 md:left-1/2'>
                      {step.step}
                    </div>
                    <h3 className="ml-4 font-medium text-xl md:hidden">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div
                  className={`pl-14 md:pl-0 ${
                    step.align === 'left'
                      ? 'md:col-start-1 md:pr-14'
                      : 'md:col-start-2'
                  }`}
                >
                  <h3 className='mb-2 hidden font-medium text-xl md:block'>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className='relative bg-white/5 py-24'>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

        <div className='container relative mx-auto px-4 md:px-6'>
          <div className='mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm md:p-12'>
            <div className="-z-10 -translate-y-1/2 absolute top-0 right-0 h-64 w-64 translate-x-1/2 transform rounded-full bg-primary/10 blur-3xl" />
            <div className="-z-10 -translate-x-1/2 absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 transform rounded-full bg-primary/10 blur-3xl" />

            <div className="relative text-center">
              <h2 className='mb-6 font-medium text-3xl md:text-4xl'>
                Ready to{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  make an impact
                </span>
                ?
              </h2>
              <p className='mx-auto mb-8 max-w-xl text-muted-foreground'>
                Join our team and help build the future of learning technology.
                We're looking for passionate individuals who want to make a
                difference.
              </p>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">View Open Positions</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
                >
                  <Link
                    href="mailto:careers@gradual.com"
                    className="flex items-center"
                  >
                    Contact Recruiting
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
