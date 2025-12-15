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
  const [isShortsPaused, setIsShortsPaused] = useState(false);
  const [isShortsHovered, setIsShortsHovered] = useState(false);
  const [openedShorts, setOpenedShorts] = useState<Set<string>>(new Set());
  const [openedVideos, setOpenedVideos] = useState<Set<string>>(new Set());
  const [showAllVideos, setShowAllVideos] = useState(false);
  const portfolioItems = page.portfolio.items as Array<{ title: string; image: string }>;
  const shortsItems = page.shorts?.items as Array<{ videoId: string; title: string }> || [];
  const videoPortfolioItems = page.videoPortfolio?.items as Array<{ videoId: string; title: string }> || [];
  const initialVideosCount = 9; // 3 satır x 3 video = 9 video
  const displayedVideos = showAllVideos ? videoPortfolioItems : videoPortfolioItems.slice(0, initialVideosCount);

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
            <h1 className="text-[24px] font-semibold leading-tight text-white sm:text-[28px] md:text-[32px] lg:text-[36px]">
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

      {/* Shorts Video Section */}
      {page.shorts && (
        <section className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white md:text-3xl">{page.shorts.title}</h3>
            {page.shorts.description && (
              <p className="w-full text-base text-zinc-400 md:text-lg leading-relaxed">{page.shorts.description}</p>
            )}
          </div>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-zinc-950 via-zinc-950/70 to-transparent" />
            <div 
              className="flex min-w-max gap-4 animate-marquee cursor-pointer"
              style={{ animationPlayState: (isShortsPaused || isShortsHovered) ? 'paused' : 'running' }}
              onClick={() => setIsShortsPaused(!isShortsPaused)}
              onMouseEnter={() => setIsShortsHovered(true)}
              onMouseLeave={() => setIsShortsHovered(false)}
            >
              {[...shortsItems, ...shortsItems].map((item, index) => {
                const uniqueKey = `${item.videoId}-${index}`;
                const isOpened = openedShorts.has(uniqueKey);
                
                return (
                  <div
                    key={uniqueKey}
                    className="group relative flex-shrink-0 w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-lg shadow-black/40 transition-transform hover:-translate-y-1 hover:border-teal-500/40 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.videoId) {
                        setOpenedShorts((prev) => {
                          const newSet = new Set(prev);
                          if (isOpened) {
                            newSet.delete(uniqueKey);
                          } else {
                            newSet.add(uniqueKey);
                          }
                          return newSet;
                        });
                      }
                    }}
                  >
                    {item.videoId ? (
                      <div className="relative w-full pt-[177.78%]">
                        {isOpened ? (
                          <iframe
                            className="absolute inset-0 h-full w-full"
                            src={`https://www.youtube.com/embed/${item.videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&controls=1&autoplay=1`}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        ) : (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`}
                              alt={item.title}
                              className="absolute inset-0 h-full w-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                                <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full pt-[177.78%]">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
                          <div className="text-center space-y-2">
                            <span className="text-4xl">🎬</span>
                            <p className="text-xs text-zinc-400">{item.title}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Video Portfolio Section */}
      {page.videoPortfolio && (
        <section className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white md:text-3xl">{page.videoPortfolio.title}</h3>
            {page.videoPortfolio.description && (
              <p className="w-full text-base text-zinc-400 md:text-lg leading-relaxed">{page.videoPortfolio.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedVideos.map((item, index) => {
              const uniqueKey = `video-${item.videoId}-${index}`;
              const isOpened = openedVideos.has(uniqueKey);
              
              return (
                <div
                  key={uniqueKey}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-lg shadow-black/40 transition-transform hover:-translate-y-1 hover:border-teal-500/40 cursor-pointer"
                  onClick={() => {
                    if (item.videoId) {
                      setOpenedVideos((prev) => {
                        const newSet = new Set(prev);
                        if (isOpened) {
                          newSet.delete(uniqueKey);
                        } else {
                          newSet.add(uniqueKey);
                        }
                        return newSet;
                      });
                    }
                  }}
                >
                  {item.videoId ? (
                    <div className="relative w-full pt-[56.25%] overflow-hidden rounded-2xl">
                      {isOpened ? (
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${item.videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&controls=1&playsinline=1&cc_load_policy=0&autoplay=1`}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          frameBorder="0"
                        />
                      ) : (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`}
                            alt={item.title}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                              <svg className="h-10 w-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full pt-[56.25%]">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
                        <div className="text-center space-y-2">
                          <span className="text-4xl">🎬</span>
                          <p className="text-xs text-zinc-400">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {videoPortfolioItems.length > initialVideosCount && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setShowAllVideos(!showAllVideos)}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/50"
              >
                {showAllVideos ? page.videoPortfolio.showLess : page.videoPortfolio.showMore}
              </button>
            </div>
          )}
        </section>
      )}

      {/* About Section */}
      {page.about && (
        <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:p-10">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.about.title}</h2>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
              {page.about.description}
            </p>
          </div>
        </section>
      )}

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
            aria-label={translations.common.project.close}
          >
            ×
          </button>
          <button
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-white transition hover:bg-white/20"
            aria-label={translations.common.project.previousImage}
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
            aria-label={translations.common.project.nextImage}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

