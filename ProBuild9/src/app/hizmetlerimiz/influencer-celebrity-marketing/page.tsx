import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { InfluencerCelebrityMarketingView } from '@/components/views/InfluencerCelebrityMarketingView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Influencer & Celebrity Marketing | Join PR',
      description:
        "We build influencer marketing strategies that create authentic, high-impact connections between brands and their audiences. As a Meta Business with direct API integrations across TikTok and YouTube, we deliver accurate, real, and fully measurable performance analytics.",
    };
  }

  return {
    title: 'Influencer & Celebrity Marketing | Join PR',
    description:
      'Markaların hedef kitleleriyle otantik, etkileyici ve dönüşüm odaklı ilişkiler kurmasını sağlayan kapsamlı influencer marketing stratejileri geliştiririz. Meta Business, TikTok, YouTube gibi platformlarla API bağlantıları sayesinde ölçümlenebilir verilerle performans raporlama.',
  };
}

export default function InfluencerCelebrityMarketingPage() {
  return <InfluencerCelebrityMarketingView />;
}

