import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'supersecretneonkey2026',
  });

  const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin');

  if ((isAdminRoute || isAdminApi) && !token) {
    // Redirect to dashboard login (which renders LoginPage when unauthenticated)
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.searchParams.set('unauthorized', '1');
    // Only redirect if not already at /dashboard to avoid redirect loop
    if (req.nextUrl.pathname !== '/dashboard') {
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};
