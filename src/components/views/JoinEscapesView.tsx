'use client';

import Link from 'next/link';

import { CTASection } from '@/components/CTASection';
import { useLanguage } from '@/context/LanguageContext';

export function JoinEscapesView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinEscapes;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-sky-900/50 to-slate-950 p-10 shadow-2xl shadow-blue-950/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-sky-200">Join Escapes</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{page.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{page.hero.subtitle}</p>
          <p className="max-w-3xl text-base text-zinc-300">{page.hero.description}</p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.sections.destinations.title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {page.sections.destinations.items.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-lg shadow-black/30 transition-transform hover:-translate-y-1"
            >
              <div className="mb-6 h-40 rounded-2xl bg-gradient-to-br from-teal-500/20 via-sky-600/10 to-transparent" />
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8">
          <h3 className="text-2xl font-semibold text-white">{page.sections.editorial.title}</h3>
          <ul className="space-y-4 text-sm text-zinc-300">
            {page.sections.editorial.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-teal-400 via-sky-500 to-blue-600" />
                <span>{item}</span>
              </li>
            ))}
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

