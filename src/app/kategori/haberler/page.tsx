import type { Metadata } from 'next';

import { NewsCategoryView } from '@/components/views/NewsCategoryView';
import { getLocale } from '@/lib/metadata';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const baseUrl = 'https://www.joinpr.com';
  const pageUrl = `${baseUrl}/kategori/haberler`;
  const translations = locale === 'tr' ? tr : en;
  
  const title = `${translations.homepage.cases.title} | Join PR Group`;
  const description = translations.homepage.cases.description;
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    keywords: [
      'PR news',
      'press coverage',
      'media relations',
      'public relations',
      'brand news',
      'communication news',
      'Join PR news',
      'PR agency news',
    ],
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Join PR Group',
      locale: ogLocale,
      alternateLocale: altLocale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-news.jpg`,
          width: 1200,
          height: 630,
          alt: translations.homepage.cases.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-news.jpg`],
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

export default function NewsCategoryPage() {
  return <NewsCategoryView />;
}



