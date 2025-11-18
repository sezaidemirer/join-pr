'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

const BACKGROUND_MAP: Record<string, string> = {
  joinPr: `${BASE_PATH}/banner1.jpg`,
  joinCreative: `${BASE_PATH}/banner2.jpg`,
  joinSocial: `${BASE_PATH}/banner3_social_mediya.jpg`,
  joinAds: `${BASE_PATH}/banner4_ads.jpg`,
  joinLabAi: `${BASE_PATH}/banner5_ai_lab.jpg`,
  joinEscapes: `${BASE_PATH}/banner6_joinescapes.png`,
};

const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80';

const AUTO_PLAY_INTERVAL = 7000;

export function HeroSlider() {
  const { translations } = useLanguage();
  const slidesObject = translations.homepage.hero.slides as Record<
    string,
    { title: string; subtitle: string; cta: string; link: string }
  >;
  const slides = useMemo(() => Object.entries(slidesObject), [slidesObject]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative mt-6 overflow-hidden bg-zinc-950 shadow-2xl shadow-black/40 lg:mt-8" data-hero>
      <div className="relative h-[400px] sm:h-[440px] lg:h-[620px]">
        {slides.map(([key, slide], index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={key}
              className={`absolute inset-0 flex h-full w-full flex-col justify-between p-8 transition-all duration-700 lg:p-14 ${
                isActive ? 'pointer-events-auto opacity-100 blur-0' : 'pointer-events-none opacity-0 blur-sm'
              }`}
              aria-hidden={!isActive}
            >
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: `url(${BACKGROUND_MAP[key] ?? DEFAULT_HERO_BG})` }}
              />

              <div className="flex flex-1 flex-col justify-start gap-4 pt-2 sm:gap-6 sm:pt-6 lg:justify-center lg:pt-0 lg:gap-8">
                <span className="text-sm font-medium uppercase tracking-[0.4em] text-teal-300">
                  {translations.homepage.hero.intro}
                </span>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="max-w-2xl text-lg text-zinc-200 md:text-xl">{slide.subtitle}</p>
                <div className="flex flex-wrap items-center gap-4 pb-3 lg:pb-0">
                  <Link
                    href={slide.link}
                    className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/20"
                  >
                    {slide.cta}
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 text-xs uppercase tracking-[0.3em] text-zinc-400 lg:pb-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToSlide((activeIndex - 1 + slides.length) % slides.length)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:border-white/30 hover:bg-white/10"
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide((activeIndex + 1) % slides.length)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:border-white/30 hover:bg-white/10"
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                  <span>{index + 1}</span>
                  <div className="h-px w-12 bg-gradient-to-r from-zinc-500 via-zinc-300 to-transparent" />
                  <span>{slides.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                {slides.map(([, { title }], dotIndex) => {
                  const active = dotIndex === activeIndex;
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => goToSlide(dotIndex)}
                      className={`h-2.5 w-10 rounded-full transition-all ${
                        active ? 'bg-gradient-to-r from-teal-400 via-sky-500 to-blue-500' : 'bg-zinc-600/60 hover:bg-zinc-400'
                      }`}
                      aria-label={`Go to ${title}`}
                      aria-current={active}
                    />
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M5 5h10v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15 15 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

