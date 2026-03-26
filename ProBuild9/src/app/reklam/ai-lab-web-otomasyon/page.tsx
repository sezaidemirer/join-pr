import type { Metadata } from 'next';
import { AILabWebOtomasyonLandingView } from '@/components/views/landing/AILabWebOtomasyonLandingView';

const title = 'AI Lab · Web Geliştirme · Chatbot · CRM ve Otomasyon | Join PR';
const description =
  'Web sitenizi çalışan bir sisteme dönüştürün: web geliştirme, chatbot, AI agent, CRM entegrasyonu, otomasyon ve veri akışları. Otel, turizm, klinik, e-ticaret ve kurumsal firmalar için.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://joinpr.com.tr/reklam/ai-lab-web-otomasyon/',
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
    'web geliştirme',
    'chatbot geliştirme',
    'CRM entegrasyonu',
    'iş otomasyonu',
    'AI agent',
    'kurumsal web sitesi',
    'lead toplama sistemi',
    'satış otomasyonu',
    'Join PR',
  ],
};

export default function AILabWebOtomasyonLandingPage() {
  return <AILabWebOtomasyonLandingView />;
}
