import {
  ArrowRightIcon,
  BrainIcon,
  SparklesIcon,
  CheckIcon,
  CodeIcon,
  GithubIcon,
  PackageIcon,
  BugIcon,
  ZapIcon,
  ShieldIcon,
  LayoutIcon,
  ServerIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChangelogPage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm backdrop-blur-sm">
              <span className="text-muted-foreground">Product Updates</span>
            </div>
            <h1 className="mt-6 font-medium text-4xl leading-tight tracking-tight md:text-5xl">
              <span className="block text-foreground">Gradual</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Changelog
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Track our journey as we build and improve Gradual. See the latest
              features, improvements, and bug fixes.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button className="group relative overflow-hidden">
                <span className="relative z-10">Subscribe to Updates</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
              </Button>
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest release highlight */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className='relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm'>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

            {/* Decorative elements */}
            <div className='-translate-y-1/3 absolute top-0 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-primary/10 blur-3xl' />
            <div className='-translate-x-1/3 absolute bottom-0 left-0 h-64 w-64 translate-y-1/3 rounded-full bg-primary/10 blur-3xl' />

            <div className="relative">
              <div className='mb-6 flex items-center gap-3'>
                <div className='flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-primary text-xs'>
                  <PackageIcon className="h-3.5 w-3.5" />
                  <span>Latest Release</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                <div className='text-muted-foreground text-sm'>
                  June 15, 2023
                </div>
              </div>

              <h2 className='mb-4 font-medium text-2xl'>
                Version 2.0.0 - Major Platform Update
              </h2>

              <div className='mb-8 space-y-6'>
                <p className="text-muted-foreground">
                  We're excited to announce the release of Gradual 2.0, a major
                  update that brings significant improvements to our learning
                  platform. This release focuses on enhancing the user
                  experience, improving performance, and adding new features to
                  help you learn more effectively.
                </p>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className='mb-2 flex items-center gap-2'>
                      <SparklesIcon className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">New Features</h3>
                    </div>
                    <ul className='space-y-2 text-muted-foreground text-sm'>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Advanced spaced repetition algorithm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Personalized learning paths</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Enhanced content creation tools</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className='mb-2 flex items-center gap-2'>
                      <ZapIcon className="h-4 w-4 text-amber-400" />
                      <h3 className="font-medium">Improvements</h3>
                    </div>
                    <ul className='space-y-2 text-muted-foreground text-sm'>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>50% faster loading times</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Redesigned dashboard interface</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Enhanced mobile responsiveness</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className='mb-2 flex items-center gap-2'>
                      <BugIcon className="h-4 w-4 text-red-400" />
                      <h3 className="font-medium">Bug Fixes</h3>
                    </div>
                    <ul className='space-y-2 text-muted-foreground text-sm'>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Fixed sync issues with offline mode</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Resolved authentication edge cases</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckIcon className='mt-0.5 h-4 w-4 text-green-400' />
                        <span>Fixed image upload in content editor</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className='border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
                >
                  Read Full Release Notes
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Changelog timeline */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Release History
              </span>
            </h2>
            <p className="text-muted-foreground">
              A chronological history of all updates and improvements to
              Gradual.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className='absolute top-0 left-[40px] h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-transparent md:left-[120px]' />

            {[
              {
                version: '2.0.0',
                date: 'June 15, 2023',
                title: 'Major Platform Update',
                description:
                  'Complete redesign with new features, improved performance, and enhanced user experience.',
                type: 'major',
                typeColor: 'bg-primary/20 text-primary',
                highlights: [
                  {
                    type: 'feature',
                    text: 'Advanced spaced repetition algorithm',
                  },
                  { type: 'improvement', text: '50% faster loading times' },
                  { type: 'fix', text: 'Fixed sync issues with offline mode' },
                ],
              },
              {
                version: '1.9.2',
                date: 'May 28, 2023',
                title: 'Performance Improvements',
                description:
                  'Focused on improving application performance and fixing critical bugs.',
                type: 'patch',
                typeColor: 'bg-green-400/20 text-green-400',
                highlights: [
                  { type: 'improvement', text: 'Optimized database queries' },
                  { type: 'improvement', text: 'Reduced bundle size by 15%' },
                  { type: 'fix', text: 'Fixed memory leak in study session' },
                ],
              },
              {
                version: '1.9.0',
                date: 'May 10, 2023',
                title: 'Enhanced Analytics',
                description:
                  'Added detailed learning analytics and progress tracking features.',
                type: 'minor',
                typeColor: 'bg-blue-400/20 text-blue-400',
                highlights: [
                  { type: 'feature', text: 'Learning progress visualization' },
                  { type: 'feature', text: 'Retention rate analytics' },
                  { type: 'improvement', text: 'Enhanced data export options' },
                ],
              },
              {
                version: '1.8.5',
                date: 'April 22, 2023',
                title: 'Bug Fix Release',
                description:
                  'Addressed several user-reported issues and improved stability.',
                type: 'patch',
                typeColor: 'bg-green-400/20 text-green-400',
                highlights: [
                  { type: 'fix', text: 'Fixed authentication issues' },
                  { type: 'fix', text: 'Resolved content syncing problems' },
                  { type: 'fix', text: 'Fixed mobile layout issues' },
                ],
              },
              {
                version: '1.8.0',
                date: 'April 5, 2023',
                title: 'Content Creation Tools',
                description:
                  'Introduced new tools for creating and managing learning content.',
                type: 'minor',
                typeColor: 'bg-blue-400/20 text-blue-400',
                highlights: [
                  {
                    type: 'feature',
                    text: 'Rich text editor with markdown support',
                  },
                  { type: 'feature', text: 'Image and media embedding' },
                  {
                    type: 'feature',
                    text: 'Content organization improvements',
                  },
                ],
              },
              {
                version: '1.7.0',
                date: 'March 18, 2023',
                title: 'Mobile Experience',
                description:
                  'Major improvements to the mobile experience and offline capabilities.',
                type: 'minor',
                typeColor: 'bg-blue-400/20 text-blue-400',
                highlights: [
                  { type: 'feature', text: 'Offline study mode' },
                  {
                    type: 'improvement',
                    text: 'Responsive design enhancements',
                  },
                  { type: 'improvement', text: 'Touch-friendly interface' },
                ],
              },
            ].map((release, index) => (
              <div
                key={release.version}
                className='relative mb-16 pl-[60px] last:mb-0 md:pl-[160px]'
              >
                <div className='absolute top-0 left-0 flex items-center md:w-[120px] md:justify-end md:pr-8'>
                  <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-primary ring-4 ring-background">
                    <PackageIcon className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <div className='mb-2 flex flex-wrap items-center gap-3'>
                    <div
                      className={`rounded-full px-2 py-1 text-xs ${release.typeColor}`}
                    >
                      {release.type}
                    </div>
                    <h3 className="font-medium text-xl">{release.version}</h3>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className='text-muted-foreground text-sm'>
                      {release.date}
                    </div>
                  </div>

                  <h4 className='mb-2 font-medium text-lg'>{release.title}</h4>
                  <p className='mb-4 text-muted-foreground'>
                    {release.description}
                  </p>

                  <div className='mb-4 space-y-2'>
                    {release.highlights.map((highlight, idx) => (
                      <div
                        key={`${release.version}-highlight-${idx}`}
                        className="flex items-start gap-2"
                      >
                        {highlight.type === 'feature' && (
                          <SparklesIcon className='mt-0.5 h-4 w-4 text-primary' />
                        )}
                        {highlight.type === 'improvement' && (
                          <ZapIcon className='mt-0.5 h-4 w-4 text-amber-400' />
                        )}
                        {highlight.type === 'fix' && (
                          <BugIcon className='mt-0.5 h-4 w-4 text-red-400' />
                        )}
                        <span className='text-muted-foreground text-sm'>
                          {highlight.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className='p-0 text-primary hover:bg-white/5 hover:text-primary/80'
                  >
                    View Details
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
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
              View All Releases
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Release categories section */}
      <section className='relative bg-white/5 py-24'>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />

        <div className='container relative mx-auto px-4 md:px-6'>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 font-medium text-3xl md:text-4xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Updates by Category
              </span>
            </h2>
            <p className='mx-auto max-w-2xl text-muted-foreground'>
              Browse our changelog by category to see how different aspects of
              Gradual have evolved over time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <LayoutIcon className="h-6 w-6" />,
                title: 'User Interface',
                description:
                  'Updates to the user interface, design improvements, and UX enhancements.',
                count: 24,
              },
              {
                icon: <BrainIcon className="h-6 w-6" />,
                title: 'Learning Algorithm',
                description:
                  'Improvements to our spaced repetition and active recall algorithms.',
                count: 18,
              },
              {
                icon: <ServerIcon className="h-6 w-6" />,
                title: 'Performance',
                description:
                  'Updates focused on improving speed, reliability, and resource usage.',
                count: 32,
              },
              {
                icon: <ShieldIcon className="h-6 w-6" />,
                title: 'Security',
                description:
                  'Security enhancements, privacy improvements, and data protection updates.',
                count: 15,
              },
              {
                icon: <CodeIcon className="h-6 w-6" />,
                title: 'Developer Tools',
                description:
                  'API improvements, developer documentation, and integration capabilities.',
                count: 21,
              },
              {
                icon: <SparklesIcon className="h-6 w-6" />,
                title: 'New Features',
                description:
                  'Brand new capabilities and major feature additions to the platform.',
                count: 47,
              },
            ].map((category) => (
              <div
                key={category.title}
                className='group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-primary/5'
              >
                <div className="-inset-px -z-10 absolute rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/10">
                  <div className="text-primary">{category.icon}</div>
                </div>

                <div className='mb-2 flex items-center justify-between'>
                  <h3 className="font-medium text-xl">{category.title}</h3>
                  <div className='rounded-full bg-white/10 px-2 py-0.5 text-muted-foreground text-xs'>
                    {category.count} updates
                  </div>
                </div>

                <p className='mb-6 text-muted-foreground'>
                  {category.description}
                </p>

                <div className="mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className='p-0 text-primary hover:bg-white/5 hover:text-primary/80'
                  >
                    View Updates
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className='relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12'>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

            {/* Decorative elements */}
            <div className='-translate-y-1/3 absolute top-0 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-primary/10 blur-3xl' />
            <div className='-translate-x-1/3 absolute bottom-0 left-0 h-64 w-64 translate-y-1/3 rounded-full bg-primary/10 blur-3xl' />

            <div className="relative z-10 text-center">
              <h2 className='mb-6 font-medium text-3xl md:text-4xl'>
                Stay{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Updated
                </span>
              </h2>
              <p className='mx-auto mb-8 max-w-xl text-muted-foreground'>
                Subscribe to our changelog to receive notifications about new
                features, improvements, and updates as they're released.
              </p>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <div className='relative mx-auto w-full max-w-md'>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button className='group absolute relative top-1.5 right-1.5 overflow-hidden'>
                    <span className="relative z-10">Subscribe</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
                  </Button>
                </div>
              </div>

              <p className='mt-4 text-muted-foreground text-xs'>
                We'll only send you product updates. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
