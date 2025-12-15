import type { Metadata } from 'next';

import { JoinLabAiView } from '@/components/views/JoinLabAiView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return getMetadataForLocale(
    locale,
    '/join-lab-ai',
    'pages.joinLabAi.seo',
    [
      'web development',
      'AI solutions',
      'e-commerce automation',
      'AI agents',
      'chatbots',
      'mobile app development',
      'UI/UX design',
      'data integration',
      'Join AI Lab',
    ]
  );
}

export default function JoinLabAiPage() {
  return <JoinLabAiView />;
}

