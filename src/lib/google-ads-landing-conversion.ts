/** Google Ads: yalnızca reklam landing formlarında (FormConsentEmbed + başarı sinyali) kullanılır. */

export const GOOGLE_ADS_FORM_CONVERSION_SEND_TO =
  'AW-17641617179/mkIhCKrJxJscEJvultxB';

/** Iframe kaynakları: custom domain veya Zoho public host */
const ZOHO_PARENT_MESSAGE_ORIGINS = new Set([
  'https://forms.joinpr.com.tr',
  'https://forms.zohopublic.com',
  'https://forms.zoho.in',
  'https://forms.zoho.eu',
]);

function isKnownZohoFormsOrigin(origin: string): boolean {
  if (ZOHO_PARENT_MESSAGE_ORIGINS.has(origin)) return true;
  try {
    const u = new URL(origin);
    return (
      u.protocol === 'https:' &&
      (u.hostname === 'forms.zohopublic.com' ||
        u.hostname.endsWith('.zohopublic.com'))
    );
  } catch {
    return false;
  }
}

/** Geliştirme ortamı veya ?joinpr_ads_debug=1 veya localStorage joinpr_ads_debug=1 */
export function isGoogleAdsConversionDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NODE_ENV === 'development') return true;
  try {
    if (new URLSearchParams(window.location.search).get('joinpr_ads_debug') === '1') {
      return true;
    }
    if (window.localStorage?.getItem('joinpr_ads_debug') === '1') return true;
  } catch {
    /* ignore */
  }
  return false;
}

function previewMessageData(data: unknown, maxLen = 400): string {
  try {
    const s =
      typeof data === 'string' ? data : JSON.stringify(data, null, 0);
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
  } catch {
    return String(data);
  }
}

/** Konsol / teşhis: gelen mesajın neden eşleşmediğini açıklar */
export function explainZohoMessageForConversion(event: MessageEvent): {
  originOk: boolean;
  wouldConvert: boolean;
  reason: string;
  dataPreview: string;
} {
  const originOk = isKnownZohoFormsOrigin(event.origin);
  const dataPreview = previewMessageData(event.data);
  if (!originOk) {
    return {
      originOk: false,
      wouldConvert: false,
      reason: `Origin bu projede izlenen Zoho iframe kaynaklarından değil: "${event.origin}"`,
      dataPreview,
    };
  }
  const data = parseZohoPostMessagePayload(event.data);
  if (!data) {
    return {
      originOk: true,
      wouldConvert: false,
      reason:
        'Veri JSON nesnesi değil veya pipe ile ayrılmış yükseklik mesajı (ör. perma|yükseklik) — gönderim sinyali sayılmaz',
      dataPreview,
    };
  }
  if (data.zf_category !== 'Zoho Forms') {
    return {
      originOk: true,
      wouldConvert: false,
      reason: `zf_category beklenen değil (beklenen: "Zoho Forms"): ${JSON.stringify(data.zf_category)}`,
      dataPreview,
    };
  }
  const ev = data.event;
  if (typeof ev === 'string' && ev.toLowerCase() === 'zf_submitform') {
    return {
      originOk: true,
      wouldConvert: true,
      reason: 'zf_submitform eşleşti — conversion tetiklenecek (path + gtag uygunsa)',
      dataPreview,
    };
  }
  return {
    originOk: true,
    wouldConvert: false,
    reason: `event alanı zf_submitform değil: ${JSON.stringify(ev)}`,
    dataPreview,
  };
}

/** Reklam landing URL'leri: ana site /iletisim vb. dahil değil. */
export function isGoogleAdsLandingConversionPath(pathname: string): boolean {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
  if (normalized.startsWith('/reklam')) return true;
  if (normalized === '/clinic-reklam-ajansi-performans-yonetimi') return true;
  return false;
}

function parseZohoPostMessagePayload(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t.includes('|') && !t.startsWith('{')) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Zoho Forms Post Message Tracking: gönderim sonrası parent'a iletilen olay.
 * Yükseklik ayarı (perma|yükseklik) gibi pipe mesajları reddedilir.
 */
export function isZohoFormSuccessfulSubmitMessage(event: MessageEvent): boolean {
  if (!isKnownZohoFormsOrigin(event.origin)) return false;
  const data = parseZohoPostMessagePayload(event.data);
  if (!data) return false;
  if (data.zf_category !== 'Zoho Forms') return false;
  const ev = data.event;
  if (typeof ev === 'string' && ev.toLowerCase() === 'zf_submitform') return true;
  return false;
}

type OnceRef = { current: boolean };

export type FireGoogleAdsConversionResult =
  | 'fired'
  | 'already_fired'
  | 'wrong_path'
  | 'no_gtag'
  | 'ssr';

export function tryFireGoogleAdsLandingFormConversion(
  firedRef: OnceRef,
): FireGoogleAdsConversionResult {
  if (typeof window === 'undefined') return 'ssr';
  if (firedRef.current) return 'already_fired';
  if (!isGoogleAdsLandingConversionPath(window.location.pathname)) {
    return 'wrong_path';
  }
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  const gtag = w.gtag;
  if (typeof gtag !== 'function') return 'no_gtag';

  const sendTo = GOOGLE_ADS_FORM_CONVERSION_SEND_TO;
  firedRef.current = true;
  console.log('before conversion call', typeof gtag);
  try {
    gtag('event', 'conversion', { send_to: sendTo });
  } catch (e) {
    firedRef.current = false;
    console.error('[JoinPR] Google Ads conversion gtag hatası:', e);
    return 'no_gtag';
  }
  console.log('after conversion call');
  console.log('Google Ads conversion fired');

  if (isGoogleAdsConversionDebugEnabled()) {
    const dl = w.dataLayer;
    console.info(
      '[JoinPR Google Ads] dataLayer son girdi (kontrol):',
      Array.isArray(dl) && dl.length ? dl[dl.length - 1] : dl,
    );
    console.info(
      '[JoinPR Google Ads] Network: "collect" / "googleadservices" / "pagead/conversion" filtreleyin; bazı ortamlarda istek gecikmeli veya engellenmiş görünür (reklam engelleyici).',
    );
  }

  return 'fired';
}

/** @deprecated tryFireGoogleAdsLandingFormConversion kullanın (dönüş değeri test için) */
export function fireGoogleAdsLandingFormConversion(firedRef: OnceRef): void {
  tryFireGoogleAdsLandingFormConversion(firedRef);
}
