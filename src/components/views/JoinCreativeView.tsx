'use client';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

export function JoinCreativeView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinCreative;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-purple-900/50 to-slate-950 p-10 shadow-2xl shadow-purple-950/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_60%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-fuchsia-200">Join Creative</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{page.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{page.hero.subtitle}</p>
          <p className="max-w-3xl text-base text-zinc-300">{page.hero.description}</p>
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
          {page.portfolio.items.map((item) => (
            <div
              key={item}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-lg shadow-black/40"
            >
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-purple-500/30 via-sky-500/20 to-transparent">
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white/20">
                  {item.charAt(0)}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

