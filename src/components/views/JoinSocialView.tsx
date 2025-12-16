'use client';

import Image from 'next/image';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function JoinSocialView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinSocial;

  const sections = Object.values(page.sections);
  const media = page.media;

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-400 via-cyan-600 to-blue-900 p-8 shadow-2xl shadow-teal-900/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-100">Join Social</span>
            <h1 className="text-[32px] font-semibold leading-tight text-white sm:text-[36px] md:text-[42px] lg:text-[48px]">
              {page.hero.title}
            </h1>
            <p className="max-w-2xl text-base text-teal-50/90 sm:text-lg">{page.hero.subtitle}</p>
            <p className="max-w-3xl text-sm text-teal-50/80 sm:text-base">{page.hero.description}</p>
          </div>
          <div className="flex-1 md:flex md:justify-end">
            <div className="relative mx-auto mt-6 w-full max-w-[22rem] sm:max-w-[24rem] md:mt-0 md:ml-auto md:max-w-[26rem] lg:max-w-[28rem]">
              <Image
                src={`${BASE_PATH}/social_page_banner.png`}
                alt="Join Social hero"
                width={800}
                height={500}
                priority
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl shadow-black/30 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white md:text-3xl">{media.title}</h3>
          {media.description && <p className="text-base text-zinc-300">{media.description}</p>}
          <ul className="space-y-3 text-base text-zinc-300">
            {media.items.map((item: string) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-br from-teal-400 via-sky-500 to-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-blue-600/20 blur-3xl" />
          <Image
            src={`${BASE_PATH}${media.image}`}
            alt={media.title}
            width={640}
            height={480}
            className="w-full rounded-3xl border border-white/5 object-cover"
          />
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

      {page.about && (
        <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:p-10">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.about.title}</h2>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
              {page.about.description}
            </p>
          </div>
        </section>
      )}

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

