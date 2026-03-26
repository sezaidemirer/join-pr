/**
 * Statik hostingte `/api/news` olmadigi icin, canli haberler baska origin'den cekilebilir.
 * Ornek: NEXT_PUBLIC_NEWS_API_ORIGIN=https://proje.joinpr.com.tr
 * Bos birakilirsa ayni origin `/api/news` kullanilir (Vercel / Node).
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

function newsApiBaseForRuntime(): string {
  let base = (process.env.NEXT_PUBLIC_NEWS_API_ORIGIN || '').replace(/\/$/, '');
  if (typeof window === 'undefined') return base;

  const host = window.location.hostname.replace(/^www\./, '');
  const onJoinprMain = hostnameIsJoinprMain(host);
  const onProjeOrPreview =
    host === 'proje.joinpr.com.tr' || host === 'localhost' || host.endsWith('.vercel.app');

  // --- Ana site (joinpr.com.tr statik): haberler sadece proje API'den gelir ---
  if (onJoinprMain) {
    if (!base || originPointsToJoinprMain(base)) {
      return PROJE_API_DEFAULT;
    }
  }

  if (!onProjeOrPreview || !base) return base;

  try {
    const url = base.startsWith('http') ? base : `https://${base}`;
    const baseHost = new URL(url).hostname.replace(/^www\./, '');
    // proje.joinpr.com.tr sayfasinda env yanlislikla ana site ise ayni origin /api/news kullan
    if (baseHost === JOINPR_MAIN) {
      return '';
    }
  } catch {
    return base;
  }
  return base;
}

export function getNewsApiUrl(querySuffix: string): string {
  const base = newsApiBaseForRuntime();
  const q = querySuffix.startsWith('?') ? querySuffix : querySuffix ? `?${querySuffix}` : '';
  // Vercel bazen /api/news -> /api/news/ icin 308 verir; cross-origin'de redirect CORS bozabilir.
  // O yuzden her zaman slash'li endpoint kullan.
  const path = `/api/news/${q}`;
  if (!base) return path;
  return `${base}${path}`;
}

/** Ana sitedeki /public dosyalari (or. /logo.webp). Proje subdomain/Vercel'de goreli yol 404 verir; bos degilse prefix ekle. */
function publicAssetOrigin(): string {
  return (process.env.NEXT_PUBLIC_ASSET_ORIGIN || '').replace(/\/$/, '');
}

/**
 * Tarayicide gosterim: tam URL, veya goreli /path (istege bagli ana site koku).
 * Vercel'de: NEXT_PUBLIC_ASSET_ORIGIN=https://joinpr.com.tr
 */
export function resolveNewsImageSrc(path: string | null | undefined, basePath = ''): string {
  const p = (path || '').trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  const rel = p.startsWith('/') ? p : `/${p}`;
  const origin = publicAssetOrigin();
  if (origin) return `${origin}${rel}`;
  const bp = basePath.replace(/\/$/, '');
  return `${bp}${rel}`;
}

/** Sunucu: DB'ye yazarken mecra/kapak icin goreli yolu tam URL yap (ortak gorsel hostu). */
export function absolutizePublicAssetPath(path: string | null | undefined): string {
  const p = (path || '').trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  const rel = p.startsWith('/') ? p : `/${p}`;
  const origin = publicAssetOrigin();
  if (origin) return `${origin}${rel}`;
  return rel;
}
