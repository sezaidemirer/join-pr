import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';
import { MedyaYansimaRaporuProjectClient } from './MedyaYansimaRaporuProjectClient';

export function generateStaticParams() {
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
