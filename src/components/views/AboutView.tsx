'use client';

import { CTASection } from '@/components/CTASection';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function AboutView() {
  const { translations } = useLanguage();
  const page = translations.pages.about;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">
            {translations.common.menu.home}
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            {page.hero.title}
          </h1>
        </div>
        
        <div className="space-y-6 text-lg leading-relaxed text-zinc-300">
          <p className="text-xl font-medium text-white md:text-2xl">
            {page.hero.subtitle}
          </p>
          <p className="leading-relaxed">
            {page.content.paragraph1}
          </p>
          <p className="leading-relaxed">
            {page.content.paragraph2}
          </p>
        </div>
      </div>

      <CTASection
        title={translations.contact.hero.title}
        description={translations.contact.hero.description}
        buttonLabel={translations.common.cta.contactUs}
        href="/iletisim"
      />
    </div>
  );
}
