import type { Metadata } from 'next';

import { JoinEscapesView } from '@/components/views/JoinEscapesView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/join-escapes',
    'pages.joinEscapes.seo',
    [
      'travel content platform',
      'travel guides',
      'destination stories',
      'travel experiences',
      'influencer travels',
      'travel journalism',
      'destination PR',
      'travel storytelling',
      'Join Escapes',
    ]
  );
}

export default function JoinEscapesPage() {
  return <JoinEscapesView />;
}

