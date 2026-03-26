import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';

export function getMedyaBrandStaticParams(): { brand: string }[] {
  return MEDYA_RAPORU_BRANDS.map((b) => ({ brand: b.slug }));
}
