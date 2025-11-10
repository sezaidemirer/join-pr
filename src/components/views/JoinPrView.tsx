'use client';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

export function JoinPrView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinPr;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-blue-900/50 to-black p-10 shadow-2xl shadow-blue-950/30 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_65%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-sky-200">Join PR</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{page.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{page.hero.subtitle}</p>
          <p className="max-w-3xl text-base text-zinc-300">{page.hero.description}</p>
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

      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-10">
        <h3 className="text-2xl font-semibold text-white">{page.cases.title}</h3>
        <ul className="space-y-4 text-sm text-zinc-300">
          {page.cases.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-teal-400 via-sky-400 to-blue-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

