import type { Metadata } from 'next';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import { getLocale } from '@/lib/metadata';

const baseUrl = 'https://joinpr.com.tr';
const pageUrl = `${baseUrl}/is-ortaklarimiz`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const translations = locale === 'tr' ? tr : en;
  
  const title = `${translations.homepage.clients.title} | Join PR`;
  const description = translations.homepage.clients.description;
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    keywords: [
      'partners',
      'clients',
      'brands',
      'Join PR partners',
      'PR agency clients',
      'brand partnerships',
      'Join PR partners',
    ],
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Join PR',
      locale: ogLocale,
      alternateLocale: altLocale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-partners.jpg`,
          width: 1200,
          height: 630,
          alt: translations.homepage.clients.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-partners.jpg`],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'tr-TR': pageUrl,
        'en-US': pageUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

