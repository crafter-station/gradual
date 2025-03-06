import { clerkMiddleware } from '@clerk/nextjs/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextResponse } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});

export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname.split('/tasks/').length > 1 &&
    request.nextUrl.pathname.split('/tasks/')[1].length === 36
  ) {
    await auth.protect();
  }

  return I18nMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
