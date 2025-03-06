import { GradualLogo } from '@/components/gradual-logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DebugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Simple header for debug section */}
      <header className="relative z-10 w-full border-white/5 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <GradualLogo width={28} height={28} className="text-primary" />
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/">
                <span className="font-mono text-lg tracking-tight">
                  Gradual
                </span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/debug">
                <span className='font-mono text-muted-foreground text-sm'>
                  Debug
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-transparent hover:border-white/20"
              asChild
            >
              <Link href="/">Back to Site</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Simple footer for debug section */}
      <footer className="border-border/10 border-t bg-background/50 py-6 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-sm">
              Debug Tools - For Development Use Only
            </p>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Return to Site
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
