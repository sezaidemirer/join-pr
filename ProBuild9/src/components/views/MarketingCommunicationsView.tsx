'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function MarketingCommunicationsView() {
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
            {isEn ? 'Marketing Communications' : 'Pazarlama İletişimi'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_pazarlama_iletisimi.webp`}
            alt={isEn ? 'Marketing communications - strategy presentation' : 'Pazarlama iletişimi - strateji sunumu görseli'}
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
              We create integrated marketing communication strategies that articulate a brand’s value, define its positioning, and connect
              its message with the right audiences. By combining data, insight, and creativity, we help brands build not only visibility,
              but preference, relevance, and meaningful engagement.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Our approach unifies every touchpoint—campaign planning, content creation, digital strategy, and brand experiences—under a
              single strategic vision, transforming marketing objectives into measurable impact.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Through precise storytelling and audience-focused communication, we strengthen brand narratives, enhance competitive
              advantage, and support sustainable growth.
            </p>
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Markaların değer önerisini, konumlandırmasını ve mesajlarını doğru kitlelerle en etkili şekilde buluşturan bütünleşik
              pazarlama iletişimi stratejileri geliştiririz. Veri, içgörü ve yaratıcılığı bir araya getirerek markaların sadece görünür
              olmasını değil; tercih edilir, hatırlanır ve etkileşim yaratan bir konuma ulaşmasını sağlarız.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Kampanya kurgularından içerik tasarımına, dijital stratejilerden marka deneyimlerine kadar tüm süreçleri tek bir stratejik
              çatı altında yönetir; markaların pazarlama hedeflerini somut sonuçlara dönüştüren iletişim modelleri oluştururuz.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Pazarlama iletişimi yaklaşımımız, markaların hikâyesini güçlendirirken rekabet avantajını pekiştirir ve sürdürülebilir bir
              büyüme sağlar.
            </p>
          </>
        )}
      </div>
    </div>
  );
}


