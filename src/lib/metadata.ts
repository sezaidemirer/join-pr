import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

export type Locale = 'tr' | 'en';

const STORAGE_KEY = 'joinpr_locale';

/**
 * Server-side dil tercihini cookie'den alır, yoksa Accept-Language header'ına bakar
 * Static export için uyumlu: build zamanında cookie/header yoksa varsayılan 'tr' döndürür
 */
export async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(STORAGE_KEY);
    
    if (localeCookie?.value === 'tr' || localeCookie?.value === 'en') {
      return localeCookie.value;
    }
  } catch (error) {
    // Cookie okuma hatası (örneğin, static export sırasında)
    // Bu durumda varsayılan olarak 'tr' döndür
    return 'tr';
  }
  
  // Cookie yoksa Accept-Language header'ını kontrol et
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      // Accept-Language: en-US,en;q=0.9,tr;q=0.8 formatında gelir
      const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());
      
      // İngilizce öncelikli mi kontrol et
      if (languages.some(lang => lang.startsWith('en'))) {
        return 'en';
      }
      // Türkçe öncelikli mi kontrol et
      if (languages.some(lang => lang.startsWith('tr'))) {
        return 'tr';
      }
    }
  } catch (error) {
    // Header okuma hatası (örneğin, static export sırasında)
    // Bu durumda varsayılan olarak 'tr' döndür
  }
  
  // Varsayılan olarak Türkçe
  return 'tr';
}

/**
 * Dil bilgisine göre metadata oluşturur
 */
export function getMetadataForLocale(
  locale: Locale,
  pagePath: string,
  seoPath: string,
  keywords: string[] = []
): Metadata {
  const baseUrl = 'https://www.joinpr.com';
  // pagePath zaten tam URL veya path olabilir
  const pageUrl = pagePath.startsWith('http') ? pagePath : `${baseUrl}${pagePath}`;
  const translations = locale === 'tr' ? tr : en;
  
  // SEO bilgilerini çeviri dosyasından al
  const seoData = seoPath.split('.').reduce((obj: any, key: string) => obj?.[key], translations);
  
  const title = seoData?.title || 'Join PR Group';
  const description = seoData?.description || translations.homepage.seo.description;
  
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';
  const altLocale = locale === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
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
          url: `${baseUrl}/og-image.jpg`,
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
      images: [`${baseUrl}/og-image.jpg`],
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

/**
 * Metni slug formatına çevirir (URL-friendly)
 */
export const slugify = (text: string) =>
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

