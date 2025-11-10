import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { JoinEscapesView } from '@/components/views/JoinEscapesView';

export const metadata: Metadata = {
  title: en.pages.joinEscapes.seo.title,
  description: en.pages.joinEscapes.seo.description,
  openGraph: {
    title: en.pages.joinEscapes.seo.title,
    description: en.pages.joinEscapes.seo.description,
    url: 'https://www.joinpr.com/join-escapes',
  },
};

export default function JoinEscapesPage() {
  return <JoinEscapesView />;
}

