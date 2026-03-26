import type { Metadata } from 'next';
import { SosyalMedyaYonetimiLandingView } from '@/components/views/landing/SosyalMedyaYonetimiLandingView';

const title = 'Sosyal Medya Yönetimi ve İçerik Operasyonu | Join PR';
const description =
  'Sosyal medyanızı çalışan bir sisteme dönüştürün: içerik planlama, takvim yönetimi, reels operasyonu, yorum ve mesaj yönetimi, raporlama. Otel, restoran, klinik, beauty ve kurumsal markalar için.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://joinpr.com.tr/reklam/sosyal-medya-yonetimi/',
    siteName: 'Join PR',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: { index: true, follow: true },
  keywords: [
    'sosyal medya yönetimi',
    'içerik planlama',
    'içerik takvimi',
    'reels yönetimi',
    'restoran sosyal medya',
    'otel sosyal medya yönetimi',
    'klinik sosyal medya',
    'beauty marka sosyal medya',
    'Join PR',
  ],
};

export default function SosyalMedyaYonetimiLandingPage() {
  return <SosyalMedyaYonetimiLandingView />;
}
