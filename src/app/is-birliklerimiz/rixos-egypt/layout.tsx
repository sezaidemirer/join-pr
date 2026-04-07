import type { Metadata } from 'next';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import { getLocale } from '@/lib/metadata';

const baseUrl = 'https://joinpr.com.tr';
const pageUrl = `${baseUrl}/is-birliklerimiz/rixos-egypt`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const translations = locale === 'tr' ? tr : en;
  const page = (translations as { pages?: { isbirliklerimiz?: { rixosEgypt?: { seo?: { title: string; description: string } } } } }).pages?.isbirliklerimiz?.rixosEgypt;
  const title = page?.seo?.title ?? 'Rixos Egypt İş Birliği | Join PR';
  const description = page?.seo?.description ?? 'Rixos Egypt Hotels ile katılımcı odaklı dijital kampanya. Join PR iş birlikleri raporu.';
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    keywords: [
      'Rixos Egypt',
      'Rixos Egypt Hotels',
      'konaklama katılımcı kampanyası',
      'dijital pazarlama',
      'Join PR',
      'iş birlikleri',
      'turizm kampanyası',
      'EMV',
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
          url: `${baseUrl}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.webp`],
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

export default function RixosEgyptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
