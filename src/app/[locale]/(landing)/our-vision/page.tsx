import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import {
  ArrowRightIcon,
  BookOpenIcon,
  BrainIcon,
  CheckCircleIcon,
  FileTextIcon,
  GraduationCapIcon,
  SearchIcon,
  SparklesIcon,
  UploadIcon,
  ZapIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function generateStaticParams() {
  return getStaticParams();
}

export default async function OurVision({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Hero section with gradient background and grid pattern */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background elements */}
        <div className='-z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background' />

        {/* Grid overlay */}
        <div
          className='-z-10 absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Gradient orbs */}
        <div
          className='-z-10 absolute top-1/4 left-[15%] h-[400px] w-[400px] animate-float-slow'
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
          className='-z-10 absolute right-[15%] bottom-1/3 h-[350px] w-[350px] animate-float'
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-green) 0%, transparent 70%)',
            opacity: 0.12,
            filter: 'blur(50px)',
            animation: 'float 25s ease-in-out infinite reverse',
            transformOrigin: '60% 40%',
          }}
        />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className='mb-4 px-3 py-1 font-medium text-sm'>
              Our Vision
            </Badge>
            <h1 className='mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent tracking-tight md:text-5xl lg:text-6xl'>
              Gradual & Dual Learning
            </h1>
            <p className='text-muted-foreground text-xl'>
              Transforming education through AI-powered learning and scientific
              methodologies
            </p>
          </div>
        </div>
      </section>

      {/* Introduction section with gradient cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className='mb-4 font-bold text-3xl'>
                The Meaning Behind Gradual
              </h2>
              <p className="text-lg text-muted-foreground">
                Our name embodies our educational philosophy and approach to
                learning
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="relative z-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ZapIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className='mb-3 font-bold text-xl'>Gradual Learning</h3>
                  <p className="text-muted-foreground">
                    We believe effective learning happens step by step, building
                    knowledge progressively and systematically. Our platform
                    guides you through this gradual process, ensuring deep
                    understanding and long-term retention.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="relative z-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <SparklesIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className='mb-3 font-bold text-xl'>Duality (Gra-dual)</h3>
                  <p className="text-muted-foreground">
                    Represents the duality between AI-generated courses and
                    human-created content. Our core engine enables AI to create
                    courses using our framework, while also supporting
                    expert-curated content for the best of both worlds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three modes section with modern cards */}
      <section className="relative overflow-hidden py-20">
        {/* Background pattern */}
        <div className='-z-10 absolute inset-0 bg-muted/50' />
        <div className='-z-10 absolute inset-0 bg-[length:8px_100%] bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]' />

        <div className="container mx-auto px-4">
          <div className='mx-auto mb-16 max-w-3xl text-center'>
            <Badge className='mb-4 px-3 py-1 font-medium text-sm'>
              Learning Modes
            </Badge>
            <h2 className='mb-4 font-bold text-3xl'>Three Ways to Learn</h2>
            <p className="text-lg text-muted-foreground">
              Our platform offers three distinct approaches to creating and
              consuming educational content, adapting to each student's specific
              needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Mode 1 */}
            <div className='group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/70" />
              <div className="p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCapIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className='mb-3 font-bold text-xl'>Specialized Programs</h3>
                <p className="mb-6 text-muted-foreground">
                  Structured courses based on official syllabi, carefully
                  curated and optimized for specific preparations.
                </p>
                <ul className='mb-6 space-y-3'>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>Based on proven, existing syllabi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>Extensive, deeply curated content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>Ideal for formal academic preparation</span>
                  </li>
                </ul>
                <div className="rounded-lg bg-muted p-4">
                  <p className='font-medium text-sm'>
                    Example: UNMSM admission exam preparation
                  </p>
                </div>
              </div>
            </div>

            {/* Mode 2 */}
            <div className='group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/70" />
              <div className="p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <UploadIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className='mb-3 font-bold text-xl'>
                  Custom Course Generation
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Transform your study materials into structured interactive
                  courses, optimized for efficient learning.
                </p>
                <ul className='mb-6 space-y-3'>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>Upload PDFs, slides, or any study material</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>Choose course size (S, M, L, XL)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>Perfect for quickly mastering specific content</span>
                  </li>
                </ul>
                <div className="rounded-lg bg-muted p-4">
                  <p className='font-medium text-sm'>
                    Example: Convert lecture slides into an interactive course
                  </p>
                </div>
              </div>
            </div>

            {/* Mode 3 */}
            <div className='group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md'>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/70" />
              <div className="p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <SearchIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className='mb-3 font-bold text-xl'>Deep Research Mode</h3>
                <p className="mb-6 text-muted-foreground">
                  Our AI autonomously navigates the web to find the best
                  resources and create a complete course from scratch.
                </p>
                <ul className='mb-6 space-y-3'>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>No prior user materials required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>AI finds and curates high-quality resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                    <span>
                      Ideal for exploring new topics without prior references
                    </span>
                  </li>
                </ul>
                <div className="rounded-lg bg-muted p-4">
                  <p className='font-medium text-sm'>
                    Example: Create an AI course without any existing materials
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNMSM Focus section with modern design */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className='grid items-center gap-12 md:grid-cols-2'>
              <div>
                <Badge className='mb-4 px-3 py-1 font-medium text-sm'>
                  Featured Program
                </Badge>
                <h2 className='mb-6 font-bold text-3xl'>
                  UNMSM Admission Preparation
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg">
                    In the Peruvian market, we're initially focusing on
                    specialized programs for admission to the country's top
                    universities, particularly national ones.
                  </p>
                  <p>
                    We're starting with Universidad Nacional Mayor de San Marcos
                    (UNMSM), which has a competitive 10% acceptance rate, making
                    it one of Peru's most selective institutions.
                  </p>
                  <p className="font-medium">
                    Our specialized UNMSM program combines:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                      <span>Targeted training on admission exam questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                      <span>
                        Solid theoretical foundations for each subject area
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                      <span>
                        Scientifically-proven learning techniques like active
                        recall and spaced repetition
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircleIcon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
                      <span>Analysis of patterns from previous exams</span>
                    </li>
                  </ul>
                  <p>
                    This approach doesn't just prepare students to pass the
                    exam—it builds a solid knowledge foundation for their
                    academic future.
                  </p>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="group">
                    Explore UNMSM Program
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className='-inset-0.5 absolute rounded-xl bg-gradient-to-r from-primary to-primary/50 opacity-30 blur-sm' />
                <div className="relative rounded-xl border bg-card p-8 shadow-md">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className='flex-shrink-0 rounded-full bg-primary/10 p-3'>
                        <FileTextIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className='mb-2 font-medium text-lg'>
                          Comprehensive Syllabus
                        </h3>
                        <p className="text-muted-foreground">
                          Based on the official prospectus and previous UNMSM
                          exams, covering all evaluated areas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className='flex-shrink-0 rounded-full bg-primary/10 p-3'>
                        <BookOpenIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className='mb-2 font-medium text-lg'>
                          Specialized Material
                        </h3>
                        <p className="text-muted-foreground">
                          Theoretical and practical content specifically
                          designed for the exam format and difficulty level.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className='flex-shrink-0 rounded-full bg-primary/10 p-3'>
                        <BrainIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className='mb-2 font-medium text-lg'>
                          Scientific Methodology
                        </h3>
                        <p className="text-muted-foreground">
                          We apply evidence-based learning techniques to
                          maximize retention and comprehension.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className='font-medium text-sm'>
                            UNMSM Acceptance Rate
                          </p>
                          <p className='font-bold text-3xl text-primary'>10%</p>
                        </div>
                        <div className='mx-4 h-12 border-l' />
                        <div>
                          <p className='font-medium text-sm'>Our Goal</p>
                          <p className='font-bold text-xl'>
                            Maximize Your Chances
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section with gradient background */}
      <section className="relative overflow-hidden py-20">
        {/* Background elements */}
        <div className='-z-10 absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5' />

        {/* Grid overlay */}
        <div
          className='-z-10 absolute inset-0 opacity-[0.02]'
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className='mb-4 px-3 py-1 font-medium text-sm'>
              Join Us
            </Badge>
            <h2 className='mb-6 font-bold text-3xl'>
              Join the Learning Revolution
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              We're transforming how people learn by combining artificial
              intelligence with scientific learning methodologies. Be part of
              this educational revolution.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button size="lg" className="group">
                Try Gradual Now
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
