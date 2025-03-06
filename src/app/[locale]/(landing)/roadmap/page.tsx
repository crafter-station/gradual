import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  CodeIcon,
  GithubIcon,
  StarIcon,
  HeartIcon,
  MessageSquareIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  CircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  TagIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RoadmapPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="text-muted-foreground">Open Source</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">Building Gradual</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                In Public
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Explore our development roadmap, contribute to our open source
              project, and help shape the future of learning technology.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button className="group relative overflow-hidden">
                <span className="relative z-10">View on GitHub</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                <GithubIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
              >
                <StarIcon className="mr-2 h-4 w-4 text-amber-400" />
                Star Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project stats section */}
      <section className="relative py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
            {[
              {
                value: '2,500+',
                label: 'GitHub Stars',
                icon: <StarIcon className="h-5 w-5 text-amber-400/70" />,
              },
              {
                value: '120+',
                label: 'Contributors',
                icon: <HeartIcon className="h-5 w-5 text-red-400/70" />,
              },
              {
                value: '450+',
                label: 'Pull Requests',
                icon: (
                  <GitPullRequestIcon className="h-5 w-5 text-primary/70" />
                ),
              },
              {
                value: '1,200+',
                label: 'Issues Closed',
                icon: <CheckIcon className="h-5 w-5 text-green-400/70" />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className='rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
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

      {/* Current focus section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className='mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm'>
              <span className="text-muted-foreground">Current Focus</span>
            </div>
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                What We're Building Now
              </span>
            </h2>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              These are the features and improvements we're actively working on
              in the current development cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Enhanced Spaced Repetition Algorithm',
                description:
                  'Improving our core algorithm to better adapt to individual learning patterns and retention rates.',
                status: 'In Progress',
                statusColor: 'bg-amber-400/20 text-amber-400',
                dueDate: 'Q2 2023',
                priority: 'High',
                priorityColor: 'text-red-400',
                assignees: 3,
              },
              {
                title: 'Mobile App Development',
                description:
                  'Creating native mobile applications for iOS and Android to enable learning on the go.',
                status: 'Planning',
                statusColor: 'bg-blue-400/20 text-blue-400',
                dueDate: 'Q3 2023',
                priority: 'Medium',
                priorityColor: 'text-amber-400',
                assignees: 2,
              },
              {
                title: 'Content Import API',
                description:
                  'Building a robust API for importing learning content from various sources and formats.',
                status: 'In Progress',
                statusColor: 'bg-amber-400/20 text-amber-400',
                dueDate: 'Q2 2023',
                priority: 'High',
                priorityColor: 'text-red-400',
                assignees: 4,
              },
              {
                title: 'Learning Analytics Dashboard',
                description:
                  'Developing comprehensive analytics to help users track their progress and identify areas for improvement.',
                status: 'In Progress',
                statusColor: 'bg-amber-400/20 text-amber-400',
                dueDate: 'Q2 2023',
                priority: 'Medium',
                priorityColor: 'text-amber-400',
                assignees: 2,
              },
              {
                title: 'Collaborative Learning Features',
                description:
                  'Adding functionality for group learning, shared decks, and collaborative content creation.',
                status: 'Planning',
                statusColor: 'bg-blue-400/20 text-blue-400',
                dueDate: 'Q3 2023',
                priority: 'Medium',
                priorityColor: 'text-amber-400',
                assignees: 1,
              },
              {
                title: 'AI-Powered Content Generation',
                description:
                  'Implementing AI tools to help users create effective learning materials from existing content.',
                status: 'Research',
                statusColor: 'bg-purple-400/20 text-purple-400',
                dueDate: 'Q4 2023',
                priority: 'Low',
                priorityColor: 'text-green-400',
                assignees: 2,
              },
            ].map((item) => (
              <div
                key={item.title}
                className='group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
              >
                <div className="mb-4">
                  <div className='mb-2 flex items-center justify-between'>
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${item.statusColor}`}
                    >
                      {item.status}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className='text-muted-foreground text-xs'>
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                  <h3 className='mb-2 font-medium text-xl'>{item.title}</h3>
                  <p className='mb-4 text-muted-foreground text-sm'>
                    {item.description}
                  </p>
                </div>

                <div className='flex items-center justify-between border-white/10 border-t pt-4'>
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className={`text-xs ${item.priorityColor}`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className='-space-x-2 flex'>
                      {Array(item.assignees)
                        .fill(null)
                        .map((_, i) => (
                          <div
                            key={`${item.title}-assignee-${i}`}
                            className='h-6 w-6 rounded-full border border-background bg-white/10'
                          />
                        ))}
                    </div>
                    <span className='text-muted-foreground text-xs'>
                      {item.assignees} assignees
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <GitBranchIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
            >
              View All Current Tasks
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Future roadmap section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Future Roadmap
              </span>
            </h2>
            <p className="text-muted-foreground">
              Our long-term vision for Gradual and the features we plan to
              develop in the coming months.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className='md:-translate-x-1/2 absolute top-0 left-[40px] h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-transparent md:left-1/2' />

            {[
              {
                quarter: 'Q3 2023',
                title: 'Enhanced Mobile Experience',
                description:
                  'Launch of native mobile apps for iOS and Android with offline learning capabilities.',
                align: 'right',
                status: 'Planned',
              },
              {
                quarter: 'Q4 2023',
                title: 'Advanced Analytics & Insights',
                description:
                  'Comprehensive learning analytics with personalized insights and progress visualization.',
                align: 'left',
                status: 'Planned',
              },
              {
                quarter: 'Q1 2024',
                title: 'Collaborative Learning Platform',
                description:
                  'Tools for team-based learning, shared content libraries, and collaborative study sessions.',
                align: 'right',
                status: 'Planned',
              },
              {
                quarter: 'Q2 2024',
                title: 'AI Content Generation',
                description:
                  'AI-powered tools to automatically generate effective learning materials from various sources.',
                align: 'left',
                status: 'Planned',
              },
              {
                quarter: 'Q3 2024',
                title: 'Enterprise Learning Management',
                description:
                  'Features for organizations to manage team learning, track progress, and measure outcomes.',
                align: 'right',
                status: 'Planned',
              },
              {
                quarter: 'Q4 2024',
                title: 'Global Learning Ecosystem',
                description:
                  'Integration with educational platforms and content providers to create a comprehensive learning ecosystem.',
                align: 'left',
                status: 'Planned',
              },
            ].map((milestone) => (
              <div
                key={milestone.quarter}
                className={`relative mb-12 md:grid md:grid-cols-2 md:gap-8 ${
                  milestone.align === 'left' ? 'md:text-right' : ''
                }`}
              >
                <div
                  className={`relative ${
                    milestone.align === 'left'
                      ? 'md:col-start-1'
                      : 'md:col-start-2'
                  }`}
                >
                  <div className='mb-4 flex items-center md:mb-0'>
                    <div className='md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-medium text-primary md:absolute md:top-1/2 md:left-1/2'>
                      <CircleIcon className="h-4 w-4" />
                    </div>
                    <div className="ml-4 md:hidden">
                      <div className='text-muted-foreground text-xs'>
                        {milestone.quarter}
                      </div>
                      <h3 className="font-medium text-xl">{milestone.title}</h3>
                    </div>
                  </div>
                </div>

                <div
                  className={`pl-14 md:pl-0 ${
                    milestone.align === 'left'
                      ? 'md:col-start-1 md:pr-14'
                      : 'md:col-start-2'
                  }`}
                >
                  <div className='mb-1 hidden text-muted-foreground text-xs md:block'>
                    {milestone.quarter}
                  </div>
                  <h3 className='mb-2 hidden font-medium text-xl md:block'>
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {milestone.description}
                  </p>
                  <div className='mt-2 inline-flex items-center text-primary text-xs'>
                    <span className="mr-2">{milestone.status}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community contribution section */}
      <section className='relative bg-white/5 py-24'>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className='mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm'>
              <span className="text-muted-foreground">Get Involved</span>
            </div>
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                How to Contribute
              </span>
            </h2>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              Join our open source community and help us build the future of
              learning technology. There are many ways to contribute, regardless
              of your experience level.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <CodeIcon className="h-6 w-6" />,
                title: 'Code Contributions',
                description:
                  'Help us implement new features, fix bugs, or improve performance. Check our GitHub issues labeled "good first issue" to get started.',
                cta: 'View Open Issues',
                link: '#',
              },
              {
                icon: <MessageSquareIcon className="h-6 w-6" />,
                title: 'Feedback & Ideas',
                description:
                  'Share your thoughts, report bugs, or suggest new features. Your feedback is invaluable in shaping the future of Gradual.',
                cta: 'Submit Feedback',
                link: '#',
              },
              {
                icon: <BookOpenIcon className="h-6 w-6" />,
                title: 'Documentation',
                description:
                  'Help improve our documentation, write tutorials, or create learning resources to make Gradual more accessible to everyone.',
                cta: 'Contribute to Docs',
                link: '#',
              },
            ].map((item) => (
              <div
                key={item.title}
                className='group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/10">
                  <div className="text-primary">{item.icon}</div>
                </div>

                <h3 className="mb-2 font-medium text-xl">{item.title}</h3>
                <p className='mb-6 text-muted-foreground'>{item.description}</p>

                <div className="mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className='p-0 text-primary hover:bg-white/5 hover:text-primary/80'
                  >
                    {item.cta}
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub activity section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Recent Activity
              </span>
            </h2>
            <p className="text-muted-foreground">
              See what's happening in our GitHub repository and join the
              conversation.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className='overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
              <div className="space-y-6">
                {[
                  {
                    type: 'pull-request',
                    title: 'Implement enhanced spaced repetition algorithm',
                    number: '#143',
                    author: 'alexchen',
                    status: 'Merged',
                    statusColor: 'text-purple-400',
                    timeAgo: '2 days ago',
                  },
                  {
                    type: 'issue',
                    title: 'Mobile responsiveness issues on study session page',
                    number: '#157',
                    author: 'sarahjohnson',
                    status: 'Open',
                    statusColor: 'text-green-400',
                    timeAgo: '3 days ago',
                  },
                  {
                    type: 'pull-request',
                    title: 'Add dark mode support for all components',
                    number: '#142',
                    author: 'davidkim',
                    status: 'In Review',
                    statusColor: 'text-amber-400',
                    timeAgo: '4 days ago',
                  },
                  {
                    type: 'issue',
                    title: 'Feature request: Export learning data to CSV',
                    number: '#156',
                    author: 'mayapatel',
                    status: 'Open',
                    statusColor: 'text-green-400',
                    timeAgo: '5 days ago',
                  },
                  {
                    type: 'pull-request',
                    title: 'Improve loading performance on dashboard',
                    number: '#141',
                    author: 'jameswilson',
                    status: 'Merged',
                    statusColor: 'text-purple-400',
                    timeAgo: '1 week ago',
                  },
                ].map((activity) => (
                  <div
                    key={activity.number}
                    className='flex items-start gap-4 border-white/10 border-b pb-6 last:border-0 last:pb-0'
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                      {activity.type === 'pull-request' ? (
                        <GitPullRequestIcon className="h-4 w-4 text-primary/70" />
                      ) : (
                        <AlertCircleIcon className="h-4 w-4 text-primary/70" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className='mb-1 flex items-center justify-between'>
                        <h4 className="font-medium text-sm">
                          {activity.title}{' '}
                          <span className="text-muted-foreground">
                            {activity.number}
                          </span>
                        </h4>
                        <span className={`text-xs ${activity.statusColor}`}>
                          {activity.status}
                        </span>
                      </div>
                      <div className='flex items-center text-muted-foreground text-xs'>
                        <span>by @{activity.author}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
              >
                <Link
                  href="https://github.com/gradual-learning/gradual"
                  className="flex items-center"
                >
                  View on GitHub
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
                  contribute
                </span>
                ?
              </h2>
              <p className='mx-auto mb-8 max-w-xl text-muted-foreground'>
                Join our community of contributors and help us build the future
                of learning technology. Every contribution, big or small, makes
                a difference.
              </p>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
                >
                  <GithubIcon className="mr-2 h-4 w-4" />
                  Star on GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
