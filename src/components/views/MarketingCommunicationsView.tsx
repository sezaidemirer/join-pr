'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

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
            src="/join_pr_pazarlama_iletisimi.jpg"
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

      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Request a Quote for Marketing Communications' : 'Pazarlama İletişimi için Teklif İsteyin'}
            </h2>
            <p className="mt-3 text-sm text-zinc-200 md:text-base">
              {isEn
                ? 'Get in touch with us to discuss your marketing communications needs.'
                : 'Pazarlama iletişimi ihtiyaçlarınızı görüşmek için bizimle iletişime geçin.'}
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


