import type { Metadata } from 'next';
import { KreatifProduksiyonLandingView } from '@/components/views/landing/KreatifProduksiyonLandingView';

const title = 'Reklam Filmi ve Dijital İçerik Prodüksiyonu | Kreatif Prodüksiyon | Join PR';
const description =
  'Markanız için etki üreten prodüksiyon: reklam filmi, kısa video, ürün ve mekan çekimleri, otel tanıtım filmi, kampanya içerikleri ve AI destekli görsel/video üretimi. Turizm, otel, lifestyle ve premium markalar için.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://joinpr.com.tr/reklam/kreatif-produksiyon/',
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
    'reklam filmi prodüksiyon',
    'dijital içerik üretimi',
    'kısa video prodüksiyonu',
    'otel tanıtım filmi',
    'turizm prodüksiyonu',
    'reels shorts içerik',
    'AI video prodüksiyon',
    'kreatif prodüksiyon',
    'marka filmi',
    'Join PR',
  ],
};

export default function KreatifProduksiyonLandingPage() {
  return <KreatifProduksiyonLandingView />;
}
