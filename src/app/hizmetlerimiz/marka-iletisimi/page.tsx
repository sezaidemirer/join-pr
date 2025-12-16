import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { BrandCommunicationView } from '@/components/views/BrandCommunicationView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Brand Communication | Join PR',
      description:
        'Brand communication frameworks that define identity, amplify value, and create lasting relevance for brands.',
    };
  }

  return {
    title: 'Marka İletişimi | Join PR',
    description:
      'Markaların kimliğini, değerlerini ve vaadini doğru kitlelerle buluşturan iletişim modelleriyle güçlü marka algısı oluşturur.',
  };
}

export default function BrandCommunicationPage() {
  return <BrandCommunicationView />;
}


