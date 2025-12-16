import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { DigitalPrView } from '@/components/views/DigitalPrView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Digital PR | Join PR',
      description:
        "We design digital PR strategies that elevate brand visibility, reputation, and influence across the online ecosystem. Through online media, social platforms, digital publishers, content creation, and influencer collaborations.",
    };
  }

  return {
    title: 'Dijital PR | Join PR',
    description:
      'Markaların dijital dünyadaki görünürlüğünü, itibarını ve etkileşim gücünü artıran stratejik dijital PR çözümleri sunarız. Online medya, sosyal platformlar, içerik üretimi, influencer iş birlikleri ve dijital yayınlar.',
  };
}

export default function DigitalPrPage() {
  return <DigitalPrView />;
}

