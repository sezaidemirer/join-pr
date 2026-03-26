import { MedyaYansimaRaporuBrandClient } from './MedyaYansimaRaporuBrandClient';
import { getMedyaBrandStaticParams } from './staticParams';

export const generateStaticParams = getMedyaBrandStaticParams;

type PageProps = {
  params: { brand: string };
};

export default function MedyaYansimaRaporuBrandPage({ params }: PageProps) {
  return <MedyaYansimaRaporuBrandClient brandSlug={params.brand} />;
}
