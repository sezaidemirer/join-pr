import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { SponsorshipCommunicationView } from '@/components/views/SponsorshipCommunicationView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Sponsorship Management | Join PR',
      description:
        'We develop comprehensive sponsorship communication strategies that enable brands to connect with their target audiences at the most relevant touchpoints.',
    };
  }

  return {
    title: 'Sponsorluk Yönetimi | Join PR',
    description:
      'Markaların hedef kitleleriyle en doğru temas noktalarında buluşmasını sağlayan kapsamlı sponsorluk iletişimi stratejileri geliştiririz.',
  };
}

export default function SponsorshipCommunicationPage() {
  return <SponsorshipCommunicationView />;
}

