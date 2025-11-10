import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { HomeView } from '@/components/views/HomeView';

export const metadata: Metadata = {
  title: en.homepage.seo.title,
  description: en.homepage.seo.description,
  openGraph: {
    title: en.homepage.seo.title,
    description: en.homepage.seo.description,
    url: 'https://www.joinpr.com',
  },
};

export default function Home() {
  return <HomeView />;
}
