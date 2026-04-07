/**
 * Marka logosu galerisi: Ajet ve Vitrin Clinic bu eşleşmede taban boyutta kalır;
 * diğer tüm logolar görüntü alanı ~%40 büyütülür.
 */
export function isBrandLogoGalleryExcludedFromBoost(label: string, path: string): boolean {
  const s = `${label} ${path}`.toLowerCase();
  return s.includes('ajet') || s.includes('vitrin');
}
