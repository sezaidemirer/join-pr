import type { Metadata } from 'next';

import { getLocale } from '@/lib/metadata';
import { MediaRelationsView } from '@/components/views/MediaRelationsView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === 'en') {
    return {
      title: 'Media Relations | Join PR',
      description:
        'Media relations strategies that reinforce brand visibility, strengthen positioning, and build lasting credibility across the media landscape.',
    };
  }

  return {
    title: 'Medya İlişkileri Yönetimi | Join PR',
    description:
      'Markaların medya dünyasındaki görünürlüğünü, konumunu ve itibarını güçlendirmek için kapsamlı medya ilişkileri stratejileri geliştiririz.',
  };
}

export default function MediaRelationsPage() {
  return <MediaRelationsView />;
}


