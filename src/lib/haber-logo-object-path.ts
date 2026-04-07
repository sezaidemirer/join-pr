import { HABER_PLATFORM_LOGOS_BUCKET } from '@/lib/haber-logo-storage';

/**
 * Supabase public object URL → storage object key (bucket içi yol).
 */
export function parseHaberPlatformLogoObjectPathFromUrl(urlStr: string): string | null {
  const trimmed = (urlStr || '').trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    const needle = `/storage/v1/object/public/${HABER_PLATFORM_LOGOS_BUCKET}/`;
    const idx = u.pathname.indexOf(needle);
    if (idx < 0) return null;
    const raw = u.pathname.slice(idx + needle.length);
    const key = raw
      .split('/')
      .filter(Boolean)
      .map((seg) => {
        try {
          return decodeURIComponent(seg);
        } catch {
          return seg;
        }
      })
      .join('/');
    if (!key || key.includes('..')) return null;
    return key;
  } catch {
    return null;
  }
}

/**
 * `/dosya.webp` veya tam URL (yukarıdaki pattern) → object key.
 * `sub-brand-logos-archive` ve bilinmeyen çoklu segment reddedilir.
 */
export function resolveHaberPlatformLogoObjectKey(pathOrUrl: string): string | null {
  const fromUrl = parseHaberPlatformLogoObjectPathFromUrl(pathOrUrl);
  if (fromUrl) return fromUrl;
  const p = (pathOrUrl || '').trim();
  if (!p || p.includes('..')) return null;
  if (/^https?:\/\//i.test(p)) return null;
  const key = p.replace(/^\/+/, '');
  if (!key) return null;
  if (key.startsWith('sub-brand-logos-archive/')) return null;
  const rootFile = /^[^/]+\.[^/.]+$/i.test(key);
  const uploadsPath = /^uploads\/\d{4}\/\d{2}\/[^/]+$/i.test(key);
  if (rootFile || uploadsPath) return key;
  return null;
}
