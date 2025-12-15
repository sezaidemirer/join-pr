import type { Metadata } from 'next';

import { JoinSocialView } from '@/components/views/JoinSocialView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/join-social',
    'pages.joinSocial.seo',
    [
      'social media strategy',
      'community management',
      'content calendar',
      'social media optimization',
      'social media management',
      'AI social media',
      'social media agency',
      'Join Social',
    ]
  );
}

export default function JoinSocialPage() {
  return <JoinSocialView />;
}

