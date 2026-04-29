import { auth } from '@/auth';
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['fr', 'ar', 'zgh'],
  defaultLocale: 'fr',
});

const ROLE_ROUTES: Record<string, string> = {
  '/super-admin': 'super-admin',
  '/cooperative-admin': 'cooperative-admin',
  '/cooperative-member': 'cooperative-member',
  '/lab-technician': 'lab-technician',
  '/inspector': 'inspector',
  '/certification-body': 'certification-body',
  '/customs-agent': 'customs-agent',
};

const PUBLIC_SEGMENTS = ['/login', '/unauthorized', '/api/auth'];

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isPublic = PUBLIC_SEGMENTS.some((seg) => pathname.includes(seg));

  if (!req.auth && !isPublic) {
    return Response.redirect(new URL('/fr/login', req.url));
  }

  if (req.auth && !isPublic) {
    const roles: string[] =
      (req.auth.user as { roles?: string[] }).roles ?? [];
    for (const [segment, requiredRole] of Object.entries(ROLE_ROUTES)) {
      if (pathname.includes(segment) && !roles.includes(requiredRole)) {
        return Response.redirect(new URL('/fr/unauthorized', req.url));
      }
    }
  }

  return intlMiddleware(req) as unknown as Response;
});

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
