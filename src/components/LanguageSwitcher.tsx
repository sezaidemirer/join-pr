'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { locale, setLocale, translations } = useLanguage();
  const labels = translations.common.language;

  return (
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
      <span className="hidden text-zinc-500 lg:inline">{labels.label}</span>
      <div className="flex overflow-hidden rounded-full border border-zinc-700 bg-zinc-900/80 backdrop-blur">
        {(['tr', 'en'] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`px-3 py-1 transition-colors ${locale === code ? 'bg-gradient-to-r from-teal-500/80 via-sky-500/80 to-blue-600/80 text-white shadow-lg shadow-sky-500/40' : 'text-zinc-400 hover:text-white'}`}
          >
            {labels[code]}
          </button>
        ))}
      </div>
    </div>
  );
}

