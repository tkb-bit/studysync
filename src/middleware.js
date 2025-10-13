import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // The `withAuth` middleware augments your `Request` with a `nextauth` object.
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If a user is already logged in and tries to visit a public page,
    // redirect them directly to the teacher dashboard.
    // Role-specific logic has been removed.
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
      return NextResponse.redirect(new URL('/teacher', req.url));
    }
    
    // No specific role-based checks are needed anymore.
    // The `authorized` callback below handles all route protection.

    return NextResponse.next();
  },
  {
    callbacks: {
      // This `authorized` callback is the core of the protection logic.
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Define the pages that are publicly accessible.
        const publicPages = ['/login', '/signup'];

        // If the user is trying to access a public page, always allow them.
        if (publicPages.includes(pathname)) {
          return true;
        }

        // For any non-public page, the user must have a token (be logged in).
        // `withAuth` will automatically handle redirection to '/login' if this returns false.
        return !!token;
      },
    },
  }
);

// This config specifies which paths the middleware should run on.
// You can remove '/student/:path*' if that route is no longer in use.
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/teacher/:path*',
    '/student/:path*', // Kept in case you have student pages accessible to all users
  ],
};

