import { GradualLogo } from '@/components/gradual-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getI18n } from '@/locales/server';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const t = await getI18n();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background Dotted Patterns */}
      <div className="-z-10 fixed inset-0">
        <div className="absolute inset-0 animate-fade-in bg-[radial-gradient(circle,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Gradient Orbs */}
      <div className="-z-10 fixed inset-0 overflow-hidden">
        {/* Primary Orb - Warm */}
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

        {/* Secondary Orb - Cool */}
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

        {/* Accent Orb - Vibrant */}
        <div
          className="absolute top-1/2 left-1/3 h-[300px] w-[300px] animate-float"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-purple) 0%, transparent 70%)',
            opacity: 0.08,
            filter: 'blur(45px)',
            animation: 'float 15s ease-in-out infinite',
            transformOrigin: '40% 60%',
          }}
        />

        {/* Subtle Orb - Neutral */}
        <div
          className="absolute top-2/3 left-[60%] h-[250px] w-[250px] animate-float"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-green) 0%, transparent 70%)',
            opacity: 0.07,
            filter: 'blur(40px)',
            animation: 'float 22s ease-in-out infinite reverse',
            transformOrigin: '30% 70%',
          }}
        />

        {/* Mystery Orb - Ethereal */}
        <div
          className="absolute top-[20%] right-[25%] h-[200px] w-[200px] animate-float"
          style={{
            background:
              'radial-gradient(circle at center, var(--color-flexoki-green) 0%, transparent 70%)',
            opacity: 0.06,
            filter: 'blur(35px)',
            animation: 'float 18s ease-in-out infinite',
            transformOrigin: '70% 30%',
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 md:px-6 lg:px-8">
          <div className="w-full max-w-5xl space-y-12">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex animate-fade-in items-center gap-3 rounded-full border border-border/50 bg-background/50 px-5 py-2 text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <GradualLogo
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                  <span>{t('landing.badge.introducing')}</span>
                </div>
                <div className="h-4 w-px bg-border/50" />
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center gap-1.5">
                    <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text font-medium text-transparent">
                      {t('landing.badge.alpha')}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      • {t('landing.badge.alphaDescription')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative space-y-8 text-center">
              {/* Glow behind title */}
              <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-32 w-96 animate-duration-[2000ms] animate-pulse bg-primary/10 blur-[120px]" />

              <h1 className="relative animate-delay-[100ms] animate-duration-300 animate-fade-in bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text font-bold text-5xl text-transparent tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Master anything{' '}
                <span className="animate-delay-[150ms] animate-duration-300 animate-fade-in bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text">
                  gradually
                </span>
              </h1>

              <p className="mx-auto max-w-2xl animate-delay-[200ms] animate-duration-300 animate-fade-in text-lg text-muted-foreground md:text-xl">
                {t('landing.hero.description')}
              </p>
            </div>

            {/* Waitlist Section */}
            <div className="mx-auto mt-10 w-full max-w-3xl animate-delay-[400ms] animate-duration-500 animate-fade-in-up">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

                <div className="relative space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-bold text-2xl text-transparent">
                      {t('landing.waitlist.title')}
                    </h2>
                    <p className="text-muted-foreground">
                      {t('landing.waitlist.description')}
                    </p>
                  </div>

                  <form className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        type="text"
                        placeholder={t('landing.waitlist.namePlaceholder')}
                        className="h-12"
                      />
                      <Input
                        type="email"
                        placeholder={t('landing.waitlist.emailPlaceholder')}
                        className="h-12"
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="group h-12 min-w-[140px]"
                        asChild
                      >
                        <Link href="/courses">
                          {t('landing.waitlist.joinButton')}
                          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Legal Links Footer */}
      <footer className="relative z-10 pb-8">
        <div className="flex w-full justify-center">
          <div className="flex items-center gap-8 text-muted-foreground text-sm">
            <a
              href="https://docs.google.com/document/d/1kOZ_caLqJvJDXPQlEduQfuKQnJCYlCdxRtZs8emLJW4"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <span className="relative z-10 transition-colors group-hover:text-foreground">
                Terms of Service
              </span>
              <div className="-z-10 absolute inset-0 h-full w-full scale-[0.8] rounded-lg bg-primary/5 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
            </a>
            <div className="h-4 w-px bg-border/50" />
            <a
              href="https://docs.google.com/document/d/1HomOFWn-_bIMSOyykRzRMS0PJWUpSL8WxQ_QXnbc5eM"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <span className="relative z-10 transition-colors group-hover:text-foreground">
                Privacy Policy
              </span>
              <div className="-z-10 absolute inset-0 h-full w-full scale-[0.8] rounded-lg bg-primary/5 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//   <Link href="/courses">
//     <Button
//       size="lg"
//       className="group h-12 min-w-[160px] animate-delay-[250ms] animate-duration-300 animate-fade-in gap-2 text-base transition-all hover:scale-105"
//     >
//       <GraduationCapIcon className="h-4 w-4" />
//       {t('landing.hero.startButton')}
//       <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//     </Button>
//   </Link>
//   <Link href="/methodology" className="group relative">
//     <Button
//       variant="outline"
//       size="lg"
//       className="h-12 min-w-[160px] animate-delay-[300ms] animate-duration-300 animate-fade-in gap-2 text-base transition-all hover:scale-105"
//     >
//       <BookOpenIcon className="h-4 w-4" />
//       {t('landing.hero.methodologyButton')}
//     </Button>
//     <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
//       {t('landing.hero.methodologyHint')}
//     </div>
//   </Link>
// </div>

// <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
//   {[
//     {
//       label: t('landing.stats.learners.label'),
//       value: <BlurNumber value="10K+" blurStrength="md" />,
//       description: t('landing.stats.learners.description'),
//       delay: '500',
//     },
//     {
//       label: t('landing.stats.courses.label'),
//       value: <BlurNumber value="500+" blurStrength="sm" />,
//       description: t('landing.stats.courses.description'),
//       delay: '600',
//     },
//     {
//       label: t('landing.stats.success.label'),
//       value: <BlurNumber value="94%" blurStrength="lg" />,
//       description: t('landing.stats.success.description'),
//       delay: '700',
//     },
//   ].map((stat) => (
//     <div
//       key={stat.label}
//       className={cn(
//         'group relative animate-fade-in border border-border/50 bg-background/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/50',
//         {
//           'animate-delay-500': stat.delay === '500',
//           'animate-delay-600': stat.delay === '600',
//           'animate-delay-700': stat.delay === '700',
//         },
//       )}
//     >
//       <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//       <div className="relative space-y-2">
//         <div className="font-semibold text-3xl md:text-4xl">
//           {stat.value}
//         </div>
//         <div className="font-medium text-sm">{stat.label}</div>
//         <div className="text-muted-foreground text-sm">
//           {stat.description}
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
