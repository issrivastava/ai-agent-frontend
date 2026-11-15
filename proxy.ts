import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'token'; // must match the cookie name Express will set
const publicPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (!request.cookies.has(AUTH_COOKIE) && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};