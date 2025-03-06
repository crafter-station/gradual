import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  ExternalLinkIcon,
  InfoIcon,
  LightbulbIcon,
  ShareIcon,
  ThumbsUpIcon,
  UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { BlogImagePlaceholder } from '../../blog/placeholder';
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
    prerequisites: [
      'Basic understanding of memory concepts',
      'Willingness to follow a consistent study schedule',
    ],
    tools: [
      'Flashcard app (Anki, Quizlet, or similar)',
      'Calendar for scheduling review sessions',
    ],
    sections: [
      {
        title: 'Introduction to Spaced Repetition',
        content:
          'Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material. This technique leverages the psychological spacing effect, which demonstrates that information is more effectively remembered when studied multiple times spaced over a longer period.',
      },
      {
        title: 'The Science Behind Spaced Repetition',
        content:
          "The forgetting curve, discovered by Hermann Ebbinghaus in the 19th century, shows how information is lost over time when there is no attempt to retain it. Spaced repetition directly combats this by strategically timing reviews to occur just as you're about to forget the information, strengthening the memory each time.",
      },
      {
        title: 'Setting Up Your Spaced Repetition System',
        content:
          "To implement spaced repetition effectively, you'll need a system to track when to review specific information. Digital tools like Anki use algorithms to schedule reviews automatically, while manual systems like the Leitner box method can be implemented with physical flashcards.",
        steps: [
          'Choose your preferred system (digital or physical)',
          'Create effective flashcards with clear questions and answers',
          'Set up initial review intervals (1 day, 3 days, 7 days, etc.)',
          'Establish a daily review habit',
        ],
      },
      {
        title: 'Creating Effective Flashcards',
        content:
          'The quality of your flashcards significantly impacts the effectiveness of spaced repetition. Each card should test a single, specific piece of information and require active recall rather than recognition.',
        tips: [
          'Keep cards simple - one question, one answer',
          'Use cloze deletion for context-dependent information',
          'Include images where relevant',
          'Phrase questions to test understanding, not just memorization',
        ],
      },
      {
        title: 'Optimal Review Schedule',
        content:
          'While spaced repetition algorithms handle scheduling automatically, understanding the general pattern helps you appreciate the process. A typical schedule might look like: first review after 1 day, second review after 3 days, third review after 7 days, fourth review after 14 days, and fifth review after 30 days.',
      },
      {
        title: 'Combining with Other Learning Techniques',
        content:
          'Spaced repetition works best when combined with other evidence-based learning methods. Active recall, interleaving (mixing different topics), and elaboration (connecting new information to existing knowledge) all complement spaced repetition well.',
      },
      {
        title: 'Tracking Progress and Adjusting',
        content:
          "Monitor your retention rates and adjust your system accordingly. If you're consistently forgetting certain types of information, you might need to create better flashcards, review more frequently, or use additional learning techniques for those topics.",
      },
      {
        title: 'Common Mistakes to Avoid',
        content:
          "Many beginners make similar mistakes when implementing spaced repetition. Avoid creating cards that are too complex, cramming too many reviews into one session, or ignoring the algorithm's scheduling recommendations.",
        mistakes: [
          'Creating overly complex flashcards',
          'Reviewing too many cards in one session',
          'Ignoring the spaced repetition algorithm',
          'Not being consistent with reviews',
        ],
      },
      {
        title: 'Real-World Applications',
        content:
          'Spaced repetition can be applied to virtually any learning scenario: language acquisition, medical education, programming, history, mathematics, and more. The key is breaking down the knowledge into appropriate flashcard-sized chunks.',
        examples: [
          'Language learning: vocabulary, grammar rules, phrases',
          'Medical education: anatomy, drug interactions, diagnostic criteria',
          'Programming: syntax, design patterns, algorithms',
          'History: dates, events, cause-and-effect relationships',
        ],
      },
      {
        title: 'Conclusion and Next Steps',
        content:
          "Spaced repetition is one of the most evidence-backed learning techniques available. By implementing it consistently, you can dramatically improve your long-term retention while spending less total time studying. Start with a small set of flashcards on a topic you're currently learning, and gradually expand as you become comfortable with the system.",
      },
    ],
    resources: [
      {
        title: 'Anki - Free Spaced Repetition Software',
        url: 'https://apps.ankiweb.net/',
        type: 'tool',
      },
      {
        title: 'How to Remember Anything Forever-ish',
        url: 'https://ncase.me/remember/',
        type: 'interactive',
      },
      {
        title: 'Make It Stick: The Science of Successful Learning',
        author: 'Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel',
        type: 'book',
      },
      {
        title: 'Spaced Repetition Spreadsheet Template',
        url: '/downloads/spaced-repetition-template.xlsx',
        type: 'download',
      },
    ],
    relatedTutorials: [
      'active-recall-techniques',
      'memory-palace-technique',
      'interleaving-practice',
    ],
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
    sections: [
      {
        title: 'Introduction to Active Recall',
        content:
          'Active recall is the process of retrieving information from memory rather than simply reviewing or re-reading it. This technique has been proven to be one of the most effective ways to strengthen memory and improve long-term retention.',
        steps: [
          'Choose a topic or concept to study',
          'Create a list of key terms or concepts',
          'For each term, write down the definition or concept',
          'Take a break and try to recall the information',
          'Review the information and repeat the process',
        ],
        tips: [
          'Use a timer to simulate the pressure of real-time recall',
          'Create a distraction-free environment',
          'Vary the type of questions you ask yourself',
          'Use mnemonic devices to aid recall',
        ],
        mistakes: [
          'Relying too heavily on visual aids',
          'Not taking breaks to recall information',
          'Asking questions that are too easy',
          'Not varying the question types',
        ],
        examples: [
          'Language learning: vocabulary, grammar rules, phrases',
          'Medical education: anatomy, drug interactions, diagnostic criteria',
          'Programming: syntax, design patterns, algorithms',
          'History: dates, events, cause-and-effect relationships',
        ],
      },
    ],
    relatedTutorials: [
      'spaced-repetition-basics',
      'retrieval-practice-strategies',
    ],
  },
];

export default async function TutorialPage({
  params,
}: Readonly<{ params: Promise<{ locale: string; slug: string }> }>) {
  const { locale, slug } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  // Find the tutorial with the matching slug
  const tutorial = tutorials.find((tutorial) => tutorial.id === slug);

  // If no tutorial is found, return 404
  if (!tutorial) {
    notFound();
  }

  // Get related tutorials
  const relatedTutorials = tutorial.relatedTutorials
    ? tutorials.filter((t) => tutorial.relatedTutorials?.includes(t.id))
    : [];

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Hero section with tutorial info */}
      <div className="bg-gradient-to-b from-primary/5 to-background pt-16 pb-8">
        <div className="container mx-auto">
          {/* Breadcrumb navigation */}
          <div className="mb-8">
            <nav className='flex items-center text-muted-foreground text-sm'>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRightIcon className="mx-2 h-4 w-4" />
              <Link href="/tutorials" className="hover:text-foreground">
                Tutorials
              </Link>
              <ChevronRightIcon className="mx-2 h-4 w-4" />
              <Link
                href={`/tutorials?category=${tutorial.category}`}
                className="hover:text-foreground"
              >
                {getCategoryName(tutorial.category)}
              </Link>
              <ChevronRightIcon className="mx-2 h-4 w-4" />
              <span className='max-w-[200px] truncate font-medium text-foreground'>
                {tutorial.title}
              </span>
            </nav>
          </div>

          {/* Tutorial header */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className='mb-4 flex flex-wrap gap-3'>
                <Badge variant="outline" className="rounded-md">
                  {getCategoryName(tutorial.category)}
                </Badge>
                <Badge className={`${getDifficultyColor(tutorial.difficulty)}`}>
                  {getDifficultyName(tutorial.difficulty)}
                </Badge>
              </div>
              <h1 className='mb-4 font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl'>
                {tutorial.title}
              </h1>
              <p className='mb-6 text-muted-foreground text-xl'>
                {tutorial.excerpt}
              </p>
              <div className='mb-6 flex flex-wrap items-center gap-4 text-muted-foreground text-sm'>
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  <span>{tutorial.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{tutorial.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{tutorial.readTime}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="group">
                  Start Learning
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="icon">
                  <ShareIcon className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
            <div className='relative aspect-video overflow-hidden rounded-xl border md:aspect-square'>
              {tutorial.image.startsWith('/') ? (
                <BlogImagePlaceholder
                  title={tutorial.title}
                  className="h-full w-full"
                />
              ) : (
                <img
                  src={tutorial.image}
                  alt={tutorial.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left sidebar - Table of contents */}
          <div className='order-2 lg:order-1 lg:col-span-1'>
            <div className="sticky top-24 space-y-8">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className='mb-4 font-medium text-lg'>Table of Contents</h3>
                <nav className="space-y-1">
                  {tutorial.sections?.map((section, index) => (
                    <a
                      key={section.title}
                      href={`#section-${index}`}
                      className='flex items-center py-2 text-muted-foreground text-sm transition-colors hover:text-foreground'
                    >
                      <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs'>
                        {index + 1}
                      </span>
                      <span className="flex-1">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Prerequisites */}
              {tutorial.prerequisites && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className='mb-4 font-medium text-lg'>Prerequisites</h3>
                  <ul className="space-y-2">
                    {tutorial.prerequisites.map((prerequisite, index) => (
                      <li
                        key={prerequisite}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckIcon className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                        <span>{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools needed */}
              {tutorial.tools && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className='mb-4 font-medium text-lg'>Tools Needed</h3>
                  <ul className="space-y-2">
                    {tutorial.tools.map((tool, index) => (
                      <li key={tool} className="flex items-start gap-2 text-sm">
                        <CheckIcon className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className='order-1 lg:order-2 lg:col-span-2'>
            {/* Tutorial content */}
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {tutorial.sections?.map((section, index) => (
                <section
                  key={section.title}
                  id={`section-${index}`}
                  className="mb-12"
                >
                  <h2 className='flex scroll-mt-24 items-center gap-2'>
                    <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-sm'>
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p>{section.content}</p>

                  {/* Steps if available */}
                  {section.steps && (
                    <div className="mt-6">
                      <h3 className='mb-4 font-medium text-lg'>Steps:</h3>
                      <ol className="space-y-3">
                        {section.steps.map((step, stepIndex) => (
                          <li key={step} className="flex items-start gap-3">
                            <span className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-sm'>
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Tips if available */}
                  {section.tips && (
                    <div className='mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/50'>
                      <h3 className='mb-3 flex items-center gap-2 font-medium text-blue-800 text-lg dark:text-blue-300'>
                        <LightbulbIcon className="h-5 w-5" />
                        Tips:
                      </h3>
                      <ul className="space-y-2">
                        {section.tips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2">
                            <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400' />
                            <span className="text-blue-800 dark:text-blue-200">
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mistakes if available */}
                  {section.mistakes && (
                    <div className='mt-6 rounded-lg border border-amber-100 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50'>
                      <h3 className='mb-3 flex items-center gap-2 font-medium text-amber-800 text-lg dark:text-amber-300'>
                        <InfoIcon className="h-5 w-5" />
                        Common Mistakes to Avoid:
                      </h3>
                      <ul className="space-y-2">
                        {section.mistakes.map((mistake, mistakeIndex) => (
                          <li key={mistake} className="flex items-start gap-2">
                            <InfoIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400' />
                            <span className="text-amber-800 dark:text-amber-200">
                              {mistake}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples if available */}
                  {section.examples && (
                    <div className="mt-6">
                      <h3 className='mb-3 font-medium text-lg'>Examples:</h3>
                      <ul className='list-disc space-y-2 pl-5'>
                        {section.examples.map((example) => (
                          <li key={example}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ))}
            </article>

            {/* Resources section */}
            {tutorial.resources && (
              <div className="mt-12 border-t pt-12">
                <h2 className='mb-6 font-bold text-2xl'>
                  Additional Resources
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tutorial.resources.map((resource, index) => (
                    <div
                      key={resource.title}
                      className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="rounded-md bg-primary/10 p-2">
                        {resource.type === 'tool' && (
                          <ExternalLinkIcon className="h-5 w-5 text-primary" />
                        )}
                        {resource.type === 'interactive' && (
                          <ExternalLinkIcon className="h-5 w-5 text-primary" />
                        )}
                        {resource.type === 'book' && (
                          <BookmarkIcon className="h-5 w-5 text-primary" />
                        )}
                        {resource.type === 'download' && (
                          <DownloadIcon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        {resource.author && (
                          <p className='text-muted-foreground text-sm'>
                            by {resource.author}
                          </p>
                        )}
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='mt-2 inline-flex items-center font-medium text-primary text-sm hover:underline'
                          >
                            {resource.type === 'download'
                              ? 'Download'
                              : 'View Resource'}
                            <ArrowRightIcon className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback section */}
            <div className="mt-12 border-t pt-12">
              <div className="rounded-xl bg-muted p-6">
                <h3 className='mb-2 font-medium text-lg'>
                  Was this tutorial helpful?
                </h3>
                <p className='mb-4 text-muted-foreground'>
                  Your feedback helps us improve our tutorials.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <ThumbsUpIcon className="h-4 w-4" />
                    Yes, it was helpful
                  </Button>
                  <Button variant="outline" className="gap-2">
                    No, it needs improvement
                  </Button>
                </div>
              </div>
            </div>

            {/* Related tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="mt-12 border-t pt-12">
                <h2 className='mb-6 font-bold text-2xl'>Related Tutorials</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {relatedTutorials.map((relatedTutorial) => (
                    <Link
                      key={relatedTutorial.id}
                      href={`/tutorials/${relatedTutorial.id}`}
                      className="group flex gap-4 rounded-xl border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        {relatedTutorial.image.startsWith('/') ? (
                          <BlogImagePlaceholder
                            title={relatedTutorial.title}
                            className="h-full w-full"
                          />
                        ) : (
                          <img
                            src={relatedTutorial.image}
                            alt={relatedTutorial.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Badge variant="outline" className='mb-1 w-fit text-xs'>
                          {getCategoryName(relatedTutorial.category)}
                        </Badge>
                        <h3 className="font-medium leading-tight group-hover:text-primary">
                          {relatedTutorial.title}
                        </h3>
                        <p className='mt-1 line-clamp-2 text-muted-foreground text-xs'>
                          {relatedTutorial.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-12 flex items-center justify-between border-t pt-6">
              <Link href="/tutorials">
                <Button variant="outline" className="gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  All Tutorials
                </Button>
              </Link>
              <Button className="gap-2">
                Next Tutorial
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
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
