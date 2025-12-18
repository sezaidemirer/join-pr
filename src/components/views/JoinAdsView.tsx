'use client';

import Image from 'next/image';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function JoinAdsView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinAds;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-700 to-sky-600 p-8 shadow-2xl shadow-blue-950/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_70%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-4">
            <h1 className="text-[24px] font-semibold leading-tight text-white sm:text-[28px] md:text-[32px] lg:text-[36px]">
              {page.hero.title.split('&')[0]}
              <br />& {page.hero.title.split('&')[1]}
            </h1>
            <p className="max-w-2xl text-base text-blue-50/90 sm:text-lg">{page.hero.subtitle}</p>
            <p className="max-w-3xl text-sm text-blue-50/80 sm:text-base">{page.hero.description}</p>
          </div>
          <div className="flex-1 md:flex md:justify-end">
            <div className="relative mx-auto mt-6 w-full max-w-[22rem] sm:max-w-[24rem] md:mt-0 md:ml-auto md:max-w-[26rem] lg:max-w-[28rem]">
              <Image
                src={`${BASE_PATH}/ads_page_banner.png`}
                alt="Join Ads hero"
                width={800}
                height={500}
                priority
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:p-10">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.about.title}</h2>
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
              {page.about.description}
            </p>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            {page.about.videoUrl ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={page.about.videoUrl}
                title={page.about.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-800/50">
                <p className="text-zinc-400">Video eklenecek</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{translations.common.menu.joinAds}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {page.services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              accent={index % 2 === 0 ? 'sky' : 'teal'}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-10">
        <h3 className="text-2xl font-semibold text-white">{page.metrics.title}</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {page.metrics.items.map((metric) => (
            <div key={metric.title} className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
              <h4 className="text-lg font-semibold text-white">{metric.title}</h4>
              <p className="mt-3 text-sm text-zinc-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

