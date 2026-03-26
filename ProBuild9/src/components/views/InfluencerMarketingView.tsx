'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function InfluencerMarketingView() {
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">
            {isEn ? 'Services' : 'Hizmetlerimiz'}
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {isEn ? 'Influencer Marketing' : 'Influencer Marketing'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_marka_iletisimi.webp`}
            alt={isEn ? 'Influencer marketing - social media collaboration' : 'Influencer marketing - sosyal medya iş birliği'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-zinc-200 shadow-xl shadow-black/30">
        {isEn ? (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              We develop comprehensive influencer marketing strategies that enable brands to build authentic, impactful, and conversion-focused relationships with their target audiences.
            </p>
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              Markaların hedef kitleleriyle otantik, etkileyici ve dönüşüm odaklı ilişkiler kurmasını sağlayan kapsamlı influencer marketing stratejileri geliştiririz.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

