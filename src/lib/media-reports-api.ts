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

function mediaApiBaseForRuntime(): string {
  let base = (process.env.NEXT_PUBLIC_NEWS_API_ORIGIN || '').replace(/\/$/, '');
  if (typeof window === 'undefined') return base;

  const host = window.location.hostname.replace(/^www\./, '');
  const onJoinprMain = hostnameIsJoinprMain(host);
  const onProjeOrPreview =
    host === 'proje.joinpr.com.tr' || host === 'localhost' || host.endsWith('.vercel.app');

  // Ana site statik oldugunda medya raporu API'si proje origin'e yonlendirilir.
  if (onJoinprMain) {
    if (!base || originPointsToJoinprMain(base)) {
      return PROJE_API_DEFAULT;
    }
  }

  if (!onProjeOrPreview || !base) return base;

  try {
    const url = base.startsWith('http') ? base : `https://${base}`;
    const baseHost = new URL(url).hostname.replace(/^www\./, '');
    if (baseHost === JOINPR_MAIN) return '';
  } catch {
    return base;
  }
  return base;
}

export function getMediaReportsApiUrl(pathWithQuery: string): string {
  const base = mediaApiBaseForRuntime();
  if (!base) return pathWithQuery;
  return `${base}${pathWithQuery}`;
}
