/**
 * Haber / mecra logoları — Supabase Storage `haber-platform-logos` bucket (veya NEXT_PUBLIC_HABER_LOGOS_STORAGE_BASE).
 * Site `public/` klasöründen asla sunulmaz; env yoksa boş string döner.
 */
export const HABER_PLATFORM_LOGOS_BUCKET = 'haber-platform-logos';

function encodeObjectPath(key: string): string {
  return key
    .replace(/^\//, '')
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
}

/**
 * Bucket kökündeki dosya adı (örn. sondakika.webp veya gazete_pencere kopya.webp).
 */
export function haberPlatformLogoPublicUrl(objectName: string): string {
  const key = objectName.replace(/^\//, '');
  const customBase = (process.env.NEXT_PUBLIC_HABER_LOGOS_STORAGE_BASE || '').replace(/\/$/, '');
  if (customBase) {
    return `${customBase}/${encodeObjectPath(key)}`;
  }
  const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  if (supabase) {
    return `${supabase}/storage/v1/object/public/${HABER_PLATFORM_LOGOS_BUCKET}/${encodeObjectPath(key)}`;
  }
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn(
      '[haber-logo-storage] Mecra logolari icin NEXT_PUBLIC_SUPABASE_URL veya NEXT_PUBLIC_HABER_LOGOS_STORAGE_BASE gerekli; public klasorune dusulmez.'
    );
  }
  return '';
}

export function isRemoteHaberLogoStorageConfigured(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim() ||
      (process.env.NEXT_PUBLIC_HABER_LOGOS_STORAGE_BASE || '').trim()
  );
}

/** Supabase public object URL veya özel CDN tabanı — `haber-platform-logos` bucket. */
export function urlLooksLikeHaberPlatformStorage(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  const needle = `/object/public/${HABER_PLATFORM_LOGOS_BUCKET}/`;
  if (u.toLowerCase().includes(needle.toLowerCase())) return true;
  const customBase = (process.env.NEXT_PUBLIC_HABER_LOGOS_STORAGE_BASE || '').replace(/\/$/, '');
  if (customBase && (u === customBase || u.startsWith(`${customBase}/`))) return true;
  return false;
}
