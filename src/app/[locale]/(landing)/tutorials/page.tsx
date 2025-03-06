import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  FilterIcon,
  GraduationCapIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogImagePlaceholder } from '../blog/placeholder';
import { Badge } from '@/components/ui/badge';

export function generateStaticParams() {
  return getStaticParams();
}

// Sample tutorial categories
const categories = [
  { id: 'learning-techniques', name: 'Learning Techniques', count: 8 },
  { id: 'memory', name: 'Memory', count: 5 },
  { id: 'productivity', name: 'Productivity', count: 6 },
  { id: 'study-skills', name: 'Study Skills', count: 7 },
  { id: 'time-management', name: 'Time Management', count: 4 },
  { id: 'note-taking', name: 'Note Taking', count: 3 },
];

// Sample difficulty levels
const difficultyLevels = [
  {
    id: 'beginner',
    name: 'Beginner',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
];

// Sample tutorial data
const tutorials = [
  {
    id: 'spaced-repetition-basics',
    title: 'Spaced Repetition: The Ultimate Guide for Beginners',
    excerpt:
      'Learn how to implement spaced repetition in your study routine to dramatically improve long-term retention.',
    date: 'March 18, 2024',
    author: 'Dr. Sarah Chen',
    readTime: '15 min',
    category: 'learning-techniques',
    difficulty: 'beginner',
    image: '/images/tutorials/spaced-repetition.jpg',
    featured: true,
  },
  {
    id: 'active-recall-techniques',
    title: 'Active Recall: 7 Practical Techniques to Implement Today',
    excerpt:
      'Discover proven active recall methods that will strengthen your memory and boost your learning efficiency.',
    date: 'March 15, 2024',
    author: 'Prof. Michael Johnson',
    readTime: '12 min',
    category: 'learning-techniques',
    difficulty: 'beginner',
    image: '/images/tutorials/active-recall.jpg',
    featured: false,
  },
  {
    id: 'memory-palace-technique',
    title: 'How to Build a Memory Palace: Step-by-Step Guide',
    excerpt:
      'Master the ancient technique of loci to memorize vast amounts of information with surprising accuracy.',
    date: 'March 12, 2024',
    author: 'Dr. Emily Rodriguez',
    readTime: '18 min',
    category: 'memory',
    difficulty: 'intermediate',
    image: '/images/tutorials/memory-palace.jpg',
    featured: false,
  },
  {
    id: 'pomodoro-mastery',
    title: 'Pomodoro Technique Mastery: Beyond the Basics',
    excerpt:
      'Take your time management to the next level with advanced Pomodoro strategies for different types of work.',
    date: 'March 10, 2024',
    author: 'Prof. David Kim',
    readTime: '10 min',
    category: 'time-management',
    difficulty: 'intermediate',
    image: '/images/tutorials/pomodoro.jpg',
    featured: false,
  },
  {
    id: 'cornell-note-taking',
    title: 'The Cornell Note-Taking System: Complete Tutorial',
    excerpt:
      'A comprehensive guide to implementing the Cornell method for more effective and organized notes.',
    date: 'March 8, 2024',
    author: 'Dr. Sarah Chen',
    readTime: '14 min',
    category: 'note-taking',
    difficulty: 'beginner',
    image: '/images/tutorials/cornell-notes.jpg',
    featured: false,
  },
  {
    id: 'interleaving-practice',
    title: 'Interleaving Practice: The Science of Mixed Learning',
    excerpt:
      'Why mixing up your study topics leads to better learning outcomes and how to implement this approach.',
    date: 'March 5, 2024',
    author: 'Prof. Michael Johnson',
    readTime: '16 min',
    category: 'learning-techniques',
    difficulty: 'advanced',
    image: '/images/tutorials/interleaving.jpg',
    featured: false,
  },
  {
    id: 'dual-coding-theory',
    title:
      'Dual Coding Theory: Combining Words and Visuals for Better Learning',
    excerpt:
      'How to leverage both verbal and visual processing to enhance your memory and understanding.',
    date: 'March 2, 2024',
    author: 'Dr. Emily Rodriguez',
    readTime: '13 min',
    category: 'learning-techniques',
    difficulty: 'intermediate',
    image: '/images/tutorials/dual-coding.jpg',
    featured: false,
  },
  {
    id: 'retrieval-practice-strategies',
    title: '10 Powerful Retrieval Practice Strategies for Students',
    excerpt:
      'Practical techniques to implement retrieval practice in your daily study routine for maximum retention.',
    date: 'February 28, 2024',
    author: 'Prof. David Kim',
    readTime: '17 min',
    category: 'study-skills',
    difficulty: 'beginner',
    image: '/images/tutorials/retrieval-practice.jpg',
    featured: false,
  },
];

export default async function Tutorials({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const featuredTutorial = tutorials.find((tutorial) => tutorial.featured);
  const regularTutorials = tutorials.filter((tutorial) => !tutorial.featured);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Page header with gradient underline */}
      <section className="container mx-auto py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className='mb-4 font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl'>
            Tutorials
          </h1>
          <div className='mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/50' />
          <p className='text-muted-foreground text-xl'>
            Step-by-step guides to help you master effective learning techniques
            and study strategies.
          </p>
        </div>
      </section>

      {/* Search and filter section */}
      <section className="container mx-auto pb-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className='relative max-w-md flex-1'>
            <SearchIcon className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
            <input
              type="text"
              placeholder="Search tutorials..."
              className='h-10 w-full rounded-md border border-input bg-background py-2 pr-4 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
            <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            <select className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">All Levels</option>
              {difficultyLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Featured tutorial section */}
      {featuredTutorial && (
        <section className="container mx-auto pb-16">
          <div className="mb-8">
            <h2 className='font-bold text-2xl'>Featured Tutorial</h2>
          </div>
          <div className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className='relative aspect-video overflow-hidden md:aspect-auto'>
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                {featuredTutorial.image.startsWith('/') ? (
                  <BlogImagePlaceholder
                    title={featuredTutorial.title}
                    className="h-full w-full"
                  />
                ) : (
                  <img
                    src={featuredTutorial.image}
                    alt={featuredTutorial.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${getDifficultyColor(featuredTutorial.difficulty)}`}
                  >
                    {getDifficultyName(featuredTutorial.difficulty)}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <div className="mb-2">
                  <Badge variant="outline" className="rounded-md">
                    {getCategoryName(featuredTutorial.category)}
                  </Badge>
                </div>
                <h3 className='mb-3 font-bold text-2xl tracking-tight md:text-3xl'>
                  {featuredTutorial.title}
                </h3>
                <p className="mb-6 text-muted-foreground">
                  {featuredTutorial.excerpt}
                </p>
                <div className='mb-6 flex items-center gap-4 text-muted-foreground text-sm'>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{featuredTutorial.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{featuredTutorial.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{featuredTutorial.author}</span>
                  </div>
                </div>
                <Link href={`/tutorials/${featuredTutorial.id}`}>
                  <Button className="group w-full md:w-auto">
                    Start Tutorial
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories section */}
      <section className="container mx-auto pb-16">
        <div className="mb-8">
          <h2 className='font-bold text-2xl'>Browse by Category</h2>
        </div>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/tutorials?category=${category.id}`}
              className="group flex flex-col items-center justify-center rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                {getCategoryIcon(category.id)}
              </div>
              <h3 className="mb-1 font-medium">{category.name}</h3>
              <p className='text-muted-foreground text-sm'>
                {category.count} tutorials
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* All tutorials grid */}
      <section className="container mx-auto pb-24">
        <div className="mb-8 flex items-center justify-between">
          <h2 className='font-bold text-2xl'>All Tutorials</h2>
          <div className='flex items-center gap-2 text-muted-foreground text-sm'>
            <span>Sort by:</span>
            <select className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularTutorials.map((tutorial) => (
            <Link
              key={tutorial.id}
              href={`/tutorials/${tutorial.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                {tutorial.image.startsWith('/') ? (
                  <BlogImagePlaceholder
                    title={tutorial.title}
                    className="h-full w-full"
                  />
                ) : (
                  <img
                    src={tutorial.image}
                    alt={tutorial.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${getDifficultyColor(tutorial.difficulty)}`}
                  >
                    {getDifficultyName(tutorial.difficulty)}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3">
                  <Badge variant="outline" className="rounded-md">
                    {getCategoryName(tutorial.category)}
                  </Badge>
                </div>
                <h3 className='mb-2 font-bold text-xl tracking-tight'>
                  {tutorial.title}
                </h3>
                <p className="mb-6 flex-1 text-muted-foreground">
                  {tutorial.excerpt}
                </p>
                <div className='mt-auto flex items-center justify-between text-muted-foreground text-sm'>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{tutorial.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{tutorial.readTime}</span>
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
              Get New Tutorials in Your Inbox
            </h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to receive new tutorials, learning tips, and exclusive
              resources straight to your inbox.
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

// Helper functions
function getCategoryName(categoryId: string): string {
  const category = categories.find((c) => c.id === categoryId);
  return category ? category.name : categoryId;
}

function getDifficultyName(difficultyId: string): string {
  const difficulty = difficultyLevels.find((d) => d.id === difficultyId);
  return difficulty ? difficulty.name : difficultyId;
}

function getDifficultyColor(difficultyId: string): string {
  const difficulty = difficultyLevels.find((d) => d.id === difficultyId);
  return difficulty ? difficulty.color : '';
}

function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case 'learning-techniques':
      return <GraduationCapIcon className="h-6 w-6 text-primary" />;
    case 'memory':
      return <BookOpenIcon className="h-6 w-6 text-primary" />;
    case 'productivity':
      return <ArrowRightIcon className="h-6 w-6 text-primary" />;
    case 'study-skills':
      return <BookOpenIcon className="h-6 w-6 text-primary" />;
    case 'time-management':
      return <ClockIcon className="h-6 w-6 text-primary" />;
    case 'note-taking':
      return <BookOpenIcon className="h-6 w-6 text-primary" />;
    default:
      return <BookOpenIcon className="h-6 w-6 text-primary" />;
  }
}
