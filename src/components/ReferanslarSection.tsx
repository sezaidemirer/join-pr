'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = '';

export function ReferanslarSection() {
  const { translations } = useLanguage();
  const clients = translations.homepage?.clients as {
    title?: string;
    referansTitle?: string;
    description?: string;
    showMore?: string;
    showLess?: string;
    viewAll?: string;
    logos?: Array<{ name: string; image: string }>;
  } | undefined;

  const [showAllLogos, setShowAllLogos] = useState(false);
  const clientLogos = clients?.logos ?? [];
  const title = clients?.referansTitle ?? 'Referanslarımız';
  const description = clients?.description ?? '';

  if (clientLogos.length === 0) return null;

  return (
    <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 px-6 py-12 text-center shadow-xl shadow-black/30 sm:px-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{title}</h2>
          {description && (
            <p className="mx-auto max-w-3xl text-sm text-zinc-400 md:text-base">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
          {(showAllLogos ? clientLogos : clientLogos.slice(0, 8)).map((logo) => {
            const isDarkLogo =
              logo.name.toLowerCase().includes('club privé') || logo.name.toLowerCase().includes('club prive');
            const isRixosSharmElSheikh =
              logo.image?.toLowerCase().includes('rixos_sharm_el_sheikh') ?? false;
            const isRixosSharm = !isRixosSharmElSheikh && logo.name.toLowerCase().includes('rixos') && logo.name.toLowerCase().includes('sharm');
            const isProntotour = logo.name.toLowerCase().includes('prontotour') || logo.name.toLowerCase().includes('pronto tour');
            const imgSize = isRixosSharmElSheikh
              ? 'h-28 w-28 sm:h-32 sm:w-32'
              : isRixosSharm
                ? 'h-24 w-24 sm:h-28 sm:w-28'
                : isProntotour
                  ? 'h-[5.75rem] w-[5.75rem] sm:h-[6.9rem] sm:w-[6.9rem]'
                  : isDarkLogo
                    ? 'h-24 w-24 sm:h-28 sm:w-28'
                    : 'h-20 w-20 sm:h-24 sm:w-24';
            return (
              <div
                key={logo.name}
                className={`group relative flex h-28 w-28 items-center justify-center justify-self-center overflow-hidden rounded-full border-2 border-sky-400/80 text-xs font-semibold uppercase tracking-[0.3em] shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] sm:h-32 sm:w-32 sm:text-sm ${
                  isDarkLogo ? 'bg-black text-white' : 'bg-white text-zinc-600'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
        <div className="flex flex-wrap justify-center gap-4">
          {clientLogos.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllLogos(!showAllLogos)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/50"
            >
              {showAllLogos ? clients?.showLess : clients?.showMore}
            </button>
          )}
          <Link
            href="/is-ortaklarimiz"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            {clients?.viewAll ?? 'Hepsini gör'}
          </Link>
        </div>
      </div>
    </section>
  );
}
