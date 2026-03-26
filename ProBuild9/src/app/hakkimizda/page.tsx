import type { Metadata } from 'next';

import { getLocale, getMetadataForLocale } from '@/lib/metadata';
import { AboutView } from '@/components/views/AboutView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/hakkimizda',
    'pages.about.seo',
    [
      'Join PR',
      'hakkımızda',
      'iletişim ajansı',
      'PR ajansı',
      'yeni nesil ajans',
      'marka iletişimi',
      'destination PR',
      'communication agency',
      'about us',
      'PR agency',
    ]
  );
}

export default function AboutPage() {
  return <AboutView />;
}
