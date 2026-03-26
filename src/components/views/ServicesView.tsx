'use client';

import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function ServicesView() {
  const { translations } = useLanguage();
  const page = translations.pages.services;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 pb-16 pt-24 sm:px-8 lg:px-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          {page.hero.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-300">
          {page.hero.description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {page.services.map((service, index) => {
          const accent = (index % 3 === 0 ? 'teal' : index % 3 === 1 ? 'sky' : 'blue') as 'teal' | 'sky' | 'blue';
          return (
            <ServiceCard
              key={service.slug}
              title={service.title}
              description={service.description}
              accent={accent}
              href={`/${service.slug}`}
              image={service.image ? `${BASE_PATH}${service.image}` : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
