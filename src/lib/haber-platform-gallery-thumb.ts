/** Haber mecra galerisi: bu iki logo kutusu aynı kalır, görsel ~%30 büyütülür. */
export function isHaberPlatformLogoBoostedThumb(label: string, path: string): boolean {
  const s = `${label} ${path}`.toLowerCase();
  const tourism =
    s.includes('tourism-today') || s.includes('tourism today') || s.includes('tourismtoday');
  const gmDergi = s.includes('gm-dergi') || s.includes('gm dergi');
  return tourism || gmDergi;
}
