import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin');

  // Redirect unauthenticated users trying to access protected paths
  if ((isAdminRoute || isAdminApi) && !token) {
    // API routes: return JSON 401 (never redirect APIs to HTML pages)
    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Please sign in' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If they are hitting the dashboard root, just let it render (it acts as login page)
    if (req.nextUrl.pathname === '/dashboard') {
      return NextResponse.next();
    }
    
    // Otherwise, redirect to dashboard login
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.searchParams.set('unauthorized', '1');
    return NextResponse.redirect(url);
  }

  // RBAC for APIs: only ADMIN can access /api/admin endpoints
  if (isAdminApi && token?.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return NextResponse.next();
}

export const config = {
  // Apply proxy to dashboard and admin api routes
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};
