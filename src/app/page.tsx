import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeView } from '@/components/views/HomeView';
import { getLocale, getMetadataForLocale } from '@/lib/metadata';

const PROJE_ADMIN_HOST = 'proje.joinpr.com.tr';

function hostFromRequestHeaders(h: Headers): string {
  const xf = h.get('x-forwarded-host');
  if (xf) {
    const first = xf.split(',')[0]?.trim().split(':')[0]?.toLowerCase();
    if (first) return first;
  }
  return h.get('host')?.split(':')[0]?.toLowerCase() ?? '';
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  const metadata = getMetadataForLocale(
    locale,
    '/',
    'homepage.seo',
    [
      'PR agency',
      'strategic communication',
      'destination PR',
      'influencer marketing',
      'creative production',
      'social media management',
      'performance marketing',
      'AI solutions',
      'travel storytelling',
      'Join PR',
    ]
  );

  return {
    ...metadata,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home() {
  // Statik export (cPanel) disinda: kok domain proje.* ise ana sayfa yerine admin login (middleware yedek)
  if (process.env.STATIC_EXPORT !== '1') {
    const h = await headers();
    if (hostFromRequestHeaders(h) === PROJE_ADMIN_HOST) {
      redirect('/admin-login/');
    }
  }
  return <HomeView />;
}
