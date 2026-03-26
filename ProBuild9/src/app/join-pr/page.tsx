import type { Metadata } from 'next';

import { JoinPrView } from '@/components/views/JoinPrView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/join-pr',
    'pages.joinPr.seo',
    [
      'strategic communication',
      'destination PR',
      'influencer relations',
      'global marketing',
      'event experience management',
      'brand positioning',
      'celebrity communication',
      'PR agency',
      'Join PR',
    ]
  );
}

export default function JoinPrPage() {
  return <JoinPrView />;
}

