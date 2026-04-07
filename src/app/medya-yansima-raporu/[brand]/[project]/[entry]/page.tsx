import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';
import { getMediaTreeForStaticBuild } from '../../../staticTree';
import { MedyaYansimaRaporuEntryClient } from './MedyaYansimaRaporuEntryClient';

/**
 * Entry sayfaları client-side fetch ile yükleniyor.
 * Build sırasında API'dan gerçek brand/project slug'larını çekerek placeholder üretiyoruz.
 * .htaccess gerçek entry slug/uuid'lerini bu placeholder'a yönlendirir.
 */
export async function generateStaticParams() {
  // Önce API'dan gerçek ağacı çekmeyi dene
  try {
    const brands = await getMediaTreeForStaticBuild();
    if (brands.length) {
      return brands.flatMap((brand) =>
        brand.projects.map((project) => ({
          brand: brand.slug,
          project: project.slug,
          entry: '__placeholder__',
        }))
      );
    }
  } catch {
    // API erişilemedi, statik fallback'e geç
  }

  // Fallback: statik marka listesi
  const params: { brand: string; project: string; entry: string }[] = [];
  for (const brand of MEDYA_RAPORU_BRANDS) {
    for (const project of brand.projects) {
      params.push({ brand: brand.slug, project: project.slug, entry: '__placeholder__' });
    }
  }
  return params;
}

type PageProps = {
  params: { brand: string; project: string; entry: string };
};

export default function MedyaYansimaRaporuEntryPage({ params }: PageProps) {
  return (
    <MedyaYansimaRaporuEntryClient
      brandSlug={params.brand}
      projectSlug={params.project}
      entryId={params.entry}
    />
  );
}
