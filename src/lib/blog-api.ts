/**
 * Statik hostingte `/api/blog` olmadigi icin, canli yazilar baska origin'den cekilebilir.
 * Ornek: NEXT_PUBLIC_NEWS_API_ORIGIN=https://proje.joinpr.com.tr
 * Bos birakilirsa ayni origin `/api/blog` kullanilir (Vercel / Node).
 */
const JOINPR_MAIN = 'joinpr.com.tr';
const PROJE_API_DEFAULT = 'https://proje.joinpr.com.tr';

function hostnameIsJoinprMain(hostname: string): boolean {
  return hostname.replace(/^www\./, '') === JOINPR_MAIN;
}

function originPointsToJoinprMain(base: string): boolean {
  if (!base) return false;
  try {
    const u = new URL(base.startsWith('http') ? base : `https://${base}`);
    return hostnameIsJoinprMain(u.hostname);
  } catch {
    return false;
  }
}

function blogApiBaseForRuntime(): string {
  let base = (process.env.NEXT_PUBLIC_NEWS_API_ORIGIN || '').replace(/\/$/, '');
  if (typeof window === 'undefined') return base;

  const host = window.location.hostname.replace(/^www\./, '');
  const onJoinprMain = hostnameIsJoinprMain(host);
  const onProjeOrPreview =
    host === 'proje.joinpr.com.tr' || host === 'localhost' || host.endsWith('.vercel.app');

  // --- Ana site (joinpr.com.tr statik): blog yazilari sadece proje API'den gelir ---
  if (onJoinprMain) {
    if (!base || originPointsToJoinprMain(base)) {
      return PROJE_API_DEFAULT;
    }
  }

  if (!onProjeOrPreview || !base) return base;

  try {
    const url = base.startsWith('http') ? base : `https://${base}`;
    const baseHost = new URL(url).hostname.replace(/^www\./, '');
    if (baseHost === JOINPR_MAIN) {
      return '';
    }
  } catch {
    return base;
  }
  return base;
}

export function getBlogApiUrl(querySuffix: string): string {
  const base = blogApiBaseForRuntime();
  const q = querySuffix.startsWith('?') ? querySuffix : querySuffix ? `?${querySuffix}` : '';
  const path = `/api/blog/${q}`;
  if (!base) return path;
  return `${base}${path}`;
}

function publicAssetOrigin(): string {
  return (process.env.NEXT_PUBLIC_ASSET_ORIGIN || '').replace(/\/$/, '');
}

export function resolveBlogImageSrc(path: string | null | undefined, basePath = ''): string {
  const p = (path || '').trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  const rel = p.startsWith('/') ? p : `/${p}`;
  const origin = publicAssetOrigin();
  if (origin) return `${origin}${rel}`;
  const bp = basePath.replace(/\/$/, '');
  return `${bp}${rel}`;
}
