import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';
import { listPublishedMediaReportTree } from '@/lib/media-reports';
import { getMediaTreeForStaticBuild } from '../staticTree';

export async function getMedyaBrandStaticParams(): Promise<{ brand: string }[]> {
  try {
    const brands = await getMediaTreeForStaticBuild();
    if (brands.length) return brands.map((b) => ({ brand: b.slug }));
  } catch {
    // Build ortami API'ye erisemeyebilir, alttaki fallback'lere devam.
  }

  try {
    const brands = await listPublishedMediaReportTree();
    if (brands.length) return brands.map((b) => ({ brand: b.slug }));
  } catch {
    // Static export fallback: mevcut sabit listeyi kullan.
  }
  return MEDYA_RAPORU_BRANDS.map((b) => ({ brand: b.slug }));
}
