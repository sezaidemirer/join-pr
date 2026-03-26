import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { InfluencerMarketingView } from '@/components/views/InfluencerMarketingView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Influencer Marketing | Join PR',
      description:
        "We develop comprehensive influencer marketing strategies that enable brands to build authentic, impactful, and conversion-focused relationships with their target audiences.",
    };
  }

  return {
    title: 'Influencer Marketing | Join PR',
    description:
      'Markaların hedef kitleleriyle otantik, etkileyici ve dönüşüm odaklı ilişkiler kurmasını sağlayan kapsamlı influencer marketing stratejileri geliştiririz.',
  };
}

export default function InfluencerMarketingPage() {
  return <InfluencerMarketingView />;
}

