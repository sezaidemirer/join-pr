'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { mergeAdminAndStaticNewsCards } from '@/lib/merge-news-cards';
import { hrefForNewsCard } from '@/lib/news-href';
import { getNewsApiUrl, resolveNewsImageSrc } from '@/lib/news-api';
import tr from '@/locales/tr.json';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function NewsCategoryView() {
  const { translations, locale } = useLanguage();
  const cases = translations.homepage.cases;
  const [adminNews, setAdminNews] = useState<
    Array<{ title: string; slug: string; description: string; image?: string | null }>
  >([]);

  const trCases = (tr.homepage?.cases?.cards || []) as Array<{
    title: string;
    category: string;
    description: string;
    image?: string;
  }>;

  const caseItems = (cases?.cards || trCases) as Array<{
    title: string;
    category: string;
    description: string;
    image?: string;
  }>;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(getNewsApiUrl(''));
        const data = await res.json();
        if (!res.ok) return;
        const mapped = ((data.items || []) as any[]).map((item) => ({
          title: locale === 'en' ? (item.title_en || item.title) : item.title,
          slug: item.slug,
          description: locale === 'en' ? (item.description_en || item.description) : item.description,
          image: item.image,
        }));
        if (alive) setAdminNews(mapped);
      } catch {
        /* Sessiz: yalnizca statik kartlar */
      }
    })();
    return () => {
      alive = false;
    };
  }, [locale]);

  const mergedItems = useMemo(
    () => mergeAdminAndStaticNewsCards(adminNews, caseItems, trCases),
    [adminNews, caseItems, trCases]
  );

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <section className="relative space-y-10 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6">
          <h1 className="text-4xl font-semibold text-white md:text-5xl">{cases?.title || 'Basında Biz'}</h1>
          {cases?.description && (
            <p className="max-w-3xl text-base text-zinc-400 md:text-lg">{cases.description}</p>
          )}
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {mergedItems.length > 0 ? (
            mergedItems.map((card, index) => {
              const slug = card.__source === 'admin' ? card.slug : card.__slug;
              const isSpecialNews =
                card.__source === 'static' &&
                slug === 'turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu';
              const href = hrefForNewsCard(
                card.__source === 'admin' ? 'admin' : 'static',
                slug,
                isSpecialNews
                  ? {
                      externalSpecialUrl:
                        'https://www.iha.com.tr/haber-turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu-1141810',
                    }
                  : undefined
              );
              const imgSrc = resolveNewsImageSrc(card.image, BASE_PATH);

              return (
                <Link
                  key={`${card.__source}-${slug}-${index}`}
                  href={href}
                  {...(isSpecialNews ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-glow-teal"
                >
                  {imgSrc ? (
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                      <Image
                        src={imgSrc}
                        alt={card.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h3 className="text-xl font-semibold text-white line-clamp-2 transition-colors group-hover:text-teal-100">
                      {card.title}
                    </h3>
                    <p className="line-clamp-4 flex-1 text-sm text-zinc-400">{card.description}</p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-zinc-400">İçerik bulunamadı.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
