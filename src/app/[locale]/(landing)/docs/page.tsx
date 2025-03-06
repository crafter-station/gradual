import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import {
  ArrowRightIcon,
  BookIcon,
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  LightbulbIcon,
  SearchIcon,
  UploadIcon,
  ZapIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function generateStaticParams() {
  return getStaticParams();
}

// Documentation categories
const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description:
      'Learn the basics of Gradual and how to set up your first learning path',
    icon: <BookOpenIcon className="h-5 w-5" />,
    articles: [
      {
        id: 'introduction',
        title: 'Introduction to Gradual',
        readTime: '3 min',
      },
      {
        id: 'account-setup',
        title: 'Setting Up Your Account',
        readTime: '2 min',
      },
      {
        id: 'platform-overview',
        title: 'Platform Overview',
        readTime: '5 min',
      },
      {
        id: 'learning-modes',
        title: 'Understanding Learning Modes',
        readTime: '4 min',
      },
    ],
  },
  {
    id: 'specialized-programs',
    title: 'Specialized Programs',
    description: 'Detailed guides for our curated learning programs',
    icon: <GraduationCapIcon className="h-5 w-5" />,
    articles: [
      {
        id: 'unmsm-program',
        title: 'UNMSM Admission Preparation',
        readTime: '6 min',
      },
      {
        id: 'program-structure',
        title: 'Program Structure and Methodology',
        readTime: '7 min',
      },
      {
        id: 'tracking-progress',
        title: 'Tracking Your Progress',
        readTime: '3 min',
      },
      {
        id: 'practice-exams',
        title: 'Taking Practice Exams',
        readTime: '5 min',
      },
    ],
  },
  {
    id: 'custom-courses',
    title: 'Custom Course Generation',
    description:
      'Learn how to create personalized courses from your own materials',
    icon: <UploadIcon className="h-5 w-5" />,
    articles: [
      {
        id: 'uploading-materials',
        title: 'Uploading Study Materials',
        readTime: '3 min',
      },
      {
        id: 'course-settings',
        title: 'Configuring Course Settings',
        readTime: '4 min',
      },
      {
        id: 'supported-formats',
        title: 'Supported File Formats',
        readTime: '2 min',
      },
      {
        id: 'optimizing-materials',
        title: 'Optimizing Your Materials',
        readTime: '5 min',
      },
    ],
  },
  {
    id: 'deep-research',
    title: 'Deep Research Mode',
    description: 'Guides for using our AI-powered research and course creation',
    icon: <SearchIcon className="h-5 w-5" />,
    articles: [
      {
        id: 'research-prompts',
        title: 'Creating Effective Research Prompts',
        readTime: '4 min',
      },
      {
        id: 'reviewing-sources',
        title: 'Reviewing and Managing Sources',
        readTime: '3 min',
      },
      {
        id: 'customizing-research',
        title: 'Customizing Research Parameters',
        readTime: '5 min',
      },
      {
        id: 'exporting-courses',
        title: 'Exporting and Sharing Courses',
        readTime: '2 min',
      },
    ],
  },
  {
    id: 'learning-techniques',
    title: 'Learning Techniques',
    description: 'Scientific methods to maximize your learning efficiency',
    icon: <LightbulbIcon className="h-5 w-5" />,
    articles: [
      {
        id: 'active-recall',
        title: 'Active Recall Techniques',
        readTime: '5 min',
      },
      {
        id: 'spaced-repetition',
        title: 'Spaced Repetition System',
        readTime: '6 min',
      },
      { id: 'interleaving', title: 'Interleaving Practice', readTime: '4 min' },
      {
        id: 'memory-techniques',
        title: 'Memory Enhancement Techniques',
        readTime: '7 min',
      },
    ],
  },
  {
    id: 'api-integration',
    title: 'API & Integration',
    description: 'Technical documentation for developers',
    icon: <CodeIcon className="h-5 w-5" />,
    articles: [
      { id: 'api-overview', title: 'API Overview', readTime: '3 min' },
      { id: 'authentication', title: 'Authentication', readTime: '4 min' },
      { id: 'course-endpoints', title: 'Course Endpoints', readTime: '6 min' },
      { id: 'webhooks', title: 'Webhooks', readTime: '5 min' },
    ],
  },
];

// Popular articles
const popularArticles = [
  {
    id: 'getting-started/introduction',
    title: 'Introduction to Gradual',
    category: 'Getting Started',
    readTime: '3 min',
  },
  {
    id: 'specialized-programs/unmsm-program',
    title: 'UNMSM Admission Preparation',
    category: 'Specialized Programs',
    readTime: '6 min',
  },
  {
    id: 'custom-courses/uploading-materials',
    title: 'Uploading Study Materials',
    category: 'Custom Course Generation',
    readTime: '3 min',
  },
  {
    id: 'learning-techniques/active-recall',
    title: 'Active Recall Techniques',
    category: 'Learning Techniques',
    readTime: '5 min',
  },
];

export default async function Documentation({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-3 py-1 text-sm">Documentation</Badge>
            <h1 className='mb-6 font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl'>
              Learn How to Use Gradual
            </h1>
            <p className='text-muted-foreground text-xl'>
              Comprehensive guides and resources to help you get the most out of
              our learning platform
            </p>

            {/* Search bar */}
            <div className='mx-auto mt-8 max-w-md'>
              <div className="relative">
                <SearchIcon className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className='h-12 w-full rounded-full border border-input bg-background py-2 pr-4 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                />
              </div>
            </div>
          </div>
        </div>

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
      </section>

      {/* Popular articles section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className='mb-8 font-bold text-2xl'>Popular Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/docs/${article.id}`}
                  className='group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md'
                >
                  <Badge variant="outline" className='mb-2 w-fit text-xs'>
                    {article.category}
                  </Badge>
                  <h3 className='mb-2 font-medium text-lg transition-colors group-hover:text-primary'>
                    {article.title}
                  </h3>
                  <div className='mt-auto flex items-center justify-between pt-4 text-muted-foreground text-sm'>
                    <span>{article.readTime}</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentation categories */}
      <section className='bg-muted/30 py-16'>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className='mb-8 font-bold text-2xl'>Documentation</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className='overflow-hidden rounded-xl border bg-card shadow-sm'
                >
                  <div className="border-b p-6">
                    <div className='mb-3 flex items-center gap-3'>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <h3 className='font-medium text-xl'>{category.title}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="divide-y">
                    {category.articles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/docs/${category.id}/${article.id}`}
                        className='flex items-center justify-between p-4 transition-colors hover:bg-muted/50'
                      >
                        <span className="font-medium">{article.title}</span>
                        <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                          <span>{article.readTime}</span>
                          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className='border-t bg-muted/20 p-4'>
                    <Link
                      href={`/docs/${category.id}`}
                      className='flex items-center justify-between font-medium text-primary text-sm'
                    >
                      <span>View all {category.title} docs</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video tutorials section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='font-bold text-2xl'>Video Tutorials</h2>
              <Link
                href="/docs/videos"
                className='flex items-center gap-1 font-medium text-primary text-sm'
              >
                <span>View all videos</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='group relative aspect-video overflow-hidden rounded-xl border bg-card shadow-sm'
                >
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/90'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className='ml-1 text-white'
                        aria-label="Play video"
                        role="img"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <div className='absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
                    <h3 className='font-medium text-white'>
                      {i === 1
                        ? 'Getting Started with Gradual'
                        : i === 2
                          ? 'Creating Your First Custom Course'
                          : 'Using Deep Research Mode'}
                    </h3>
                    <p className='text-sm text-white/80'>
                      {i === 1 ? '5:32' : i === 2 ? '7:14' : '6:48'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className='bg-muted/30 py-16'>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className='mb-12 text-center'>
              <Badge className="mb-4">FAQ</Badge>
              <h2 className='mb-4 font-bold text-3xl'>
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find quick answers to common questions about using Gradual
              </p>
            </div>
            <div className="space-y-6">
              {[
                {
                  id: 'getting-started',
                  question: 'How do I get started with Gradual?',
                  answer:
                    'To get started, create an account and choose one of our three learning modes: Specialized Programs, Custom Course Generation, or Deep Research Mode. Follow the on-screen instructions to set up your first learning path.',
                },
                {
                  id: 'file-formats',
                  question:
                    'What file formats are supported for custom courses?',
                  answer:
                    'Gradual supports PDF, PPTX, DOCX, TXT, and Markdown files for custom course generation. We recommend using well-structured documents with clear headings for the best results.',
                },
                {
                  id: 'deep-research',
                  question: 'How does the Deep Research mode work?',
                  answer:
                    'Deep Research mode uses our AI to autonomously search the web for high-quality resources on your chosen topic. It then organizes this information into a structured course, complete with quizzes and exercises.',
                },
                {
                  id: 'progress-tracking',
                  question: 'Can I track my learning progress?',
                  answer:
                    'Yes, Gradual provides comprehensive progress tracking for all courses. You can view your completion rate, quiz scores, and spaced repetition schedule from your dashboard.',
                },
                {
                  id: 'mobile-app',
                  question: 'Is there a mobile app available?',
                  answer:
                    'Currently, Gradual is optimized for web browsers on both desktop and mobile devices. A dedicated mobile app is on our roadmap and will be released in the near future.',
                },
              ].map((faq) => (
                <div
                  key={faq.id}
                  className='overflow-hidden rounded-xl border bg-card shadow-sm'
                >
                  <div className="p-6">
                    <h3 className='mb-2 font-medium text-lg'>{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/docs/faq">
                <Button variant="outline">
                  View All FAQs
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Still need help section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className='mb-4 font-bold text-3xl'>Still Need Help?</h2>
            <p className='mb-8 text-muted-foreground'>
              Our support team is ready to assist you with any questions or
              issues you may have.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className='mb-2 font-medium text-lg'>Read the Guides</h3>
                <p className='mb-4 text-muted-foreground'>
                  Explore our comprehensive guides and tutorials for detailed
                  instructions.
                </p>
                <Button variant="outline" className="w-full">
                  Browse Guides
                </Button>
              </div>
              <div className="rounded-xl border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ZapIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className='mb-2 font-medium text-lg'>Contact Support</h3>
                <p className='mb-4 text-muted-foreground'>
                  Get in touch with our support team for personalized
                  assistance.
                </p>
                <Button className="w-full">Contact Us</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
