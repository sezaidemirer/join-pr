import { fileNameFromUrl } from '@/lib/filename-from-url';

const UUID_FILE_STEM =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Galeri alt satırı: yol/URL yerine yalnızca marka adı (ör. Rixos Radamis, Prontotour).
 */
export function markaLogoDisplayName(labelOrPath: string, srcFallback?: string): string {
  const raw = (labelOrPath || '').trim() || (srcFallback || '').trim();
  if (!raw) return '';

  const base =
    fileNameFromUrl(raw) ||
    raw
      .split('/')
      .filter(Boolean)
      .pop() ||
    raw;
  let stem = base.replace(/\.(png|jpe?g|webp|svg|gif|avif)$/i, '').trim();
  if (!stem) return '';

  if (UUID_FILE_STEM.test(stem)) {
    return 'Logo';
  }

  stem = stem.replace(/_logos?$/i, '').replace(/-logos?$/i, '').trim();
  stem = stem.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!stem) return 'Logo';

  return stem
    .split(' ')
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLocaleLowerCase('tr-TR');
      return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1);
    })
    .join(' ');
}
