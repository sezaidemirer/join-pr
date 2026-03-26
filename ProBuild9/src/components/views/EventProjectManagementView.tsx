'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function EventProjectManagementView() {
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
            {isEn ? 'Event and Project Management' : 'Etkinlik ve Proje Yönetimi'}
          </h1>
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_etkinlik_ve_proje_yonetimi.webp`}
            alt={isEn ? 'Event and project management - professional organization' : 'Etkinlik ve proje yönetimi - profesyonel organizasyon'}
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
              We build data-driven media planning and buying strategies that connect brands with their audiences in the most effective and impactful way. From digital platforms to television, print, and out-of-home channels, we design holistic media ecosystems that deliver the right message at the right moment through the right touchpoints.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Our process combines budget optimization, channel selection, performance measurement, and campaign management—maximizing visibility while driving measurable return on investment.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              With a results-focused and insight-led approach, we empower brands with more than reach; we deliver influence, efficiency, and sustained communication power across every media channel.
            </p>
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              Markaların hedeflerine, konumlandırmasına ve iletişim stratejisine uygun kapsamlı etkinlik ve proje yönetimi çözümleri sunarız. Kreatif fikrin geliştirilmesinden planlamaya, operasyonel süreçlerden deneyim tasarımına kadar tüm aşamaları uçtan uca yönetir; markaların unutulmaz, etkili ve stratejik olarak kurgulanmış etkinliklere imza atmasını sağlarız.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Lansmanlardan özel davetlere, sponsorluk entegrasyonlarından destinasyon projelerine, medya etkinliklerinden influencer aktivasyonlarına kadar geniş bir alanda projeler tasarlar; her temas noktasında marka algısını güçlendiren bütünsel bir deneyim yaratırız.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Etkinlik ve proje yönetimi yaklaşımımız, markalara yalnızca bir organizasyon değil; dönüşüm sağlayan, iz bırakan ve hikâyeye değer katan bir deneyim sunmayı hedefler.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

