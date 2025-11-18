'use client';

import Image from 'next/image';
import { useState } from 'react';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function JoinCreativeView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinCreative;
  const media = page.media;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const portfolioItems = page.portfolio.items as Array<{ title: string; image: string }>;

  const closeModal = () => setSelectedIndex(null);
  const showPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedIndex((prev) =>
      prev === null ? prev : (prev - 1 + portfolioItems.length) % portfolioItems.length,
    );
  };
  const showNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedIndex((prev) =>
      prev === null ? prev : (prev + 1) % portfolioItems.length,
    );
  };

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-900 p-8 shadow-2xl shadow-cyan-900/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.35),_transparent_65%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-fuchsia-200">Join Creative</span>
            <h1 className="text-[32px] font-semibold leading-tight text-white sm:text-[36px] md:text-[42px] lg:text-[48px]">
              {page.hero.title}
            </h1>
            <p className="max-w-2xl text-base text-zinc-200 sm:text-lg">{page.hero.subtitle}</p>
            <p className="max-w-3xl text-sm text-zinc-300 sm:text-base">{page.hero.description}</p>
          </div>
          <div className="flex-1 md:flex md:justify-end">
            <div className="relative mx-auto mt-6 w-full max-w-[22rem] sm:max-w-[24rem] md:mt-0 md:ml-auto md:max-w-[26rem] lg:max-w-[28rem]">
              <Image
                src={`${BASE_PATH}/creative_banner.png`}
                alt="Join Creative hero"
                width={800}
                height={500}
                priority
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-xl shadow-black/30 md:grid-cols-2 md:p-10">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_25px_45px_rgba(0,0,0,0.45)] aspect-video">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${media.videoId}?rel=0`}
            title="Join Creative video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{media.title}</h2>
          <p className="text-base text-zinc-300">{media.description}</p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{translations.common.menu.joinCreative}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {page.services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              accent={index % 2 === 0 ? 'teal' : 'sky'}
            />
          ))}
        </div>
      </section>


      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">{page.portfolio.title}</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {portfolioItems.map((item, index) => (
            <div
              key={item.title}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-lg shadow-black/40"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={`${BASE_PATH}${item.image}`}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-white">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeModal}
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              closeModal();
            }}
            className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-white transition hover:bg-white/20"
            aria-label="Kapat"
          >
            ×
          </button>
          <button
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-white transition hover:bg-white/20"
            aria-label="Önceki"
          >
            ‹
          </button>
          <div className="relative w-full max-w-5xl">
            <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40">
              <Image
                src={`${BASE_PATH}${portfolioItems[selectedIndex].image}`}
                alt={portfolioItems[selectedIndex].title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
            <p className="mt-4 text-center text-lg font-semibold text-white">
              {portfolioItems[selectedIndex].title}
            </p>
          </div>
          <button
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-white transition hover:bg-white/20"
            aria-label="Sonraki"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

