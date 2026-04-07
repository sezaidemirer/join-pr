import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_COOKIE_NAME, getAdminCookieValue } from '@/lib/admin-auth';

const PROJE_ADMIN_HOSTS = new Set(['proje.joinpr.com.tr']);

function requestHostname(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-host');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim().split(':')[0]?.toLowerCase();
    if (first) return first;
  }
  return req.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
}

/** trailingSlash ile kok sayfa `/` veya sadece `/` tekrarlari */
function isSiteRootPath(pathname: string): boolean {
  const trimmed = pathname.replace(/\/+$/, '') || '/';
  return trimmed === '/' || trimmed === '';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = requestHostname(req);

  // proje.joinpr.com.tr (kok URL) -> /admin-login/ ; API ve diger path'lere dokunulmaz
  if (PROJE_ADMIN_HOSTS.has(host) && isSiteRootPath(pathname)) {
    return NextResponse.redirect(new URL('/admin-login/', req.url));
  }

  const isProtectedPage =
    pathname === '/admin' ||
    pathname.startsWith('/admin/proje') ||
    pathname.startsWith('/admin/proje-olustur') ||
    pathname.startsWith('/admin/teklifler') ||
    pathname.startsWith('/admin/haber');
  const isProtectedApi =
    (pathname.startsWith('/api/admin/offers') ||
      pathname.startsWith('/api/admin/projects') ||
      pathname.startsWith('/api/admin/quotes') ||
      pathname.startsWith('/api/admin/news') ||
      pathname.startsWith('/api/admin/upload-image') ||
      pathname.startsWith('/api/admin/upload-pdf') ||
      pathname.startsWith('/api/admin/upload-video') ||
      pathname.startsWith('/api/admin/haber-platform-logos')) &&
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
    '/',
    '/admin',
    '/admin/proje/:path*',
    '/admin/proje-olustur/:path*',
    '/admin/teklifler/:path*',
    '/admin/haber/:path*',
    '/admin-dashboard/:path*',
    '/api/admin/offers/:path*',
    '/api/admin/projects/:path*',
    '/api/admin/quotes/:path*',
    '/api/admin/news/:path*',
    '/api/admin/upload-image/:path*',
    '/api/admin/upload-pdf/:path*',
    '/api/admin/upload-video/:path*',
    '/api/admin/haber-platform-logos/:path*',
  ],
};

