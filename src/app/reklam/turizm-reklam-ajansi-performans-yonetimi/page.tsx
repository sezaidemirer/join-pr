import type { Metadata } from 'next';
import { TurizmLandingView } from '@/components/views/TurizmLandingView';

const title = 'Turizm Reklam Ajansı | Seyahat Acentaları için AI Destekli Performans Yönetimi | Join PR';
const description =
  'Turizm şirketleri ve seyahat acentaları için Google & Meta reklam yönetimi. Rakip analizi, destinasyon bazlı kampanya stratejisi ve ölçülebilir büyüme sistemi. Ücretsiz dijital konum analizi alın.';
const canonicalUrl = 'https://www.joinpr.com.tr/reklam/turizm-reklam-ajansi-performans-yonetimi/';
const ogImage = 'https://www.joinpr.com.tr/og-image.webp';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'turizm reklam ajansı',
    'seyahat acentası reklam',
    'tur operatörü dijital pazarlama',
    'Google Ads turizm',
    'Meta reklam seyahat',
    'rakip analizi turizm',
    'destinasyon bazlı reklam',
    'rezervasyon odaklı kampanya',
    'ROAS turizm',
    'AI rekabet analizi',
    'Join PR turizm',
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Turizm Reklam Ajansı | AI Destekli Performans Yönetimi | Join PR',
    description,
    url: canonicalUrl,
    siteName: 'Join PR',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Turizm Reklam Ajansı - AI Destekli Performans Yönetimi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turizm Reklam Ajansı | AI Destekli Performans Yönetimi | Join PR',
    description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function TurizmReklamAjansiPage() {
  return <TurizmLandingView />;
}
