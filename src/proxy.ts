import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'supersecretneonkey2026',
  });

  const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin');

<<<<<<< HEAD
  // Redirect unauthenticated users trying to access protected paths
  if ((isAdminRoute || isAdminApi) && !token) {
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
=======
  if ((isAdminRoute || isAdminApi) && !token) {
    // Redirect to dashboard login (which renders LoginPage when unauthenticated)
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    url.searchParams.set('unauthorized', '1');
    // Only redirect if not already at /dashboard to avoid redirect loop
    if (req.nextUrl.pathname !== '/dashboard') {
      return NextResponse.redirect(url);
    }
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  }

  return NextResponse.next();
}

export const config = {
<<<<<<< HEAD
  // Apply proxy to dashboard and admin api routes
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};
