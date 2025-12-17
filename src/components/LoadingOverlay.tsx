'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

const SESSION_KEY = 'joinpr_hasLoaded';
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-zinc-950 transition-opacity duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0">
          <Image
            src={`${BASE_PATH}/join_pr_logo_offical2.png`}
            alt="Join PR Logo"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xl md:text-2xl font-semibold text-white text-center tracking-wide">
          {translations.common.footer.title}
        </p>
      </div>
      <div className="absolute bottom-20 w-72 max-w-full">
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

