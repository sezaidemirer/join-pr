import type { Metadata } from 'next';

import { BlogCategoryView } from '@/components/views/BlogCategoryView';
import { getLocale } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const baseUrl = 'https://www.joinpr.com';
  const pageUrl = `${baseUrl}/kategori/blog`;
  
  const title = locale === 'tr' ? 'Blog | Join PR Group' : 'Blog | Join PR Group';
  const description = locale === 'tr' 
    ? 'Join PR blog yazıları ve içerikleri'
    : 'Join PR blog articles and insights about communication, marketing, creative production, and digital strategies.';
  
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    keywords: [
      'PR blog',
      'marketing blog',
      'communication insights',
      'digital marketing blog',
      'creative production blog',
      'social media blog',
      'Join PR blog',
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
          url: `${baseUrl}/og-blog.jpg`,
          width: 1200,
          height: 630,
          alt: 'Join PR Group Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-blog.jpg`],
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

export default function BlogCategoryPage() {
  return <BlogCategoryView />;
}



