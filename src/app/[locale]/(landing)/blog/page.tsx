import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BlogImagePlaceholder } from './placeholder';

export function generateStaticParams() {
  return getStaticParams();
}

// Sample blog post data
const blogPosts = [
  {
    id: 'spaced-repetition',
    title: 'The Science of Spaced Repetition',
    excerpt:
      'How to leverage spaced repetition to improve your learning efficiency and long-term retention.',
    date: 'March 15, 2024',
    author: 'Dr. Sarah Chen',
    readTime: '8 min read',
    tags: ['Learning Science', 'Memory', 'Study Techniques'],
    image: '/images/blog/spaced-repetition.jpg',
    featured: true,
  },
  {
    id: 'active-recall',
    title: 'Active Recall: The Most Effective Study Technique',
    excerpt:
      'Why testing yourself is more effective than re-reading or highlighting, and how to implement it in your studies.',
    date: 'March 10, 2024',
    author: 'Prof. Michael Johnson',
    readTime: '6 min read',
    tags: ['Study Techniques', 'Memory', 'Productivity'],
    image: '/images/blog/active-recall.jpg',
    featured: false,
  },
  {
    id: 'learning-curve',
    title: 'Understanding the Learning Curve',
    excerpt:
      'The science behind why learning feels difficult at first and how to push through the initial challenges.',
    date: 'March 5, 2024',
    author: 'Dr. Emily Rodriguez',
    readTime: '7 min read',
    tags: ['Learning Science', 'Psychology', 'Motivation'],
    image: '/images/blog/learning-curve.jpg',
    featured: false,
  },
  {
    id: 'note-taking',
    title: 'Effective Note-Taking Strategies for Deeper Learning',
    excerpt:
      'Move beyond passive note-taking to create meaningful connections and enhance retention.',
    date: 'February 28, 2024',
    author: 'Prof. David Kim',
    readTime: '9 min read',
    tags: ['Study Techniques', 'Productivity', 'Organization'],
    image: '/images/blog/note-taking.jpg',
    featured: false,
  },
  {
    id: 'learning-styles',
    title: 'The Myth of Learning Styles',
    excerpt:
      "Why the popular concept of visual, auditory, and kinesthetic learning styles isn't supported by science.",
    date: 'February 20, 2024',
    author: 'Dr. Sarah Chen',
    readTime: '10 min read',
    tags: ['Learning Science', 'Psychology', 'Education'],
    image: '/images/blog/learning-styles.jpg',
    featured: false,
  },
  {
    id: 'deliberate-practice',
    title: 'Deliberate Practice: The Path to Mastery',
    excerpt:
      'How focused, purposeful practice with feedback leads to expertise in any field.',
    date: 'February 15, 2024',
    author: 'Prof. Michael Johnson',
    readTime: '8 min read',
    tags: ['Expertise', 'Skill Development', 'Performance'],
    image: '/images/blog/deliberate-practice.jpg',
    featured: false,
  },
];

export default async function Blog({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Page header with gradient underline */}
      <section className="container mx-auto py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className='mb-4 font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl'>
            Gradual Blog
          </h1>
          <div className='mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50' />
          <p className='text-muted-foreground text-xl'>
            Insights and research on effective learning, memory science, and
            educational technology.
          </p>
        </div>
      </section>

      {/* Featured post section */}
      {featuredPost && (
        <section className="container mx-auto pb-16">
          <div className="mb-8">
            <h2 className='font-bold text-2xl'>Featured Article</h2>
          </div>
          <div className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className='relative aspect-video overflow-hidden md:aspect-auto'>
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                {featuredPost.image.startsWith('/') ? (
                  <BlogImagePlaceholder
                    title={featuredPost.title}
                    className="h-full w-full"
                  />
                ) : (
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className='mb-3 font-bold text-2xl tracking-tight md:text-3xl'>
                  {featuredPost.title}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  {featuredPost.excerpt}
                </p>
                <div className='mb-6 flex items-center gap-4 text-muted-foreground text-sm'>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                </div>
                <Link href={`/blog/${featuredPost.id}`}>
                  <Button className="group w-full md:w-auto">
                    Read Article
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular posts grid */}
      <section className="container mx-auto pb-24">
        <div className="mb-8">
          <h2 className='font-bold text-2xl'>Latest Articles</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                {post.image.startsWith('/') ? (
                  <BlogImagePlaceholder
                    title={post.title}
                    className="h-full w-full"
                  />
                ) : (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className='inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs'
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className='inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-xs'>
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
                <h3 className='mb-2 font-bold text-xl tracking-tight'>
                  {post.title}
                </h3>
                <p className="mb-6 flex-1 text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className='mt-auto flex items-center justify-between text-muted-foreground text-sm'>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter section */}
      <section className="container mx-auto pb-24">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className='mb-4 font-bold text-2xl md:text-3xl'>
              Subscribe to Our Newsletter
            </h2>
            <p className="mb-6 text-muted-foreground">
              Get the latest articles, research insights, and learning tips
              delivered straight to your inbox.
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            <p className='mt-3 text-muted-foreground text-xs'>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
