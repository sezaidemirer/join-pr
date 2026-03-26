'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogDetailPage() {
  const params = useParams();
  const { translations } = useLanguage();
  
  const slug = params.slug as string;
  const blogCards = translations.homepage.blog.cards as any[];
  
  // Blog kartını bul
  const blog = blogCards.find((card: any) => {
    const cardSlug = card.link?.replace('/', '') || '';
    return cardSlug === slug;
  });
  
  if (!blog) {
    return <div className="text-white text-center py-20">Blog bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* BAŞLIK */}
        <h1 className="text-5xl font-bold mb-8">
          {blog.title}
        </h1>
        
        {/* KATEGORİ */}
        <div className="mb-6 text-teal-400">
          {blog.category}
        </div>
        
        {/* GÖRSEL */}
        {blog.image && (
          <div className="mb-10 rounded-2xl overflow-hidden">
            <Image 
              src={blog.image} 
              alt={blog.title}
              width={1200}
              height={675}
              className="w-full"
              unoptimized
            />
          </div>
        )}
        
        {/* İÇERİK */}
        {blog.fullContent && (
          <div className="mb-10">
            <div className="text-zinc-300 text-base leading-relaxed whitespace-pre-line space-y-4">
              {blog.fullContent}
            </div>
          </div>
        )}
        
        {/* BUTONLAR */}
        <div className="mt-12 flex gap-4">
          <Link href="/" className="px-6 py-3 bg-teal-600 rounded-lg hover:bg-teal-700">
            Ana Sayfa
          </Link>
          <Link href="/kategori/blog" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10">
            Tüm Bloglar
          </Link>
        </div>
        
      </div>
    </div>
  );
}