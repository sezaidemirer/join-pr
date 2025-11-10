import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { JoinAdsView } from '@/components/views/JoinAdsView';

export const metadata: Metadata = {
  title: en.pages.joinAds.seo.title,
  description: en.pages.joinAds.seo.description,
  openGraph: {
    title: en.pages.joinAds.seo.title,
    description: en.pages.joinAds.seo.description,
    url: 'https://www.joinpr.com/join-ads',
  },
};

export default function JoinAdsPage() {
  return <JoinAdsView />;
}

