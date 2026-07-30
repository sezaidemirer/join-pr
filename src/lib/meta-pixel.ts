export const META_PIXEL_ID = '1727596148231683';

type OnceRef = { current: boolean };

export type FireMetaPixelResult =
  | 'fired'
  | 'already_fired'
  | 'no_fbq'
  | 'ssr';

export function tryFireMetaPixelLead(firedRef: OnceRef): FireMetaPixelResult {
  if (typeof window === 'undefined') return 'ssr';
  if (firedRef.current) return 'already_fired';
  const fbq = (window as unknown as { fbq?: (...args: any[]) => void }).fbq;
  if (typeof fbq !== 'function') return 'no_fbq';
  firedRef.current = true;
  try {
    fbq('track', 'Lead');
  } catch {
    firedRef.current = false;
    return 'no_fbq';
  }
  return 'fired';
}

