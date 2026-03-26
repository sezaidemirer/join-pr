import type { Metadata } from 'next';

import { getLocale, getMetadataForLocale } from '@/lib/metadata';
import { AboutView } from '@/components/views/AboutView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/en/about-us',
    'pages.about.seo',
    [
      'Join PR',
      'about us',
      'communication agency',
      'PR agency',
      'next generation agency',
      'brand communication',
      'destination PR',
    ]
  );
}

export default function AboutUsPage() {
  return <AboutView />;
}
