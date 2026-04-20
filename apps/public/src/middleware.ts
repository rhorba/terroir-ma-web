import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'ar', 'zgh'],
  defaultLocale: 'fr',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
