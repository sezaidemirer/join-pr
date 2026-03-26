import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { CelebrityMarketingView } from '@/components/views/CelebrityMarketingView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Celebrity Marketing | Join PR',
      description:
        "We create celebrity marketing strategies that build powerful, credible, and high-impact connections between brands and audiences. Through our extensive network of actors, performers, cultural figures, and public personalities, we match brands with the most influential voices.",
    };
  }

  return {
    title: 'Celebrity Marketing | Join PR',
    description:
      'Markaların hedef kitleleriyle güçlü, güvenilir ve yüksek etkileşim yaratan bağlar kurmasını sağlayan kapsamlı celebrity marketing stratejileri geliştiririz. Dizi ve sinema oyuncuları, müzisyenler, sporcular ve kültürel figürlerden oluşan geniş network\'ümüzle markaları en doğru yüzlerle bir araya getiririz.',
  };
}

export default function CelebrityMarketingPage() {
  return <CelebrityMarketingView />;
}

