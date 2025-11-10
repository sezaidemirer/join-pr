import type { Metadata } from 'next';

import en from '@/locales/en.json';
import { JoinLabAiView } from '@/components/views/JoinLabAiView';

export const metadata: Metadata = {
  title: en.pages.joinLabAi.seo.title,
  description: en.pages.joinLabAi.seo.description,
  openGraph: {
    title: en.pages.joinLabAi.seo.title,
    description: en.pages.joinLabAi.seo.description,
    url: 'https://www.joinpr.com/join-lab-ai',
  },
};

export default function JoinLabAiPage() {
  return <JoinLabAiView />;
}

