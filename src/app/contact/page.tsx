import type { Metadata } from 'next';

import { ContactView } from '@/components/views/ContactView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/contact',
    'contact.seo',
    [
      'contact Join PR',
      'PR agency contact',
      'communication agency',
      'get in touch',
      'Join PR Group contact',
      'PR services',
      'marketing agency',
    ]
  );
}

export default function ContactPage() {
  return <ContactView />;
}

