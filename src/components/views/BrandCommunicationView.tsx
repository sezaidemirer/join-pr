'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

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
            src={`${BASE_PATH}/join_pr_marka_iletisimi.jpg`}
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

      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Request a Quote for Brand Communication' : 'Marka İletişimi için Teklif İsteyin'}
            </h2>
            <p className="mt-3 text-sm text-zinc-200 md:text-base">
              {isEn
                ? 'Get in touch with us to discuss your brand communication needs.'
                : 'Marka iletişimi ihtiyaçlarınızı görüşmek için bizimle iletişime geçin.'}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/25 whitespace-nowrap"
          >
            {isEn ? 'Contact Us' : 'İletişime Geç'}
          </Link>
        </div>
      </section>
    </div>
  );
}


