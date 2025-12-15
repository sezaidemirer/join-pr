'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function BlogCategoryView() {
  const { translations } = useLanguage();
  const blog = translations.homepage.blog;
  const blogItems = blog.cards as Array<{ title: string; category: string; description: string; image?: string; link?: string }>;

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

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <section className="relative space-y-10 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6">
          <h1 className="text-4xl font-semibold text-white md:text-5xl">{blog.title}</h1>
          <p className="max-w-3xl text-base text-zinc-400 md:text-lg">{blog.description}</p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2">
          {blogItems.map((card, index) => {
            const href = card.link || '#';
            
            return (
              <Link
                key={`${card.title}-${index}`}
                href={href}
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
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">{card.category}</span>
                  <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-teal-100 transition-colors">
                    {card.title}
                  </h3>
                  <p className="flex-1 text-sm text-zinc-400 line-clamp-4">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}



