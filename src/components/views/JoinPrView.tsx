'use client';

import Image from 'next/image';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function JoinPrView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinPr;
  const media = page.media;
  const influencer = page.influencer;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-blue-900/40 to-black p-8 shadow-2xl shadow-blue-950/30 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_65%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-sky-200">Join PR</span>
            <h1 className="text-[25px] font-semibold leading-tight text-white sm:text-[27px] md:text-[33px] lg:text-[37px]">
              {page.hero.title}
            </h1>
            <p className="text-base text-zinc-200 sm:text-lg">{page.hero.subtitle}</p>
            <p className="text-sm text-zinc-300 sm:text-base">{page.hero.description}</p>
          </div>

          <div className="flex-1 md:flex md:justify-end">
            <div className="relative mx-auto mt-4 w-full max-w-[24rem] sm:max-w-[27rem] md:mt-0 md:ml-auto md:max-w-[28rem] lg:max-w-[30rem]">
              <Image
                src={`${BASE_PATH}/pr_page_banner_.png`}
                alt="Join PR Hero"
                width={640}
                height={640}
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
            title="Join PR video"
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
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{translations.common.menu.joinPr}</h2>
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

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl shadow-black/30 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white md:text-3xl">{page.cases.title}</h3>
          <ul className="space-y-4 text-base text-zinc-300">
            {page.cases.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-teal-400 via-sky-400 to-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-sky-500/30 via-blue-600/30 to-blue-800/30 blur-3xl" />
          <Image
            src={`${BASE_PATH}/pr_page_news.jpg`}
            alt="Basın yansıma raporu"
            width={640}
            height={480}
            className="w-full rounded-3xl border border-white/5 object-cover"
          />
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl shadow-black/30 md:grid-cols-[0.9fr_1.1fr] md:p-10">
        <div className="relative flex items-center justify-center order-first md:order-none">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-blue-600/20 blur-3xl" />
          <Image
            src={`${BASE_PATH}/pr_page_influencer.jpg`}
            alt="Influencer ve celebrity iletişimi"
            width={640}
            height={480}
            className="w-full rounded-3xl border border-white/5 object-cover"
          />
        </div>
        <div className="space-y-6 md:pl-6">
          <h3 className="text-2xl font-semibold text-white md:text-3xl">{influencer.title}</h3>
          <p className="text-base text-zinc-300">{influencer.description}</p>
          <ul className="space-y-4 text-base text-zinc-300">
            {influencer.items.map((item: string) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

