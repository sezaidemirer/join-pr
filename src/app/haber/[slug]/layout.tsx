import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import { getLocale } from '@/lib/metadata';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

interface NewsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const baseUrl = 'https://www.joinpr.com';
  const pageUrl = `${baseUrl}/haber/${slug}`;

  const casesEn = en.homepage.cases;
  const casesTr = tr.homepage.cases;
  const caseItemsEn = casesEn.cards as Array<{ title: string; category: string; description: string; image?: string }>;
  const caseItemsTr = casesTr.cards as Array<{ title: string; category: string; description: string; image?: string }>;

  const currentEn = caseItemsEn.find((item) => slugify(item.title) === slug);
  const currentTr = caseItemsTr.find((item) => slugify(item.title) === slug);

  // Kullanıcının diline göre öncelik ver
  const current = locale === 'tr' ? (currentTr || currentEn) : (currentEn || currentTr);

  if (!current) {
    const notFoundTitle = locale === 'tr' ? 'Haber Bulunamadı | Join PR Group' : 'News Not Found | Join PR Group';
    const notFoundDesc = locale === 'tr' 
      ? 'İstenen haber makalesi bulunamadı.'
      : 'The requested news article could not be found.';
    
    return {
      title: notFoundTitle,
      description: notFoundDesc,
    };
  }

  const title = `${current.title} | Join PR Group`;
  const description = current.description || (locale === 'tr' 
    ? `${current.title} hakkında Join PR Group'da okuyun.`
    : `Read about ${current.title} on Join PR Group.`);

  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    keywords: [
      'PR news',
      'press coverage',
      'media relations',
      current.category,
      'Join PR news',
      current.title,
    ],
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Join PR Group',
      locale: ogLocale,
      alternateLocale: altLocale,
      type: 'article',
      images: current.image
        ? [
            {
              url: `${baseUrl}${current.image}`,
              width: 1200,
              height: 630,
              alt: current.title,
            },
          ]
        : [
            {
              url: `${baseUrl}/og-news.jpg`,
              width: 1200,
              height: 630,
              alt: current.title,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: current.image ? [`${baseUrl}${current.image}`] : [`${baseUrl}/og-news.jpg`],
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

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

