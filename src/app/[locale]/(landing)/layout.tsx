'use client';

import { GradualLogo } from '@/components/gradual-logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import * as React from 'react';

const PlatformLinks = [
  {
    title: 'Features',
    href: '/features',
    description:
      'Explore the powerful features that make Gradual the best learning platform',
  },
  {
    title: 'Methodology',
    href: '/methodology',
    description:
      'Learn about our research-backed approach to effective learning',
  },
  {
    title: 'Our Vision',
    href: '/our-vision',
    description:
      'Discover our mission to transform education through personalized learning',
  },
];

const ResourceLinks = [
  {
    title: 'Documentation',
    href: '/docs',
    description: 'Comprehensive guides to help you get the most out of Gradual',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Insights, updates, and educational content from our team',
  },
  {
    title: 'Tutorials',
    href: '/tutorials',
    description: 'Step-by-step guides and video tutorials for Gradual users',
  },
];

const CompanyLinks = [
  {
    title: 'About Us',
    href: '/about',
    description: 'Get to know our team and the story behind Gradual',
  },
  {
    title: 'Success Stories',
    href: '/success-stories',
    description: 'See how students and educators are succeeding with Gradual',
  },
  {
    title: 'Careers',
    href: '/careers',
    description: 'Join our team and help shape the future of education',
  },
  {
    title: 'Roadmap',
    href: '/roadmap',
    description: "See what's coming next for the Gradual platform",
  },
];

// List item component for navigation dropdown
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className='font-medium text-sm leading-none'>{title}</div>
          <p className='line-clamp-2 text-muted-foreground text-sm leading-snug'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Advanced background with layered elements */}
      <div className="-z-10 fixed inset-0 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

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

        {/* Diagonal lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full">
            {[
              { id: 'line-1', position: 10 },
              { id: 'line-2', position: 25 },
              { id: 'line-3', position: 40 },
              { id: 'line-4', position: 55 },
              { id: 'line-5', position: 70 },
              { id: 'line-6', position: 85 },
              { id: 'line-7', position: 100 },
              { id: 'line-8', position: 115 },
            ].map((line, i) => (
              <div
                key={line.id}
                className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent"
                style={{
                  top: `${line.position}%`,
                  left: '-50%',
                  transform: 'rotate(-15deg)',
                  opacity: 0.5 - i * 0.05,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Asymmetrical header with dynamic elements */}
      <header className="relative z-10 w-full border-white/5 border-b">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <GradualLogo width={32} height={32} className="text-primary" />
            </Link>
            <Link href="/">
              <span className="font-bold text-lg tracking-tight">Gradual</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {PlatformLinks.map((link) => (
                        <ListItem
                          key={link.title}
                          title={link.title}
                          href={link.href}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {ResourceLinks.map((link) => (
                        <ListItem
                          key={link.title}
                          title={link.title}
                          href={link.href}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {CompanyLinks.map((link) => (
                        <ListItem
                          key={link.title}
                          title={link.title}
                          href={link.href}
                        >
                          {link.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden border-white/10 bg-transparent hover:border-white/20 sm:flex"
            >
              Sign In
            </Button>
            <Button size="sm" className="group relative overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 transition-opacity group-hover:opacity-90" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer with original structure but enhanced styling */}
      <footer className="border-border/10 border-t bg-background/50 py-16 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GradualLogo width={28} height={28} className="text-primary" />
                <span className="font-mono text-lg tracking-tight">
                  Gradual
                </span>
              </div>
              <p className="max-w-xs text-muted-foreground text-sm">
                Redefining self-directed learning with an emphasis on efficiency
                and engagement through scientific principles.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#features"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/methodology"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/success-stories"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/roadmap"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 border-white/10 border-t pt-8'>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Gradual. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
