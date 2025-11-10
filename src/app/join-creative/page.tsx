import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { JoinCreativeView } from '@/components/views/JoinCreativeView';

export const metadata: Metadata = {
  title: en.pages.joinCreative.seo.title,
  description: en.pages.joinCreative.seo.description,
  openGraph: {
    title: en.pages.joinCreative.seo.title,
    description: en.pages.joinCreative.seo.description,
    url: 'https://www.joinpr.com/join-creative',
  },
};

export default function JoinCreativePage() {
  return <JoinCreativeView />;
}

