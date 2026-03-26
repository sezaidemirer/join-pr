'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import tr from '@/locales/tr.json';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function NewsCategoryView() {
  const { translations } = useLanguage();
  const cases = translations.homepage.cases;
  const [adminNews, setAdminNews] = useState<Array<{ title: string; slug: string; description: string; image?: string | null }>>([]);
  
  // TR dosyasından haberleri al (slug oluşturmak için)
  const trCases = (tr.homepage?.cases?.cards || []) as Array<{ title: string; category: string; description: string; image?: string }>;
  
  // Önce translations'dan al, yoksa TR dosyasından al
  const caseItems = (cases?.cards || trCases) as Array<{ title: string; category: string; description: string; image?: string }>;
  
  const displayItems = caseItems;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (!res.ok) return;
        const mapped = ((data.items || []) as any[]).map((item) => ({
          title: item.title,
          slug: item.slug,
          description: item.description,
          image: item.image,
        }));
        if (alive) setAdminNews(mapped);
      } catch {
        // Sessiz fallback: sadece locale haberleri goster.
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const mergedItems = [
    ...adminNews.map((x) => ({ ...x, __isAdmin: true })),
    ...displayItems.map((x) => ({ ...x, __isAdmin: false })),
  ];

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
            const slug = (card as any).__isAdmin
              ? (card as any).slug
              : (() => {
                  // Her zaman TR başlığından slug oluştur (aynı index'teki TR haberi kullan)
                  const trCard = trCases[index - adminNews.length];
                  return trCard ? slugify(trCard.title) : slugify(card.title);
                })();
            // Eski davranis korunur: ozel haber karti direkt dis linke gitsin.
            const isSpecialNews = !(card as any).__isAdmin && slug === 'turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu';
            const href = isSpecialNews
              ? 'https://www.iha.com.tr/haber-turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu-1141810'
              : `/haber/${slug}`;
            
            return (
              <Link
                key={`${card.title}-${index}`}
                href={href}
                {...(isSpecialNews ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-glow-teal"
              >
                {card.image && (
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <Image
                      src={`${BASE_PATH}${card.image}`}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-teal-100 transition-colors">
                    {card.title}
                  </h3>
                  <p className="flex-1 text-sm text-zinc-400 line-clamp-4">{card.description}</p>
                </div>
              </Link>
            );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-zinc-400">İçerik bulunamadı.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}



