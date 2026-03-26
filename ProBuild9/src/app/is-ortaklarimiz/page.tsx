'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export default function PartnersPage() {
  const { translations } = useLanguage();
  const clients = translations.homepage.clients;
  const clientLogos = clients.logos as Array<{ name: string; image: string }>;
  // Bu sayfada Prontotour logosunu kaldır (diğer sayfalar etkilenmesin).
  const visibleClientLogos = clientLogos.filter((logo) => {
    const name = (logo.name || '').toLowerCase();
    return !name.includes('prontotour') && !name.includes('pronto tour');
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="space-y-4 text-center">
        {/* JOIN PR badge'i kaldırıldı */}
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{clients.title}</h1>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
        {visibleClientLogos.map((logo) => {
          const isDarkLogo =
            logo.name.toLowerCase().includes('club privé') || logo.name.toLowerCase().includes('club prive');
          const isRixosSharmElSheikh =
            logo.image?.toLowerCase().includes('rixos_sharm_el_sheikh') ?? false;
          const isProntotour = logo.name.toLowerCase().includes('prontotour') || logo.name.toLowerCase().includes('pronto tour');
          const imgSize = isRixosSharmElSheikh
            ? 'h-32 w-32 sm:h-36 sm:w-36'
            : isProntotour
              ? 'h-32 w-32 sm:h-36 sm:w-36'
              : isDarkLogo
                ? 'h-28 w-28 sm:h-32 sm:w-32'
                : 'h-24 w-24 sm:h-28 sm:w-28';
          return (
            <div
              key={logo.name}
              className={`group relative flex h-32 w-32 items-center justify-center justify-self-center overflow-hidden rounded-full border-2 border-sky-400/80 text-xs font-semibold uppercase tracking-[0.3em] shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] sm:h-36 sm:w-36 sm:text-sm ${
                isDarkLogo ? 'bg-black text-white' : 'bg-white text-zinc-600'
              }`}
            >
              <img
                src={`${BASE_PATH}${logo.image}`}
                alt={logo.name}
                className={`object-contain transition-all duration-300 group-hover:scale-105 ${imgSize} ${isRixosSharmElSheikh ? 'scale-150' : ''} ${isProntotour ? 'scale-[1.35]' : ''}`}
                loading="lazy"
              />
              <span className="pointer-events-none absolute inset-0 rounded-full border border-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-700/80"
        >
          {translations.common.project.backToHome}
        </Link>
      </div>
    </div>
  );
}

