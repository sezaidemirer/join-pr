import type { Metadata } from 'next';

import { getLocale, getMetadataForLocale } from '@/lib/metadata';
import { ServicesView } from '@/components/views/ServicesView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/hizmetlerimiz',
    'pages.services.seo',
    [
      'Join PR services',
      'hizmetlerimiz',
      'PR hizmetleri',
      'iletişim hizmetleri',
      'Join Creative',
      'Join Social',
      'Join Ads',
      'Join Lab AI',
      'services',
      'PR services',
      'communication services',
      'creative production',
      'social media management',
      'performance marketing',
      'AI solutions',
    ]
  );
}

export default function ServicesPage() {
  return <ServicesView />;
}
