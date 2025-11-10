'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

const SESSION_KEY = 'joinpr_hasLoaded';

export function LoadingOverlay() {
  const { translations } = useLanguage();
  const [progress, setProgress] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasLoadedBefore = typeof window !== 'undefined' ? window.sessionStorage.getItem(SESSION_KEY) === 'true' : false;
    if (hasLoadedBefore) {
      return;
    }
    setIsVisible(true);
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          window.sessionStorage.setItem(SESSION_KEY, 'true');
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        const increment = Math.floor(Math.random() * 6) + 1;
        return Math.min(prev + increment, 100);
      });
    }, 80);
    return () => window.clearInterval(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-zinc-950 transition-opacity duration-500">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-sky-500 to-blue-600 shadow-2xl shadow-teal-500/40">
          <span className="text-2xl font-semibold text-white">J</span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-teal-200">{translations.common.brandName}</p>
          <p className="text-lg font-semibold text-white">{translations.common.tagline}</p>
        </div>
      </div>
      <div className="w-72 max-w-full">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-500 to-blue-600 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-center text-sm font-medium text-zinc-400">
          {translations.loading.label} · {translations.loading.percentage.replace('{{value}}', progress.toString())}
        </p>
      </div>
    </div>
  );
}

