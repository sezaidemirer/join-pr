'use client';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

export function JoinLabAiView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinLabAi;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-teal-900/50 to-slate-950 p-10 shadow-2xl shadow-emerald-950/40 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_60%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-emerald-200">Join Lab AI</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{page.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{page.hero.subtitle}</p>
          <p className="max-w-3xl text-base text-zinc-300">{page.hero.description}</p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{translations.common.menu.joinLabAi}</h2>
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

      <section className="space-y-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-10">
        <h3 className="text-2xl font-semibold text-white">{page.process.title}</h3>
        <div className="grid gap-6 md:grid-cols-5">
          {page.process.steps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 via-sky-500 to-blue-500 text-sm font-semibold text-white shadow-md shadow-sky-500/30">
                {index + 1}
              </div>
              <h4 className="text-lg font-semibold text-white">{step.title}</h4>
              <p className="mt-3 text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

