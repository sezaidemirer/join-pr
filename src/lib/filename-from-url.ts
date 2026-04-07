/** URL veya yol dizesinden son segmenti (dosya adı) güvenli şekilde çıkarır. */
export function fileNameFromUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  try {
    const noQuery = trimmed.split('?')[0] ?? trimmed;
    const noHash = noQuery.split('#')[0] ?? noQuery;
    const parts = noHash.split('/').filter(Boolean);
    const last = parts[parts.length - 1] ?? '';
    return decodeURIComponent(last) || '';
  } catch {
    return '';
  }
}
