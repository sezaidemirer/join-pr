import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { JoinSocialView } from '@/components/views/JoinSocialView';

export const metadata: Metadata = {
  title: en.pages.joinSocial.seo.title,
  description: en.pages.joinSocial.seo.description,
  openGraph: {
    title: en.pages.joinSocial.seo.title,
    description: en.pages.joinSocial.seo.description,
    url: 'https://www.joinpr.com/join-social',
  },
};

export default function JoinSocialPage() {
  return <JoinSocialView />;
}

