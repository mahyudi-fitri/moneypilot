import { NextResponse, type NextRequest } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/token';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except Next.js internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
