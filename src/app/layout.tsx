import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { AppShell } from '@/components/AppShell';
import { LanguageProvider } from '@/context/LanguageContext';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

const siteTitle = 'Join PR Group';
const siteDescription =
  'Join PR Group brings together strategic communication, creative production, social media, performance marketing, AI solutions and travel storytelling under one ecosystem.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.joinpr.com'),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: 'https://www.joinpr.com',
    siteName: siteTitle,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: 'https://www.joinpr.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Join PR Group',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['https://www.joinpr.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${plusJakartaSans.variable}`}>
      <body className="bg-zinc-950 font-sans text-white antialiased">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
