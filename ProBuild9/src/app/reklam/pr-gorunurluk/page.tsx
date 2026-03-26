import type { Metadata } from 'next';
import { PRGorunurlukLandingView } from '@/components/views/landing/PRGorunurlukLandingView';

const title = 'PR, Influencer ve Celebrity Marketing | Görünürlük Stratejisi | Join PR';
const description =
  'Influencer, celebrity ve medya etkisini tek kampanyada birleştirin. Turizm, otel, lifestyle ve premium markalar için PR ajansı, influencer marketing ve dijital görünürlük hizmetleri.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://joinpr.com.tr/reklam/pr-gorunurluk/',
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
    'PR ajansı',
    'influencer marketing',
    'celebrity marketing',
    'dijital PR',
    'otel pazarlaması',
    'turizm PR',
    'görünürlük stratejisi',
    'medya ilişkileri',
    'Join PR',
  ],
};

export default function PRGorunurlukLandingPage() {
  return <PRGorunurlukLandingView />;
}
