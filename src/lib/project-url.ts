const DEFAULT_PROJECT_BASE = 'https://proje.joinpr.com.tr';

/** Eski Vercel env veya yanlış kayıt: admin subdomain'ini asla kullanma. */
function normalizePublicProjectBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  return trimmed.replace(/^https?:\/\/admin\.joinpr\.com\.tr/i, DEFAULT_PROJECT_BASE);
}

/**
 * Panel hâlâ admin hostunda açıksa veya NEXT_PUBLIC_ build'de admin gömülüyse,
 * paylaşım linkleri yine de proje hostunda üretilsin (istemci + sunucu).
 */
export function getPublicProjectBaseUrl() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host === 'admin.joinpr.com.tr') {
      return DEFAULT_PROJECT_BASE;
    }
    if (host === 'proje.joinpr.com.tr') {
      return `${window.location.protocol}//proje.joinpr.com.tr`.replace(/\/+$/, '');
    }
  }

  const fromEnv = process.env.NEXT_PUBLIC_PROJECT_BASE_URL;
  return normalizePublicProjectBase(fromEnv || DEFAULT_PROJECT_BASE);
}

export function buildPublicProjectUrl(brandSlug: string, dateSlug: string) {
  const url = `${getPublicProjectBaseUrl()}/proje/${brandSlug}/${dateSlug}`;
  return url.replace(/^https?:\/\/admin\.joinpr\.com\.tr/i, DEFAULT_PROJECT_BASE);
}

