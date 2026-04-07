import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';
import { listPublishedMediaReportTree } from '@/lib/media-reports';
import { getMediaTreeForStaticBuild } from '../../staticTree';
import { MedyaYansimaRaporuProjectClient } from './MedyaYansimaRaporuProjectClient';

export async function generateStaticParams() {
  try {
    const params: { brand: string; project: string }[] = [];
    const brands = await getMediaTreeForStaticBuild();
    for (const brand of brands) {
      for (const project of brand.projects) {
        params.push({ brand: brand.slug, project: project.slug });
      }
    }
    if (params.length) return params;
  } catch {
    // Build ortami API'ye erisemeyebilir, alttaki fallback'lere devam.
  }

  try {
    const params: { brand: string; project: string }[] = [];
    const brands = await listPublishedMediaReportTree();
    for (const brand of brands) {
      for (const project of brand.projects) {
        params.push({ brand: brand.slug, project: project.slug });
      }
    }
    if (params.length) return params;
  } catch {
    // Static export fallback: mevcut sabit listeyi kullan.
  }

  const params: { brand: string; project: string }[] = [];
  for (const brand of MEDYA_RAPORU_BRANDS) {
    for (const project of brand.projects) {
      params.push({ brand: brand.slug, project: project.slug });
    }
  }
  return params;
}

type PageProps = {
  params: { brand: string; project: string };
};

export default function MedyaYansimaRaporuProjectPage({ params }: PageProps) {
  return (
    <MedyaYansimaRaporuProjectClient
      brandSlug={params.brand}
      projectSlug={params.project}
    />
  );
}
