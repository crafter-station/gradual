import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ShareIcon,
  UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { BlogImagePlaceholder } from '../placeholder';

export function generateStaticParams() {
  return getStaticParams();
}

// Sample blog post data - in a real app, this would come from a CMS or database
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
    content: `
      <p>Spaced repetition is a learning technique that incorporates increasing intervals of time between subsequent review of previously learned material to exploit the psychological spacing effect. This technique has been proven to increase the efficiency of learning and improve long-term retention.</p>
      
      <h2>The Forgetting Curve</h2>
      
      <p>In the late 19th century, Hermann Ebbinghaus discovered the "forgetting curve," which shows how information is lost over time when there is no attempt to retain it. He found that the biggest drop in retention happens within the first few days after learning something new.</p>
      
      <p>However, Ebbinghaus also discovered that the rate of forgetting can be significantly reduced through spaced review sessions. Each time you review the material, the rate of forgetting decreases, and the material stays in your memory for longer periods.</p>
      
      <h2>How Spaced Repetition Works</h2>
      
      <p>The basic principle of spaced repetition is to review information at increasing intervals. For example:</p>
      
      <ul>
        <li>First review: 1 day after learning</li>
        <li>Second review: 3 days after the first review</li>
        <li>Third review: 7 days after the second review</li>
        <li>Fourth review: 14 days after the third review</li>
        <li>Fifth review: 30 days after the fourth review</li>
      </ul>
      
      <p>This schedule can be adjusted based on how difficult you find the material. If you struggle to recall something, you should review it more frequently. If it's easy to remember, you can increase the interval between reviews.</p>
      
      <h2>The Science Behind It</h2>
      
      <p>Spaced repetition works because it takes advantage of how our brains form and strengthen memories. When we learn something new, our brains create neural pathways. Each time we recall that information, those pathways are strengthened, making the memory more durable.</p>
      
      <p>Research has shown that the act of recalling information—rather than simply re-reading it—is what strengthens memory. This is known as the "testing effect" or "retrieval practice." Spaced repetition combines this testing effect with optimally timed intervals to maximize learning efficiency.</p>
      
      <h2>Implementing Spaced Repetition</h2>
      
      <p>There are several ways to implement spaced repetition in your learning routine:</p>
      
      <h3>1. Flashcard Systems</h3>
      
      <p>Digital flashcard apps like Anki, Quizlet, or Gradual use algorithms to schedule reviews based on your performance. These systems automatically increase the interval for cards you find easy and decrease it for cards you struggle with.</p>
      
      <h3>2. Paper-based Systems</h3>
      
      <p>The Leitner system is a paper-based spaced repetition method using physical flashcards and multiple boxes. Cards move between boxes based on how well you recall them, with each box having a different review frequency.</p>
      
      <h3>3. Calendar Method</h3>
      
      <p>You can create your own spaced repetition schedule using a calendar. After learning new material, schedule review sessions at increasing intervals (1 day, 3 days, 7 days, etc.).</p>
      
      <h2>Best Practices for Spaced Repetition</h2>
      
      <ul>
        <li><strong>Active recall:</strong> Don't just re-read the material. Test yourself by trying to recall the information from memory.</li>
        <li><strong>Keep sessions short:</strong> Multiple short review sessions are more effective than one long session.</li>
        <li><strong>Prioritize difficult material:</strong> Spend more time on concepts you find challenging.</li>
        <li><strong>Combine with other techniques:</strong> Use spaced repetition alongside methods like interleaving (mixing different topics) and elaboration (connecting new information to existing knowledge).</li>
        <li><strong>Be consistent:</strong> Regular review is key to the effectiveness of spaced repetition.</li>
      </ul>
      
      <h2>Conclusion</h2>
      
      <p>Spaced repetition is one of the most evidence-backed learning techniques available. By strategically timing your review sessions, you can dramatically improve your retention while spending less total time studying. Whether you're learning a language, studying for exams, or acquiring new professional skills, incorporating spaced repetition into your learning routine can lead to significant improvements in long-term retention and recall.</p>
    `,
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
    content: `
      <p>Active recall is a learning principle that emphasizes retrieving information from memory rather than simply reviewing or re-reading material. Research consistently shows that actively recalling information is far more effective for long-term retention than passive review methods like highlighting or re-reading.</p>
      
      <h2>Why Active Recall Works</h2>
      
      <p>When you attempt to retrieve information from memory, you're strengthening the neural pathways associated with that information. This process, known as the "testing effect" or "retrieval practice," makes the memory more durable and easier to access in the future.</p>
      
      <p>In contrast, passive methods like re-reading create an illusion of knowledge—the material seems familiar, but you haven't actually practiced retrieving it from memory, which is what you'll need to do on a test or when applying the knowledge in real life.</p>
    `,
  },
];

export default async function BlogPost({
  params,
}: Readonly<{ params: Promise<{ locale: string; slug: string }> }>) {
  const { locale, slug } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  // Find the blog post with the matching slug
  const post = blogPosts.find((post) => post.id === slug);

  // If no post is found, return 404
  if (!post) {
    notFound();
  }

  // Get related posts (excluding the current post)
  const relatedPosts = blogPosts
    .filter((p) => p.id !== slug)
    .filter((p) => p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Hero section with featured image */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden md:h-[50vh]">
        <div className='absolute inset-0 z-10 bg-black/40' />
        {post.image.startsWith('/') ? (
          <BlogImagePlaceholder
            title={post.title}
            className="absolute inset-0"
          />
        ) : (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="container relative z-20 mx-auto flex h-full flex-col justify-end pb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className='inline-flex items-center rounded-full bg-primary/80 px-3 py-1 font-medium text-white text-xs backdrop-blur-sm'
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className='max-w-3xl font-bold text-3xl text-white md:text-4xl lg:text-5xl'>
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
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
      </div>

      {/* Article content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Back to blog link */}
            <Link
              href="/blog"
              className='group mb-8 inline-flex items-center font-medium text-muted-foreground text-sm hover:text-foreground'
            >
              <ArrowLeftIcon className='group-hover:-translate-x-1 mr-2 h-4 w-4 transition-transform' />
              Back to all articles
            </Link>

            {/* Article body */}
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {/* 
                Note: In a production application, you would use a proper markdown renderer
                like react-markdown or MDX instead of dangerouslySetInnerHTML to avoid XSS vulnerabilities.
                This is just for demonstration purposes.
              */}
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Share buttons */}
            <div className="mt-12 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className='font-medium text-lg'>Share this article</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <ShareIcon className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Author card */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className='mb-4 font-medium text-lg'>About the Author</h3>
                <div className="flex items-center gap-4">
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{post.author}</h4>
                    <p className='text-muted-foreground text-sm'>
                      Learning Science Researcher
                    </p>
                  </div>
                </div>
                <p className='mt-4 text-muted-foreground text-sm'>
                  Expert in cognitive psychology and educational technology with
                  a focus on evidence-based learning methods.
                </p>
              </div>

              {/* Related articles */}
              {relatedPosts.length > 0 && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className='mb-4 font-medium text-lg'>Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.id}`}
                        className="group flex gap-3"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          {relatedPost.image.startsWith('/') ? (
                            <BlogImagePlaceholder
                              title={relatedPost.title}
                              className="absolute inset-0"
                            />
                          ) : (
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium leading-tight group-hover:text-primary">
                            {relatedPost.title}
                          </h4>
                          <p className='mt-1 text-muted-foreground text-xs'>
                            {relatedPost.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter signup */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className='mb-2 font-medium text-lg'>Subscribe</h3>
                <p className='mb-4 text-muted-foreground text-sm'>
                  Get the latest articles delivered to your inbox.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
