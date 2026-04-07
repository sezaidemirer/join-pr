'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function IsBirliklerimizPage() {
  const { translations } = useLanguage();
  const pageContent = (translations as { pages?: { isbirliklerimiz?: { hero?: { title: string; subtitle: string }; intro?: string } } }).pages?.isbirliklerimiz;

  const heroTitle = pageContent?.hero?.title ?? 'İşbirliklerimiz';
  const heroSubtitle = pageContent?.hero?.subtitle ?? 'Birlikte büyüdüğümüz markalar';
  const intro = pageContent?.intro ?? (translations.homepage.clients.description as string);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      {/* Header / Hero */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 px-6 py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-16 w-40 md:h-20 md:w-48">
              <Image
                src="/join_pr_logo_offical2.png"
                alt="Join PR Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-300 md:text-xl">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Ön öz / Intro */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base text-zinc-400 md:text-lg leading-relaxed">
            {intro}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-0">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 px-6 py-12 text-center shadow-xl shadow-black/30 sm:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            <Link href="/is-birliklerimiz/rixos-egypt" className="block">
              <div className="aspect-[4/6] w-full overflow-hidden rounded-xl border border-white/10 bg-white transition-all hover:border-sky-400/50 hover:shadow-lg md:aspect-[4/5]">
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src="/marka-logolari/rixos_egypt_hotels.png"
                      alt="Rixos Egypt Hotels"
                      className="h-auto w-full max-w-[547px] object-contain"
                    />
                  </div>
                  <div className="border-t border-zinc-200 px-3 py-2 text-center text-[13px] leading-5 text-zinc-600 md:px-4 md:py-3 md:text-sm">
                    <p>Katılımcı: 63</p>
                    <p>Etkileşim: 9.95M</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/is-birliklerimiz/ajet" className="block">
              <div className="aspect-[4/6] w-full overflow-hidden rounded-xl border border-white/10 bg-white transition-all hover:border-sky-400/50 hover:shadow-lg md:aspect-[4/5]">
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src="/marka-logolari/ajet_logo.png"
                      alt="AJet"
                      className="h-auto w-full max-w-[360px] object-contain"
                    />
                  </div>
                  <div className="border-t border-zinc-200 px-3 py-2 text-center text-[13px] leading-5 text-zinc-600 md:px-4 md:py-3 md:text-sm">
                    <p>Katılımcı: 65</p>
                    <p>Etkileşim: 216.91K</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/is-birliklerimiz/prontotour" className="block">
              <div className="aspect-[4/6] w-full overflow-hidden rounded-xl border border-white/10 bg-white transition-all hover:border-sky-400/50 hover:shadow-lg md:aspect-[4/5]">
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src="/marka-logolari/prontotour_logos.png"
                      alt="Prontotour"
                      className="h-auto w-full max-w-[360px] object-contain"
                    />
                  </div>
                  <div className="border-t border-zinc-200 px-3 py-2 text-center text-[13px] leading-5 text-zinc-600 md:px-4 md:py-3 md:text-sm">
                    <p>Katılımcı: 69</p>
                    <p>Etkileşim: 5.59M</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/is-birliklerimiz/swissotel-sharm-el-sheikh" className="block">
              <div className="aspect-[4/6] w-full overflow-hidden rounded-xl border border-white/10 bg-white transition-all hover:border-sky-400/50 hover:shadow-lg md:aspect-[4/5]">
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src="/marka-logolari/swissotel_sharm.png"
                      alt="Swissotel Sharm"
                      className="h-auto w-full max-w-[360px] object-contain"
                    />
                  </div>
                  <div className="border-t border-zinc-200 px-3 py-2 text-center text-[13px] leading-5 text-zinc-600 md:px-4 md:py-3 md:text-sm">
                    <p>Katılımcı: 8</p>
                    <p>Etkileşim: 249.11K</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/is-birliklerimiz/villa-resorts-maldives" className="block">
              <div className="aspect-[4/6] w-full overflow-hidden rounded-xl border border-white/10 bg-white transition-all hover:border-sky-400/50 hover:shadow-lg md:aspect-[4/5]">
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src="/marka-logolari/villa-resorts-maldives.png"
                      alt="Villa Resorts Maldives"
                      className="h-auto w-full max-w-[360px] object-contain"
                    />
                  </div>
                  <div className="border-t border-zinc-200 px-3 py-2 text-center text-[13px] leading-5 text-zinc-600 md:px-4 md:py-3 md:text-sm">
                    <p>Katılımcı: 3</p>
                    <p>Etkileşim: 291.71K</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/is-birliklerimiz/marriott-dead-sea" className="block">
              <div className="aspect-[4/6] w-full overflow-hidden rounded-xl border border-white/10 bg-white transition-all hover:border-sky-400/50 hover:shadow-lg md:aspect-[4/5]">
                <div className="flex h-full flex-col">
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src="/marka-logolari/marriot_deat_sea.png"
                      alt="Marriott Resort Dead Sea"
                      className="h-auto w-full max-w-[518px] object-contain"
                    />
                  </div>
                  <div className="border-t border-zinc-200 px-3 py-2 text-center text-[13px] leading-5 text-zinc-600 md:px-4 md:py-3 md:text-sm">
                    <p>Katılımcı: 3</p>
                    <p>Etkileşim: 1.13M</p>
                  </div>
                </div>
              </div>
            </Link>
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
      </div>
    </div>
  );
}
