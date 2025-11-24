'use client';
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { HeroSlider } from '@/components/HeroSlider';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

const UNIT_ROUTES: Record<string, string> = {
  joinPr: '/join-pr',
  joinCreative: '/join-creative',
  joinSocial: '/join-social',
  joinAds: '/join-ads',
  joinLabAi: '/join-lab-ai',
  joinEscapes: '/join-escapes',
};

export function HomeView() {
  const { translations } = useLanguage();

  const ecosystem = translations.homepage.ecosystem;
  const projects = translations.homepage.projects;
  const cases = translations.homepage.cases;
  const about = translations.homepage.about;
  const promo = translations.homepage.promo;
  const ecosystemDescription =
    typeof ecosystem.description === 'string' ? ecosystem.description.trim() : '';
  const caseItems = cases.cards as Array<{ title: string; category: string; description: string; image?: string }>;
  const marqueeItems = [...caseItems, ...caseItems];
  const clients = translations.homepage.clients;
  const clientLogos = clients.logos as Array<{ name: string; image: string }>;
  const promoSlides = useMemo(
    () =>
      (promo.slides as Array<{
        badge: string;
        title: string;
        description: string;
        highlights: string[];
        primaryCta: string;
        secondaryCta: string;
        kpi: { label: string; value: string; caption: string };
        stats: Array<{ value: string; caption: string }>;
        stack: { label: string; items: string[] };
      }>) ?? [],
    [promo],
  );
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  useEffect(() => {
    if (promoSlides.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [promoSlides.length]);

  useEffect(() => {
    setActivePromoIndex(0);
  }, [promoSlides.length]);

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <div className="relative lg:left-1/2 lg:w-screen lg:-translate-x-1/2">
        <HeroSlider />
      </div>

      <section className="relative rounded-3xl border border-white/5 bg-white px-4 py-10 text-slate-900 shadow-xl shadow-black/30 sm:px-6 sm:py-12 lg:left-1/2 lg:w-screen lg:-translate-x-1/2 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-500">{about.title}</span>
            <div className="space-y-4">
              <h2 className="text-[2.4rem] font-semibold leading-tight text-slate-900 md:text-[3.2rem]">{about.subtitle}</h2>
              <p className="text-base text-slate-600 md:text-lg">{about.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/5 shadow-lg shadow-slate-200/60">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full rounded-2xl"
                  src="https://www.youtube.com/embed/jA57OToKvAg"
                  title="Join PR video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecosystem" className="space-y-10 sm:space-y-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{ecosystem.title}</h2>
          {ecosystemDescription && (
            <p className="max-w-2xl text-base text-zinc-400 md:text-lg">{ecosystemDescription}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(ecosystem.cards).map(([key, value]) => (
            <Link
              key={key}
              href={UNIT_ROUTES[key] ?? '#'}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl transition-transform hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-glow-sky"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <h3 className="mt-2 text-2xl font-semibold text-white">{value.title}</h3>
              <p className="mt-3 text-sm text-zinc-400">{value.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
                {value.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-zinc-900/30 to-zinc-950/50 p-8 shadow-2xl md:p-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.08),_transparent_60%)]" />
        <div className="space-y-10 sm:space-y-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{projects.title}</h2>
            <p className="max-w-2xl text-base text-zinc-400 md:text-lg">{projects.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Object.entries(projects.items).map(([key, value]: [string, any]) => {
            // İlk alt projeyi al (varsa), yoksa ana projeyi kullan
            const firstSubProject = value.subProjects?.[0] || value;
            const totalParticipants = value.subProjects
              ? value.subProjects.reduce((sum: number, sp: any) => sum + (sp.participants?.length || 0), 0)
              : value.participants?.length || 0;
            
            return (
              <Link
                key={key}
                href={`/projects/${value.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-xl transition-transform hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-glow-teal"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                  {firstSubProject.videoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${firstSubProject.videoId}/maxresdefault.jpg`}
                      alt={value.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-3xl">🎬</span>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-base font-semibold text-white line-clamp-1">{value.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{value.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-1">
                      {firstSubProject.participants?.slice(0, 2).map((participant: any, idx: number) => (
                        <div
                          key={idx}
                          className="h-6 w-6 rounded-full border-2 border-zinc-950 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-[10px] font-semibold text-white"
                        >
                          {participant.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {totalParticipants} {translations.common.project.participants}
                    </span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-200">
                    {translations.common.cta.viewDetails}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        </div>
      </section>

      {promoSlides.length > 0 && (
        <section className="relative overflow-hidden bg-white px-4 py-12 text-slate-900 shadow-2xl shadow-black/40 sm:px-6 lg:left-1/2 lg:w-screen lg:-translate-x-1/2 lg:px-16 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="relative min-h-[620px] sm:min-h-[560px] lg:min-h-[600px]">
              {promoSlides.map((slide, index) => {
                const isActive = index === activePromoIndex;
                return (
                  <div
                    key={slide.title}
                    className={`absolute inset-0 flex flex-col gap-10 transition-all duration-700 lg:flex-row lg:items-center lg:justify-between ${
                      isActive ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
                    }`}
                  >
                    <div className="relative z-10 max-w-2xl space-y-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                        {slide.badge}
                      </span>
                      <h2 className="text-4xl font-semibold text-slate-900 md:text-5xl">{slide.title}</h2>
                      <p className="text-base text-slate-600 md:text-lg">{slide.description}</p>
                      <ul className="grid gap-3 text-sm text-slate-600 md:text-base">
                        {slide.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm shadow-slate-200/40"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-xs font-bold text-white shadow-lg shadow-teal-500/40">
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-slate-900/40 transition-transform hover:-translate-y-1"
                    >
                      {slide.primaryCta}
                    </Link>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/contact"
                        className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-lg shadow-slate-200/40 transition-transform hover:-translate-y-1 hover:border-slate-400"
                      >
                        {slide.secondaryCta}
                      </Link>
                      {promoSlides.length > 1 && (
                        <div className="flex items-center gap-2">
                          {promoSlides.map((promoSlide, indicatorIndex) => {
                            const indicatorActive = indicatorIndex === activePromoIndex;
                            return (
                              <button
                                key={`${promoSlide.badge}-${indicatorIndex}`}
                                type="button"
                                onClick={() => setActivePromoIndex(indicatorIndex)}
                                className={`h-2 w-8 rounded-full transition-all ${
                                  indicatorActive
                                    ? 'bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 shadow-[0_0_10px_rgba(56,189,248,0.45)]'
                                    : 'bg-slate-200/70 hover:bg-slate-300'
                                }`}
                                aria-label={promoSlide.badge}
                                aria-current={indicatorActive}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                    </div>
                    <div className="relative z-10 mt-6 flex h-full max-w-lg flex-col justify-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-300/50 backdrop-blur">
                      <div className="grid gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-500">{slide.kpi.label}</p>
                          <h3 className="mt-2 text-3xl font-semibold text-slate-900">{slide.kpi.value}</h3>
                          <p className="text-xs text-slate-500">{slide.kpi.caption}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {slide.stats.map((stat) => (
                            <div key={`${slide.title}-${stat.value}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                              <p className="mt-1 text-xs text-slate-500">{stat.caption}</p>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-500/20 via-sky-500/10 to-blue-600/20 p-4 text-left">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">{slide.stack.label}</p>
                          <ul className="mt-2 space-y-1 text-xs text-slate-600">
                            {slide.stack.items.map((item) => (
                              <li key={`${slide.title}-${item}`}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative space-y-10 py-12 lg:left-1/2 lg:w-screen lg:-translate-x-1/2">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{cases.title}</h2>
          <p className="max-w-2xl text-base text-zinc-400 md:text-lg">{cases.description}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200 transition-colors hover:text-white"
          >
            {cases.cta}
            <span aria-hidden>↗</span>
          </Link>
        </div>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 via-zinc-950/70 to-transparent" />
          <div className="marquee flex min-w-max gap-6 animate-marquee">
            {marqueeItems.map((card, index) => (
              <div
                key={`${card.title}-${index}`}
                className="group flex w-[320px] flex-shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-lg shadow-black/40 transition-transform duration-300 hover:-translate-y-1 hover:border-teal-500/40"
              >
                <div className="space-y-4">
                  {card.image && (
                    <div className="overflow-hidden rounded-2xl">
                      <Image
                        src={`${BASE_PATH}${card.image}`}
                        alt={card.title}
                        width={320}
                        height={180}
                        unoptimized
                        className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">{card.category}</span>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="text-sm text-zinc-400">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-0 flex w-full max-w-6xl flex-col gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 px-6 py-12 text-center shadow-xl shadow-black/30 sm:mt-16 sm:px-8">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-300">{translations.common.brandName}</span>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{clients.title}</h2>
          <p className="mx-auto max-w-3xl text-sm text-zinc-400 md:text-base">{clients.description}</p>
        </div>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
          {clientLogos.map((logo) => (
            <div
              key={logo.name}
              className="group relative flex h-28 w-28 items-center justify-center justify-self-center overflow-hidden rounded-full border-2 border-sky-400/80 bg-white text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 shadow-[0_0_25px_rgba(56,189,248,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] sm:h-32 sm:w-32 sm:text-sm"
            >
              <img
                src={`${BASE_PATH}${logo.image}`}
                alt={logo.name}
                className="h-20 w-20 object-contain transition-all duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
                loading="lazy"
              />
              <span className="pointer-events-none absolute inset-0 rounded-full border border-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

