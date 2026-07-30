'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { getBlogApiUrl, resolveBlogImageSrc } from '@/lib/blog-api';

type BlogPost = {
  title: string;
  category: string;
  image: string | null;
  content: string;
};

export default function BlogDetailPage() {
  const params = useParams();
  const { locale } = useLanguage();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(getBlogApiUrl(`slug=${encodeURIComponent(slug)}`));
        const data = await res.json();
        const item = data.item;
        if (!item) {
          if (alive) setPost(null);
          return;
        }
        if (alive) {
          setPost({
            title: locale === 'en' ? item.title_en || item.title : item.title,
            category: (locale === 'en' ? item.category_en || item.category : item.category) || '',
            image: item.image,
            content: locale === 'en' ? item.content_en || item.content : item.content,
          });
        }
      } catch {
        if (alive) setPost(null);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug, locale]);

  if (loaded && !post) {
    return <div className="text-white text-center py-20">Blog bulunamadı</div>;
  }

  if (!post) {
    return <div className="text-white text-center py-20">Yükleniyor...</div>;
  }

  const imgSrc = resolveBlogImageSrc(post.image);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold mb-8">
          {post.title}
        </h1>

        {post.category && (
          <div className="mb-6 text-teal-400">
            {post.category}
          </div>
        )}

        {imgSrc && (
          <div className="mb-10 rounded-2xl overflow-hidden">
            <Image
              src={imgSrc}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full"
              unoptimized
            />
          </div>
        )}

        <div className="mb-10">
          <div className="text-zinc-300 text-base leading-relaxed whitespace-pre-line space-y-4">
            {post.content}
          </div>
        </div>

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
