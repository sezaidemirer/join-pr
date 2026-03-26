import type { Metadata } from 'next';

import { getLocale, getMetadataForLocale } from '@/lib/metadata';
import { MedyaYansimaRaporuView } from '@/components/views/MedyaYansimaRaporuView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return getMetadataForLocale(
    locale,
    '/bana/medya-yansima-raporu',
    'pages.medyaYansimaRaporu.seo',
    [
      'medya yansıma raporu',
      'PR raporu',
      'basın takibi',
      'medya takip',
      'Join PR',
      'media coverage report',
      'PR report',
    ]
  );
}

export default function MedyaYansimaRaporuPage() {
  return <MedyaYansimaRaporuView />;
}
