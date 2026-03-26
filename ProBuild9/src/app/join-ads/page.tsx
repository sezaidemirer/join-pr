import type { Metadata } from 'next';

import { JoinAdsView } from '@/components/views/JoinAdsView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/join-ads',
    'pages.joinAds.seo',
    [
      'performance marketing',
      'digital advertising',
      'Google Ads',
      'Meta Ads',
      'campaign optimization',
      'ROAS',
      'conversion optimization',
      'media planning',
      'Join Ads',
    ]
  );
}

export default function JoinAdsPage() {
  return <JoinAdsView />;
}

