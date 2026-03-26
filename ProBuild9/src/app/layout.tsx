import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { LanguageProvider } from '@/context/LanguageContext';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

const siteTitle = 'Join PR';
const siteDescription =
  'Join PR brings together strategic communication, creative production, social media, performance marketing, AI solutions and travel storytelling under one ecosystem.';

export const metadata: Metadata = {
  metadataBase: new URL('https://joinpr.com.tr'),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
        url: 'https://joinpr.com.tr',
    siteName: siteTitle,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
                url: 'https://joinpr.com.tr/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Join PR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
          images: ['https://joinpr.com.tr/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.webp', type: 'image/webp', sizes: '32x32' },
      { url: '/favicon.webp', rel: 'shortcut icon' },
    ],
    apple: '/favicon.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${plusJakartaSans.variable}`}>
      <body className="bg-zinc-950 font-sans text-white antialiased">
        <LanguageProvider>
          <LayoutSwitcher>{children}</LayoutSwitcher>
        </LanguageProvider>
      </body>
    </html>
  );
}
