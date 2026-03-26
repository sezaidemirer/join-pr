'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function BrandCommunicationView() {
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
            {isEn ? 'Brand Communication' : 'Marka İletişimi'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_marka_iletisimi.webp`}
            alt={isEn ? 'Brand communication - brand building' : 'Marka iletişimi - marka inşası görseli'}
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
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              We design brand communication frameworks that define identity, amplify value, and create lasting relevance. Every narrative,
              touchpoint, and expression is crafted to strengthen recognition, build emotional connection, and establish a distinct
              position in the market.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Our approach transforms brand stories into impactful experiences—driving preference, loyalty, and influence. With strategic
              clarity and creative precision, we ensure brands speak with purpose, resonate with their audiences, and stand out with
              unmistakable presence.
            </p>
          </>
        ) : (
          <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
            Markaların kimliğini, değerlerini ve vaadini doğru kitlelerle buluşturan kapsamlı iletişim modelleri tasarlarız. Her temas
            noktasında tutarlı, güçlü ve akılda kalıcı bir marka algısı oluşturur; markaların hikâyelerini stratejik bir bütünlük içinde
            konumlandırırız. Amacımız, markaların yalnızca tanınmasını değil, benimsenmesini ve tercih edilmesini sağlamaktır.
          </p>
        )}
      </div>
    </div>
  );
}


