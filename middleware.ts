import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Lee la cookie manualmente porque no podés usar JWT ni getToken
  const session = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');

  const isAuth = !!session;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  console.log('[MIDDLEWARE] Is authenticated:', isAuth);

  if (isDashboardRoute && !isAuth) {
    const signInUrl = new URL('/api/auth/signin', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Middleware se ejecuta solo en /dashboard/**
};
