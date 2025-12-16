import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { MarketingCommunicationsView } from '@/components/views/MarketingCommunicationsView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Marketing Communications | Join PR',
      description:
        "Integrated marketing communication strategies that articulate a brand’s value, define its positioning, and connect its message with the right audiences.",
    };
  }

  return {
    title: 'Pazarlama İletişimi | Join PR',
    description:
      'Markaların değer önerisini, konumlandırmasını ve mesajlarını doğru kitlelerle en etkili şekilde buluşturan bütünleşik pazarlama iletişimi stratejileri geliştiririz.',
  };
}

export default function MarketingCommunicationsPage() {
  return <MarketingCommunicationsView />;
}


