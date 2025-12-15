import type { Metadata } from 'next';

import { JoinCreativeView } from '@/components/views/JoinCreativeView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/join-creative',
    'pages.joinCreative.seo',
    [
      'digital content production',
      'commercial films',
      'photography',
      'brand stories',
      'video production',
      'creative studio',
      'content creation',
      'AI visual production',
      'Join Creative',
    ]
  );
}

export default function JoinCreativePage() {
  return <JoinCreativeView />;
}

