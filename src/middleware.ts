import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextResponse } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});

const isProtectedRoute = createRouteMatcher(['dashboard/(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
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
