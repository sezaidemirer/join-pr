'use client';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

export function JoinSocialView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinSocial;

  const sections = Object.values(page.sections);

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-500/10 via-cyan-800/40 to-slate-950 p-10 shadow-2xl shadow-teal-900/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18),_transparent_60%)]" />
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-200">Join Social</span>
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{page.hero.title}</h1>
          <p className="max-w-2xl text-lg text-zinc-200">{page.hero.subtitle}</p>
          <p className="max-w-3xl text-base text-zinc-300">{page.hero.description}</p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{translations.common.menu.joinSocial}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => (
            <ServiceCard
              key={section.title}
              title={section.title}
              description={section.description}
              accent={index % 2 === 0 ? 'teal' : 'sky'}
            />
          ))}
        </div>
      </section>

      <section className="space-y-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-10">
        <h3 className="text-2xl font-semibold text-white">{page.process.title}</h3>
        <ol className="relative grid gap-8 md:grid-cols-4">
          {page.process.steps.map((step, index) => (
            <li key={step.title} className="group relative rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 via-sky-500 to-blue-500 text-sm font-semibold text-white shadow-md shadow-sky-500/30">
                {index + 1}
              </div>
              <h4 className="text-lg font-semibold text-white">{step.title}</h4>
              <p className="mt-3 text-sm text-zinc-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

