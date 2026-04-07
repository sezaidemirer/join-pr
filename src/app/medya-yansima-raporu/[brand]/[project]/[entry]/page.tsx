import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';
import { MedyaYansimaRaporuEntryClient } from './MedyaYansimaRaporuEntryClient';

/**
 * Entry sayfaları client-side fetch ile yükleniyor.
 * .htaccess tüm /brand/project/entry URL'lerini rapor-detay/ shell'ine yönlendiriyor.
 * Bu sayfanın static export için en az bir parametre üretmesi yeterli.
 */
export function generateStaticParams() {
  const params: { brand: string; project: string; entry: string }[] = [];
  for (const brand of MEDYA_RAPORU_BRANDS) {
    for (const project of brand.projects) {
      params.push({ brand: brand.slug, project: project.slug, entry: '__placeholder__' });
    }
  }
  // Hiç proje tanımlı değilse en az bir parametre döndür
  if (!params.length) {
    params.push({ brand: 'rixos-egypt-hotel', project: 'rixos-radamis', entry: '__placeholder__' });
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
