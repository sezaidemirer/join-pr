import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_COOKIE_NAME, getAdminCookieValue } from '@/lib/admin-auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedPage =
    pathname.startsWith('/admin-dashboard') ||
    pathname.startsWith('/admin/proje') ||
    pathname.startsWith('/admin/proje-olustur') ||
    pathname.startsWith('/admin/teklifler');
  const isProtectedApi =
    (pathname.startsWith('/api/admin/offers') ||
      pathname.startsWith('/api/admin/projects') ||
      pathname.startsWith('/api/admin/quotes') ||
      pathname.startsWith('/api/admin/upload-image') ||
      pathname.startsWith('/api/admin/upload-pdf') ||
      pathname.startsWith('/api/admin/upload-video')) &&
    !pathname.startsWith('/api/admin/login');

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token === getAdminCookieValue()) return NextResponse.next();

  if (isProtectedApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin-login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/admin/proje/:path*',
    '/admin/proje-olustur/:path*',
    '/admin/teklifler/:path*',
    '/api/admin/offers/:path*',
    '/api/admin/projects/:path*',
    '/api/admin/quotes/:path*',
    '/api/admin/upload-image/:path*',
    '/api/admin/upload-pdf/:path*',
    '/api/admin/upload-video/:path*',
  ],
};

