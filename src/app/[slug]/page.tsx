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
  const { translations } = useLanguage();

  const blog = translations.homepage.blog;
  const blogItems = blog.cards as Array<{ title: string; category: string; description: string; image?: string }>;
  const slug = typeof params.slug === 'string' ? params.slug : '';

  // Blog içerikleri - slug'a göre
  const blogContent: Record<string, { title: string; content: string; category?: string }> = {
    'genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlarini-kesfedin': {
      title: "Gençlik Mucizesi: Yüz ve Boyun Germe Ameliyatlarını Keşfedin!",
      content: "Yüz ve boyun germe ameliyatlarının son dönemde sıklıkla tercih edildiğini ve bütünsel genç bir görünüme zemin hazırladığını söyleyen Dr. Yücel Sarıaltın, \"Yüz ve boyun bölgesinin bir arada ele alınmasıyla bütünsel genç bir görünüm elde ediliyor. Geçiş bölgelerindeki sarkma ve gevşemeleri düzelterek daha harmonik bir görünüm elde edilebiliyor\" dedi.",
      category: "Marka İletişimi"
    },
    'ucak-bileti-fiyatina-avrupa-turlari': {
      title: "Uçak Bileti Fiyatına Avrupa Turları",
      content: "Mevcut ekonomik koşullarda tatil yapılabilmesi için daha çok çalıştıklarını ve erken rezervasyon döneminde olduğu gibi uygun fiyatlı paket turların sayısını artırdıklarını ifade eden Prontotour Yönetim Kurulu Başkanı Ali Onaran, vizesiz tur alternatiflerini de artırdıklarını belirtti.",
      category: "Destinasyon PR"
    }
  };

  const currentSlug = slug || '';
  const content = blogContent[currentSlug];
  
  // Özel slug için current'ı bul veya content'ten oluştur
  const current = blogItems.find((item) => slugify(item.title) === slug) || 
    (content ? {
      title: content.title,
      category: content.category || 'Blog',
      description: content.content.substring(0, 150) + '...',
      image: slug === 'ucak-bileti-fiyatina-avrupa-turlari' ? '/ucak-bileti-fiyatina-avrupa-turlari.jpg' : '/genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlari.jpg'
    } : null);

  // Eğer blog yazısı değilse 404
  if (!current && !content) {
    return (
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-4xl font-semibold text-white">Sayfa bulunamadı</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
          >
            Geri dön
          </button>
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-300">
          {current.category}
        </div>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">
          {content?.title || current.title}
        </h1>
      </div>

      {current.image && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={`${BASE_PATH}${current.image}`}
              alt={content?.title || current.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}

      {(content || current.description) && (
        <div className="prose prose-invert max-w-none">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-8">
            <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
              {content?.content || current.description}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href="/kategori/blog"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
        >
          Bloglara dön
        </Link>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}

