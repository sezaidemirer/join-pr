'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

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

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { translations, locale } = useLanguage();

  const blog = translations.homepage.blog;
  const blogItems = blog.cards as Array<{ title: string; category: string; description: string; image?: string; link?: string }>;
  const slug = typeof params.slug === 'string' ? params.slug : '';

  // Blog içerikleri - slug'a göre (dil desteği ile)
  const blogContent: Record<string, Record<string, { title: string; content: string; category: string }>> = {
    'genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlarini-kesfedin': {
      tr: {
        title: "Gençlik Mucizesi: Yüz ve Boyun Germe Ameliyatlarını Keşfedin!",
        content: "Yüz ve boyun germe ameliyatlarının son dönemde sıklıkla tercih edildiğini ve bütünsel genç bir görünüme zemin hazırladığını söyleyen Dr. Yücel Sarıaltın, \"Yüz ve boyun bölgesinin bir arada ele alınmasıyla bütünsel genç bir görünüm elde ediliyor. Geçiş bölgelerindeki sarkma ve gevşemeleri düzelterek daha harmonik bir görünüm elde edilebiliyor\" dedi.",
        category: "Marka İletişimi"
      },
      en: {
        title: "The Miracle of Youth: Discover Face and Neck Lift Surgeries!",
        content: "Dr. Yücel Sarıaltın, who stated that face and neck lift surgeries have been frequently preferred recently and pave the way for a holistic youthful appearance, said, \"A holistic youthful appearance is achieved by addressing the face and neck area together. A more harmonious appearance can be achieved by correcting sagging and looseness in transition areas.\"",
        category: "Brand Communication"
      }
    },
    'ucak-bileti-fiyatina-avrupa-turlari': {
      tr: {
        title: "Uçak Bileti Fiyatına Avrupa Turları",
        content: "Mevcut ekonomik koşullarda tatil yapılabilmesi için daha çok çalıştıklarını ve erken rezervasyon döneminde olduğu gibi uygun fiyatlı paket turların sayısını artırdıklarını ifade eden Prontotour Yönetim Kurulu Başkanı Ali Onaran, vizesiz tur alternatiflerini de artırdıklarını belirtti.",
        category: "Destinasyon PR"
      },
      en: {
        title: "European Tours at Airline Ticket Prices",
        content: "Prontotour Chairman Ali Onaran stated that they have been working harder to enable vacations under current economic conditions and increased the number of affordable package tours as in the early reservation period, and also increased visa-free tour alternatives.",
        category: "Destination PR"
      }
    }
  };

  const currentSlug = slug || '';
  const content = blogContent[currentSlug]?.[locale];
  
  // Link ile eşleştirme yap (önce link, sonra slugify ile title)
  const current = blogItems.find((item) => {
    if (item.link) {
      const linkSlug = item.link.replace(/^\//, '');
      return linkSlug === slug;
    }
    return slugify(item.title) === slug;
  });

  // Eğer blog yazısı değilse 404
  if (!current && !content) {
    return (
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-4xl font-semibold text-white">{locale === 'tr' ? 'Sayfa bulunamadı' : 'Page not found'}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
          >
            {locale === 'tr' ? 'Geri dön' : 'Go back'}
          </button>
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {locale === 'tr' ? 'Ana sayfa' : 'Home'}
          </Link>
        </div>
      </div>
    );
  }

  // current veya content olmalı, ama yine de kontrol edelim
  const category = content?.category || current?.category || (locale === 'tr' ? 'Blog' : 'Blog');
  const title = content?.title || current?.title || (locale === 'tr' ? 'Blog Yazısı' : 'Blog Post');
  const image = current?.image || (content ? (slug === 'ucak-bileti-fiyatina-avrupa-turlari' ? '/ucak-bileti-fiyatina-avrupa-turlari.jpg' : '/genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlari.jpg') : null);
  const description = content?.content || current?.description || '';

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-300">
          {category}
        </div>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          {title}
        </h1>
      </div>

      {image && (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
          <Image
            src={`${BASE_PATH}${image}`}
            alt={title}
            width={1200}
            height={675}
            className="h-auto w-full max-h-[70vh] object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {description && (
        <div className="prose prose-invert max-w-none">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-8">
            <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
              {description}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href="/kategori/blog"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
        >
          {locale === 'tr' ? 'Bloglara dön' : 'Back to blog'}
        </Link>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {locale === 'tr' ? 'Ana sayfa' : 'Home'}
        </Link>
      </div>
    </div>
  );
}

