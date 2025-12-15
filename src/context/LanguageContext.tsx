'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

export type Locale = 'tr' | 'en';

const TRANSLATIONS = {
  en,
  tr,
} satisfies Record<Locale, typeof en>;

const STORAGE_KEY = 'joinpr_locale';

type TranslationValue = string | number | boolean | null | undefined | TranslationValue[] | { [key: string]: TranslationValue };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, replacements?: Record<string, string | number>) => TranslationValue;
  translations: typeof en;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function resolvePath(path: string, locale: Locale): TranslationValue {
  const segments = path.split('.');
  let current: TranslationValue = TRANSLATIONS[locale];

  for (const segment of segments) {
    if (current && typeof current === 'object' && !Array.isArray(current)) {
      current = (current as Record<string, TranslationValue>)[segment];
    } else {
      return path;
    }
  }

  if (current === undefined) {
    return path;
  }

  return current;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'tr' || stored === 'en') {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
      window.localStorage.setItem(STORAGE_KEY, locale);
      // Cookie'ye de kaydet (metadata için server-side erişim)
      document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [locale]);

  const setLocale = useCallback((value: Locale) => {
    setLocaleState(value);
  }, []);

  const translate = useCallback(
    (path: string, replacements?: Record<string, string | number>) => {
      const rawValue = resolvePath(path, locale);

      if (typeof rawValue !== 'string' || !replacements) {
        return rawValue;
      }

      return Object.entries(replacements).reduce((acc, [key, value]) => {
        return acc.replaceAll(`{{${key}}}`, String(value));
      }, rawValue);
    },
    [locale],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: translate,
      translations: TRANSLATIONS[locale],
    }),
    [locale, setLocale, translate],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslate() {
  const { t } = useLanguage();
  return t;
}

