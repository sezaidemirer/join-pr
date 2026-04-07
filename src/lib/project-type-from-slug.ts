export type ProjectType = 'production' | 'sponsorship' | 'press';

export const PROJECT_TYPE_PREFIX: Record<ProjectType, string> = {
  production: 'produksiyon-projesi',
  sponsorship: 'sponsorluk-projesi',
  press: 'basin-iletisim-projesi',
};

/** Admin listesi ve public sayfa icin `brand_slug` on ekinden tur. */
export function inferProjectTypeFromBrandSlug(brandSlug: string): ProjectType | null {
  if (brandSlug.startsWith(`${PROJECT_TYPE_PREFIX.production}-`)) return 'production';
  if (brandSlug.startsWith(`${PROJECT_TYPE_PREFIX.sponsorship}-`)) return 'sponsorship';
  if (brandSlug.startsWith(`${PROJECT_TYPE_PREFIX.press}-`)) return 'press';
  return null;
}

export const PROJECT_TYPE_SHORT_LABEL_TR: Record<ProjectType, string> = {
  production: 'Produksiyon',
  sponsorship: 'Sponsorluk',
  press: 'Basin Iletisim',
};
