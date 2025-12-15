import type { Metadata } from 'next';

import { HomeView } from '@/components/views/HomeView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  const metadata = getMetadataForLocale(
    locale,
    '/',
    'homepage.seo',
    [
      'PR agency',
      'strategic communication',
      'destination PR',
      'influencer marketing',
      'creative production',
      'social media management',
      'performance marketing',
      'AI solutions',
      'travel storytelling',
      'Join PR Group',
    ]
  );

  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function Home() {
  return <HomeView />;
}
