'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function SponsorshipCommunicationView() {
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
            {isEn ? 'Sponsorship Management' : 'Sponsorluk Yönetimi'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src="/join_pr_sponsorluk_iletisimi.jpg"
            alt={isEn ? 'Sponsorship management - brand partnership' : 'Sponsorluk yönetimi - marka ortaklığı'}
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
              We develop sponsorship communication strategies that connect brands with their audiences at the most impactful touchpoints. Across sports, gastronomy, music, culture, and live experiences, we design partnerships that elevate brand positioning, enhance visibility, and build long-term value.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Every opportunity is evaluated through the lens of the brand's strategic goals. Through creative activations, experiential concepts, compelling content, and integrated media visibility, we transform sponsorships into powerful communication and engagement platforms.
            </p>
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              Markaların hedef kitleleriyle en doğru temas noktalarında buluşmasını sağlayan kapsamlı sponsorluk iletişimi stratejileri geliştiririz. Spor, gastronomi, müzik, kültür–sanat, etkinlikler ve özel projeler gibi farklı alanlarda markanın konumlandırmasını güçlendiren, görünürlüğünü artıran ve marka değerine katkı sağlayan iş birlikleri tasarlarız.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Her sponsorluk fırsatını marka stratejisiyle uyumlu şekilde analiz eder; yaratıcı aktivasyonlar, deneyim odaklı uygulamalar, içerik kurguları ve medya entegrasyonlarıyla iş ortaklıklarını güçlü bir iletişim alanına dönüştürürüz.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Sponsorluk iletişimindeki yaklaşımımız, markalara yalnızca görünürlük değil; algı, etki ve sürdürülebilir değer kazandıran stratejik bir etkileşim alanı sunar.
            </p>
          </>
        )}
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Request a Quote for Sponsorship Management' : 'Sponsorluk Yönetimi için Teklif İsteyin'}
            </h2>
            <p className="mt-3 text-sm text-zinc-200 md:text-base">
              {isEn
                ? 'Get in touch with us to discuss your sponsorship management needs.'
                : 'Sponsorluk yönetimi ihtiyaçlarınızı görüşmek için bizimle iletişime geçin.'}
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

