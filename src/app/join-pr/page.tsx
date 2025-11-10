import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { JoinPrView } from '@/components/views/JoinPrView';

export const metadata: Metadata = {
  title: en.pages.joinPr.seo.title,
  description: en.pages.joinPr.seo.description,
  openGraph: {
    title: en.pages.joinPr.seo.title,
    description: en.pages.joinPr.seo.description,
    url: 'https://www.joinpr.com/join-pr',
  },
};

export default function JoinPrPage() {
  return <JoinPrView />;
}

