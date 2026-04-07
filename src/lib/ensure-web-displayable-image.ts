/** Tarayıcıda <img> ile güvenilir görüntülenen dosya (HEIC/HEIF → JPEG). */

export function isHeicLikeFile(file: File): boolean {
  const mime = (file.type || '').toLowerCase();
  if (mime === 'image/heic' || mime === 'image/heif') return true;
  return /\.(heic|heif|hif)$/i.test(file.name || '');
}

/** Public / yerel galeri URL’si HEIC mi (çoğu tarayıcıda img desteklemez). */
export function isHeicLikePublicUrl(url: string): boolean {
  const pathOnly = (url.split('?')[0] || '').toLowerCase();
  return /\.(heic|heif|hif)(#|$)/.test(pathOnly);
}

export async function ensureWebDisplayableImageFile(file: File): Promise<File> {
  if (!isHeicLikeFile(file)) return file;

  const heic2any = (await import('heic2any')).default;
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  const base = (file.name.replace(/\.(heic|heif|hif)$/i, '').trim() || 'photo')
    .replace(/[^\w.-]+/g, '-')
    .slice(0, 80) || 'photo';
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
}
