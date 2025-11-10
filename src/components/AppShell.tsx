'use client';

import { useEffect } from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { useLanguage } from '@/context/LanguageContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();

  useEffect(() => {
    document.body.dataset.locale = locale;
  }, [locale]);

  return (
    <>
      <LoadingOverlay />
      <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.22),_transparent_55%)]" />
        <Header />
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 lg:px-10 lg:gap-20 lg:pt-24">
          {children}
        </main>
        <div className="-mt-20 sm:mt-0">
          <Footer />
        </div>
      </div>
    </>
  );
}

