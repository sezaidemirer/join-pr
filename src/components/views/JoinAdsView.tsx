'use client';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

export function JoinAdsView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinAds;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-orange-900/50 to-slate-950 p-10 shadow-2xl shadow-orange-950/40 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_60%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-amber-200">Join Ads</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{page.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{page.hero.subtitle}</p>
          <p className="max-w-3xl text-base text-zinc-300">{page.hero.description}</p>
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

