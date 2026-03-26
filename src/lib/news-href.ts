/** Apache rewrite sonrasi tarayici adresi /haber/foo iken Next route bazen /haber/detay kalir. */
export function haberSlugFromPathname(pathname: string): string {
  const base = (pathname || '').replace(/\/$/, '');
  const m = base.match(/^\/haber\/([^/]+)$/);
  if (!m?.[1] || m[1] === 'detay') return '';
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

/**
 * Tum haber kartlari temiz URL: /haber/{slug}/ (Vercel ile ayni gorunum).
 * cPanel'de fiziksel HTML yoksa public/.htaccess ayni adresi /haber/detay/ kabuguna yonlendirir.
 */
export function hrefForNewsCard(
  source: 'admin' | 'static',
  slug: string,
  options?: { externalSpecialUrl?: string }
): string {
  if (options?.externalSpecialUrl) return options.externalSpecialUrl;
  void source;
  const s = (slug || '').trim().replace(/^\/+/, '').replace(/\//g, '-');
  if (!s) return '/kategori/haberler';
  return `/haber/${s}`;
}
