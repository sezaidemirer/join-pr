'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function InfluencerCelebrityMarketingView() {
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
            {isEn ? 'Influencer & Celebrity Marketing' : 'Influencer & Celebrity Marketing'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src="/join_pr_influencer_marketing.jpg"
            alt={isEn ? 'Influencer and celebrity marketing - brand partnerships' : 'Influencer ve celebrity marketing - marka ortaklıkları'}
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
              We build influencer marketing strategies that create authentic, high-impact connections between brands and their audiences. By aligning the right creators with the right campaign objectives, we ensure a strong and sustainable presence across the digital ecosystem.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              As a Meta Business with direct API integrations across platforms such as TikTok and YouTube, we deliver performance analytics that are accurate, real, and fully measurable. This advanced data infrastructure stands as one of Join PR's key differentiators in the influencer marketing landscape.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Our custom-built live performance dashboards allow brands to monitor campaigns in real time—providing transparent access to reach, engagement, views, CPM/CPE metrics, and every critical performance indicator.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Our influencer marketing approach goes beyond content creation; we build data-driven, measurable, and impact-focused communication models that translate into tangible brand value and meaningful results.
            </p>
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              Markaların hedef kitleleriyle otantik, etkileyici ve dönüşüm odaklı ilişkiler kurmasını sağlayan kapsamlı influencer marketing stratejileri geliştiririz. Doğru içerik üreticilerini doğru kampanya hedefleriyle eşleştirir; markaların dijital ekosistemde güçlü ve sürdürülebilir bir görünürlük elde etmesini sağlarız.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Meta Business, TikTok, YouTube gibi platformlarla sahip olduğumuz API bağlantıları sayesinde tüm içeriklerin performansını doğru, gerçek ve tamamen ölçümlenebilir verilerle raporlarız. Bu altyapı, Join PR'ın influencer marketing alanındaki en büyük ayrıştırıcı gücüdür.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Markalar için özel olarak tasarladığımız canlı dashboard sistemleri, kampanya performansının anlık olarak takip edilmesini sağlar; erişim, etkileşim, görüntülenme, CPM/CPE/CPV/CPC gibi tüm kritik metrikleri şeffaf ve detaylı şekilde sunar.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Influencer marketing yaklaşımımız, sadece içerik üretmek değil; veriye dayalı, etkisi ölçümlenebilir ve sonuç odaklı iletişim modelleri oluşturarak markalara somut değer kazandırmayı amaçlar.
            </p>
          </>
        )}
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Request a Quote for Influencer & Celebrity Marketing' : 'Influencer & Celebrity Marketing için Teklif İsteyin'}
            </h2>
            <p className="mt-3 text-sm text-zinc-200 md:text-base">
              {isEn
                ? 'Get in touch with us to discuss your influencer and celebrity marketing needs.'
                : 'Influencer ve celebrity marketing ihtiyaçlarınızı görüşmek için bizimle iletişime geçin.'}
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

