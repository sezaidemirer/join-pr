'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getBlogApiUrl, resolveBlogImageSrc } from '@/lib/blog-api';

type BlogCard = {
  title: string;
  category: string;
  description: string;
  image?: string | null;
  slug: string;
};

export function BlogCategoryView() {
  const { translations, locale } = useLanguage();
  const blog = translations.homepage.blog;
  const [items, setItems] = useState<BlogCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(getBlogApiUrl(''));
        const data = await res.json();
        if (!res.ok) return;
        const mapped = ((data.items || []) as any[]).map((item) => ({
          title: locale === 'en' ? item.title_en || item.title : item.title,
          category: (locale === 'en' ? item.category_en || item.category : item.category) || '',
          description: locale === 'en' ? item.description_en || item.description : item.description,
          image: item.image,
          slug: item.slug,
        }));
        if (alive) setItems(mapped);
      } catch {
        /* Sessiz: bos liste gosterilir */
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [locale]);

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <section className="relative space-y-10 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6">
          <h1 className="text-4xl font-semibold text-white md:text-5xl">{blog.title}</h1>
          <p className="max-w-3xl text-base text-zinc-400 md:text-lg">{blog.description}</p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2">
          {items.map((card, index) => {
            const href = `/blog/${card.slug}`;
            const imgSrc = resolveBlogImageSrc(card.image);

            return (
              <Link
                key={`${card.slug}-${index}`}
                href={href}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-glow-teal"
              >
                {imgSrc && (
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <Image
                      src={imgSrc}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  {card.category && (
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">{card.category}</span>
                  )}
                  <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-teal-100 transition-colors">
                    {card.title}
                  </h3>
                  <p className="flex-1 text-sm text-zinc-400 line-clamp-4">{card.description}</p>
                </div>
              </Link>
            );
          })}
          {loaded && items.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-zinc-400">Henuz blog yazisi yok.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
