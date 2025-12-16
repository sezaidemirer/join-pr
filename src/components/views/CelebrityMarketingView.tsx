'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

export function CelebrityMarketingView() {
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
            {isEn ? 'Celebrity Marketing' : 'Celebrity Marketing'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_celebrity_marketing.jpg`}
            alt={isEn ? 'Celebrity marketing - brand partnership' : 'Celebrity marketing - marka ortaklığı'}
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
              We create celebrity marketing strategies that build powerful, credible, and high-impact connections between brands and audiences. Through our extensive network of actors, performers, cultural figures, and public personalities, we match brands with the most influential voices—turning visibility into meaningful brand equity.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              The talent we collaborate with carries strong influence not only in local markets, but across a wide global footprint—from the Middle East and Europe to the Balkans and Asia—enabling brands to extend their presence far beyond their primary target markets. This global influence elevates brand perception, strengthens international visibility, and unlocks new market opportunities.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              By integrating celebrity partnerships with creative content concepts, media amplification, PR visibility, and cross-platform storytelling, we help brands achieve international recognition, elevated prestige, and long-term strategic impact.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Our celebrity marketing approach is built on global reach, cultural resonance, and measurable influence—empowering brands to grow not only locally, but on the world stage.
            </p>
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              Markaların hedef kitleleriyle güçlü, güvenilir ve yüksek etkileşim yaratan bağlar kurmasını sağlayan kapsamlı celebrity marketing stratejileri geliştiririz. Dizi ve sinema oyuncuları, müzisyenler, sporcular ve kültürel figürlerden oluşan geniş network’ümüzle markaları en doğru yüzlerle bir araya getirir; iletişim gücünü etkili bir hikâyeye dönüştürürüz.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Çalıştığımız oyuncular ve tanınmış isimler, yalnızca yerel pazarda değil; Orta Doğu’dan Avrupa’ya, Balkanlardan Asya’ya uzanan geniş bir coğrafyada güçlü bir etki alanına sahiptir. Bu global görünürlük, markaların hedefledikleri pazarların ötesinde uluslararası bir algı ve prestij kazanmasını sağlar.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Celebrity iş birliklerini kreatif içerik kurguları, medya entegrasyonları, global sosyal medya görünürlüğü ve PR stratejileriyle destekleyerek markalara yerel kampanyaların çok ötesinde, uluslararası bilinirlik ve yüksek marka değeri kazandırırız.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Celebrity marketing yaklaşımımız, markaları sadece tanınan yüzlerle buluşturmak değil; global etki, uluslararası görünürlük ve uzun vadeli marka gücü yaratmak üzerine kuruludur.
            </p>
          </>
        )}
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Request a Quote for Celebrity Marketing' : 'Celebrity Marketing için Teklif İsteyin'}
            </h2>
            <p className="mt-3 text-sm text-zinc-200 md:text-base">
              {isEn
                ? 'Get in touch with us to discuss your celebrity marketing needs.'
                : 'Celebrity marketing ihtiyaçlarınızı görüşmek için bizimle iletişime geçin.'}
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

