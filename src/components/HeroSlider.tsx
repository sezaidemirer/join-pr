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

const MOBILE_BACKGROUND_MAP: Record<string, string> = {
  joinPr: `${BASE_PATH}/mobile_banner_pr.jpg`,
  joinCreative: `${BASE_PATH}/mobile_banner_creative.jpg`,
  joinSocial: `${BASE_PATH}/mobile_banner_social.jpg`,
  joinAds: `${BASE_PATH}/mobile_banner_ads.jpg`,
  joinLabAi: `${BASE_PATH}/mobile_banner_ai.jpg`,
  joinEscapes: `${BASE_PATH}/mobile_banner_escapes.jpg`,
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
      <div className="relative min-h-[500px] sm:min-h-[520px] md:min-h-[560px] lg:h-[620px]">
        {slides.map(([key, slide], index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={key}
              className={`absolute inset-0 flex h-full w-full flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-14 transition-all duration-700 ${
                isActive ? 'pointer-events-auto opacity-100 blur-0' : 'pointer-events-none opacity-0 blur-sm'
              }`}
              aria-hidden={!isActive}
            >
              {/* Background image - tüm ekran boyutlarında tam genişlikte */}
              {/* Mobil görseli olan banner'lar için özel işlem */}
              {MOBILE_BACKGROUND_MAP[key] && MOBILE_BACKGROUND_MAP[key] !== BACKGROUND_MAP[key] ? (
                <>
                  {/* Mobil görsel - tam genişlikte background */}
                  <div
                    className="absolute inset-0 -z-10 bg-cover bg-center lg:hidden"
                    style={{ backgroundImage: `url(${MOBILE_BACKGROUND_MAP[key]})` }}
                  />
                  {/* Desktop görsel */}
                  <div
                    className="absolute inset-0 -z-10 hidden bg-cover bg-center lg:block"
                    style={{ backgroundImage: `url(${BACKGROUND_MAP[key]})` }}
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 -z-10 bg-contain bg-right bg-no-repeat lg:bg-cover lg:bg-center"
                  style={{ backgroundImage: `url(${BACKGROUND_MAP[key] ?? DEFAULT_HERO_BG})` }}
                />
              )}
              
              {/* Gradient overlay - metinlerin okunabilirliği için */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-transparent lg:bg-gradient-to-r lg:from-zinc-950 lg:via-zinc-950/80 lg:to-transparent" />
              
              {/* Metin içeriği - görsel üzerine üstte */}
              <div className="flex flex-1 flex-col justify-start gap-3 sm:gap-4 md:gap-6 lg:justify-center lg:gap-8 pt-4 sm:pt-6 md:pt-8 lg:pt-0 lg:max-w-2xl z-10">
                {translations.homepage.hero.intro && (
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] sm:tracking-[0.4em] text-teal-300">
                    {translations.homepage.hero.intro}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white lg:text-5xl xl:text-6xl">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-zinc-200 lg:text-xl">{slide.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-2 sm:pb-3 lg:pb-0">
                  <Link
                    href={slide.link}
                    className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/20"
                  >
                    {slide.cta}
                    <ArrowIcon className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Navigasyon kontrolleri - alt kısımda */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-400 lg:pb-0 z-10">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => goToSlide((activeIndex - 1 + slides.length) % slides.length)}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:border-white/30 hover:bg-white/10 text-lg sm:text-xl"
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide((activeIndex + 1) % slides.length)}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:border-white/30 hover:bg-white/10 text-lg sm:text-xl"
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span>{index + 1}</span>
                  <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-zinc-500 via-zinc-300 to-transparent" />
                  <span>{slides.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:absolute lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 z-10">
                {slides.map(([, { title }], dotIndex) => {
                  const active = dotIndex === activeIndex;
                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => goToSlide(dotIndex)}
                      className={`h-2 w-6 sm:h-2.5 sm:w-8 md:w-10 rounded-full transition-all ${
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

