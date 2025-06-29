import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin role
      if (req.nextauth.token?.role !== 'admin') {
        // Redirect to home page if not admin
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for admin users
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        // For other protected routes, just check if user is logged in
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
