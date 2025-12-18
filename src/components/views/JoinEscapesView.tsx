'use client';

import Image from 'next/image';
import Link from 'next/link';

import { CTASection } from '@/components/CTASection';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function JoinEscapesView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinEscapes;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-sky-900/50 to-slate-950 p-8 shadow-2xl shadow-blue-950/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-4">
            <h1 className="text-[20px] font-semibold leading-tight text-white sm:text-[22px] md:text-[26px] lg:text-[30px]">
              {page.hero.title}
            </h1>
            <p className="text-base text-zinc-200 sm:text-lg">{page.hero.subtitle}</p>
            <p className="text-sm text-zinc-300 sm:text-base">{page.hero.description}</p>
          </div>
          <div className="flex-1 md:flex md:justify-end">
            <div className="relative mx-auto mt-4 w-full max-w-[24rem] sm:max-w-[27rem] md:mt-0 md:ml-auto md:max-w-[28rem] lg:max-w-[30rem]">
              <Image
                src={`${BASE_PATH}/join_Escapes_hero.jpg`}
                alt="Join Escapes - Luxury Travel Experience"
                width={640}
                height={640}
                priority
                className="h-full w-full rounded-[28px] object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl shadow-black/30 md:p-12">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.about.title}</h2>
        <div className="space-y-4 text-base text-zinc-300 md:text-lg leading-relaxed whitespace-pre-line">
          {page.about.description}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.sections.destinations.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {page.sections.destinations.items.map((item: any) => {
            const CardContent = (
              <>
                <div className="mb-6 h-40 rounded-2xl overflow-hidden">
                  {item.image ? (
                    <Image
                      src={`${BASE_PATH}${item.image}`}
                      alt={item.title}
                      width={400}
                      height={160}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-teal-500/20 via-sky-600/10 to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-zinc-400">{item.description}</p>
              </>
            );

            if (item.link) {
              return (
                <Link
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg shadow-black/30 transition-transform hover:-translate-y-1"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg shadow-black/30 transition-transform hover:-translate-y-1"
            >
                {CardContent}
            </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8">
          <h3 className="text-2xl font-semibold text-white">{page.sections.editorial.title}</h3>
          <ul className="space-y-4 text-sm text-zinc-300">
            {page.sections.editorial.items.map((item) => {
              const getLink = (title: string) => {
                if (title === 'Yeni Nesil Seyahat Trendleri') {
                  return 'https://joinescapes.com/destinasyonlar';
                }
                if (title === 'Keşfedilmemiş Destinasyonlar') {
                  return 'https://joinescapes.com/sanat-ve-cemiyet';
                }
                if (title === 'Influencer Seyahat Günlükleri') {
                  return 'https://joinescapes.com/yazarlar';
                }
                if (title === 'Seçkin Oteller') {
                  return 'https://joinescapes.com/oteller';
                }
                return null;
              };

              const link = getLink(item);
              const isClickable = link !== null;
              const content = (
                <>
                  <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-teal-400 via-sky-500 to-blue-600" />
                  <span className={isClickable ? 'cursor-pointer transition-colors hover:text-sky-200' : ''}>{item}</span>
                </>
              );

              if (isClickable && link) {
                return (
                  <li key={item} className="flex items-start gap-3">
                    <Link
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3"
                    >
                      {content}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item} className="flex items-start gap-3">
                  {content}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8">
          <h3 className="text-2xl font-semibold text-white">{page.sections.influencers.title}</h3>
          <p className="mt-4 text-sm text-zinc-300">{page.sections.influencers.description}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200 transition-colors hover:text-white"
          >
            {translations.common.cta.contactUs}
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} href="https://join-escapes.com" />
    </div>
  );
}

