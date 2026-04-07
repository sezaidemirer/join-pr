'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import { FormConsentEmbed } from '@/components/FormConsentEmbed';
import Link from 'next/link';

const SECTOR_SLIDES = [
  { src: '/reklam_sosyal_medya/beauty_wellness_join_pr-26b0b4c3-d13c-45cc-9d5a-dae701e74d11.webp', label: 'Beauty & Wellness' },
  { src: '/reklam_sosyal_medya/premium_product_join_pr-8913c24a-bcfc-4258-a437-44f80e44ccf7.webp', label: 'Premium Ürün' },
  { src: '/reklam_sosyal_medya/fly_join_pr-41030733-95b8-4722-bef9-f1aa02157f55.webp', label: 'Havacılık' },
  { src: '/reklam_sosyal_medya/trafel_join_pr-07864a11-d44d-453b-9843-f3629a6f33c3.webp', label: 'Seyahat & Turizm' },
  { src: '/reklam_sosyal_medya/life_style_join_pr-226029c5-91b5-4df1-9b77-f1fc6c808388.webp', label: 'Lifestyle' },
  { src: '/reklam_sosyal_medya/kurumsal_sirket_join_pr-8e6c5e79-bb8e-4a8d-9f5e-bd0dc67e52ca.webp', label: 'Kurumsal' },
  { src: '/reklam_sosyal_medya/luxury_join_pr-7ff2ec58-e42e-41bf-b08f-0f567160a7fc.webp', label: 'Lüks & Otel' },
];
const SECTOR_SLIDER_INTERVAL = 4500;

// Video bölümü: YouTube video ID (watch?v=XXXXX). Boşsa placeholder gösterilir.
const SOSYAL_MEDYA_VIDEO_ID = '7LZ2DZJfrAM';

const HIZMET_SECIMI = [
  'Sosyal Medya Yönetimi',
  'İçerik Planlama',
  'İçerik Takvimi Yönetimi',
  'Reels / Shorts / Kısa Video Operasyonu',
  'Yorum & Mesaj Yönetimi',
  'Marka Dili ve İçerik Tutarlılığı',
  'Raporlama ve Performans Takibi',
  'Genel Bilgi',
];

export function SosyalMedyaYonetimiLandingView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sectorSlideIndex, setSectorSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSectorSlideIndex((prev) => (prev + 1) % SECTOR_SLIDES.length);
    }, SECTOR_SLIDER_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 px-6 py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_40%,rgba(20,184,166,0.1),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-16 lg:items-start">
            <div className="space-y-5 lg:space-y-6">
              <h1 className="text-2xl font-semibold leading-[1.2] tracking-tight text-white sm:text-3xl md:text-3xl lg:text-[1.9rem] xl:text-4xl">
                Sosyal medyayı günlük paylaşım rutininden çıkarın, markanız için çalışan bir yapıya dönüştürün.
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                İçerik, yayın, optimizasyon ve raporlamayı tek yapıda yönetin. Dağınık sosyal medya yerine stratejik ve sürdürülebilir içerik operasyonu.
              </p>
              <div>
                <Link
                  href="#form"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-950 transition-all hover:bg-white/92 hover:shadow-xl hover:shadow-white/5"
                >
                  Teklif Al
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-base text-white/75">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  Planlı içerik akışı
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  Marka dili tutarlılığı
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  Raporlama ve optimizasyon
                </span>
              </div>
            </div>

            {/* Tek güçlü görsel: her zaman dolu, parlak ve net */}
            <div className="relative flex justify-center lg:justify-end lg:pt-0">
              <div className="relative w-full max-w-[560px]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-zinc-800 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=90"
                    alt="Sosyal medya ve içerik operasyonu"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    unoptimized
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-zinc-950/80 px-5 py-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">İçerik takvimi · Yayın · Raporlama</span>
                      <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40">
                        <span className="h-1 w-1 rounded-full bg-white" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* Altında hafif istatistik hissi */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <p className="text-xl font-bold text-white md:text-2xl">Planla</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 md:text-xs">İçerik takvimi</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <p className="text-xl font-bold text-white md:text-2xl">Yayınla</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 md:text-xs">Tutarlı dil</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                    <p className="text-xl font-bold text-white md:text-2xl">Ölç</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 md:text-xs">Raporlama</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReferanslarSection />

      {/* VIDEO BÖLÜMÜ */}
      <section className="border-b border-white/10 bg-zinc-900/40 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            Yeni Nesil Sosyal medya operasyonunu keşfedin
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-white/80">
            İçerik planlama, takvim ve raporlama sürecimizi kısa videoda izleyin.
          </p>
          <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/5">
            {SOSYAL_MEDYA_VIDEO_ID ? (
              <iframe
                title="Sosyal medya yönetimi"
                src={`https://www.youtube.com/embed/${SOSYAL_MEDYA_VIDEO_ID}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <svg className="h-12 w-12 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-lg font-medium text-white/90">Video burada</p>
                <p className="max-w-sm text-center text-sm text-white/60">YouTube video ID&apos;nizi SOSYAL_MEDYA_VIDEO_ID ile ekleyin.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM */}
      <section className="border-b border-white/10 bg-zinc-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Markaların sosyal medyada yaşadığı sorunlar
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Dağınık yönetim marka algısına zarar verir; operasyonel tutarlılık olmadan görünürlük sürdürülemez.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[160px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85"
                alt="Sosyal medya ve içerik stratejisi"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Dağınık sosyal medya yerine tek operasyon.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Düzensiz paylaşım', desc: 'Bazen yoğun, bazen sessiz. Algoritma ve takipçi ilişkisi zayıf kalıyor.' },
              { title: 'Marka dilinde tutarsızlık', desc: 'Her içerikte farklı ton ve mesaj. Marka bütünlüğü kayboluyor.' },
              { title: 'İçerik Üretiminde Yetersizlik', desc: 'Reels/shorts ihtiyacı var ama düzenli üretim kurulamıyor.' },
              { title: 'Estetik var, strateji yok', desc: 'Görsel kalite iyi ama içerik hedefe ve kitleye hizmet etmiyor.' },
              { title: 'Raporlama ve optimizasyon eksik', desc: 'Ne çalışıyor ne çalışmıyor bilinmiyor. Veriye dayalı karar yok.' },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Tek yapıda sosyal medya yönetimi
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            İçerik planlamadan raporlamaya kadar tüm operasyon tek sistemde ilerler.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[160px] bg-zinc-900">
              <Image
                src="/social_page_media.webp"
                alt="Sosyal medya operasyonu"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Planlama · Yayın · Moderasyon · Raporlama</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Sosyal Medya Yönetimi', desc: 'Markanın tüm sosyal medya kanalları günlük olarak uçtan uca yönetilir. Yayın akışı, içerik planlaması ve süreç takibi tek merkezden yürütülür.' },
              { title: 'İçerik Planlama', desc: 'Marka stratejisine uygun içerik başlıkları, tema kurgusu ve iletişim akışı planlanır. Her içerik, marka dilini destekleyecek şekilde yapılandırılır.' },
              { title: 'İçerik Takvimi Yönetimi', desc: 'Aylık ve haftalık içerik takvimi oluşturulur. Onay süreçleri, yayın sıralaması ve paylaşım zamanlaması kontrollü şekilde yönetilir.' },
              { title: 'Reels / Shorts / Kısa Video Operasyonu', desc: 'Kısa video içerikleri platform dinamiklerine uygun şekilde kurgulanır, planlanır ve yayına alınır. Düzenli üretim ve sürdürülebilir yayın akışı esas alınır.' },
              { title: 'Yorum & Mesaj Yönetimi', desc: 'Yorum ve direkt mesaj süreçleri marka tonuna uygun şekilde yönetilir. Hızlı, kontrollü ve tutarlı bir iletişim akışı sağlanır.' },
              { title: 'Marka Dili ve İçerik Tutarlılığı', desc: 'Tüm içeriklerde marka tonu, anlatım dili ve görsel bütünlük korunur. Böylece her mecrada güçlü ve tutarlı bir iletişim yapısı oluşturulur.' },
              { title: 'Raporlama ve Performans Takibi', desc: 'İçerik performansı düzenli olarak analiz edilir ve raporlanır. Elde edilen veriler doğrultusunda içerik stratejisi sürekli optimize edilir.' },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 transition-all duration-300 hover:border-teal-500/40 hover:bg-teal-500/10"
              >
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY IT WORKS */}
      <section className="border-b border-white/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Neden bu sistem etkili?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Sosyal medya yönetimi bir tasarım işi değil, operasyonel bir sistemdir.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[140px] bg-zinc-900">
              <Image
                src="/reklam_sosyal_medya/sosyal_medya.webp"
                alt="Sosyal medya yönetim sistemi"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/30 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Planlı akış, tutarlı dil, ölçülebilir sonuç.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Planlı içerik akışı', desc: 'Takvim ve sütunlar sayesinde boşluk kalmaz, yayın düzeni korunur.' },
              { title: 'Marka dili bütünlüğü', desc: 'Her paylaşım aynı dil ve tonla; marka algısı güçlenir.' },
              { title: 'Sürekli kısa video üretimi', desc: 'Reels/shorts düzenli planlanır ve yayınlanır.' },
              { title: 'Ölçülebilir performans', desc: 'Metrikler takip edilir; neyin işe yaradığı netleşir.' },
              { title: 'Operasyonel disiplin', desc: 'İçerik üretimi, yayın, optimizasyon ve raporlama entegre ilerler.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/85">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. KULLANIM SENARYOLARI */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Join Social Markalara Ne Tür Avantajlar Sağlar?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Sektöre özel içerik stratejisi ve operasyonel destek.
          </p>
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[200px] bg-zinc-900">
              {SECTOR_SLIDES.map((slide, i) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === sectorSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  aria-hidden={i !== sectorSlideIndex}
                >
                  <Image
                    src={slide.src}
                    alt={slide.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">{slide.label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSectorSlideIndex((prev) => (prev - 1 + SECTOR_SLIDES.length) % SECTOR_SLIDES.length)}
              aria-label="Önceki"
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white transition-colors hover:border-white/40 hover:bg-white/10 md:left-4 md:h-12 md:w-12"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setSectorSlideIndex((prev) => (prev + 1) % SECTOR_SLIDES.length)}
              aria-label="Sonraki"
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white transition-colors hover:border-white/40 hover:bg-white/10 md:right-4 md:h-12 md:w-12"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {SECTOR_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSectorSlideIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-colors md:h-2 md:w-2 ${i === sectorSlideIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { sector: 'Oteller', solve: 'Rezervasyon ve görünürlük. Oda, deneyim ve destinasyon içerikleriyle düzenli iletişim.' },
              { sector: 'Restoranlar', solve: 'Atmosfer ve deneyim iletişimi. Menü, mekan ve hikaye odaklı içerik planı.' },
              { sector: 'Klinikler', solve: 'Güven ve uzmanlık algısı. Bilgilendirici ve kurumsal dilde içerik yönetimi.' },
              { sector: 'Beauty markaları', solve: 'Ürün ve deneyim odaklı içerik. Reels ve story akışı ile sürekli görünürlük.' },
              { sector: 'Lifestyle markaları', solve: 'İmaj yönetimi. Tutarlı marka hikayesi ve etkileşim.' },
              { sector: 'Kurumsal firmalar', solve: 'Düzenli dijital iletişim. Kurumsal dilde içerik takvimi ve raporlama.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]">
                <h3 className="text-lg font-semibold text-white">{item.sector}</h3>
                <p className="mt-2 text-sm text-white/85">{item.solve}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROCESS */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Süreç nasıl işler?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg text-white/90">
            Net adımlar, şeffaf ilerleme, raporlama odaklı çalışma.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[2/1] w-full min-h-[200px] bg-zinc-900 md:aspect-[21/9]">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=85"
                alt="Süreç ve iş birliği"
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/40 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white/90 md:left-8 md:right-auto md:max-w-md">Analizden raporlamaya şeffaf süreç.</p>
            </div>
          </div>
          <div className="mt-16 space-y-0">
            {[
              { step: 1, title: 'Marka ve hedef analizi', desc: 'Hedef kitle, rakipler ve iletişim hedefleri netleştirilir. Mevcut kanallar ve içerik değerlendirilir.' },
              { step: 2, title: 'İçerik stratejisi ve içerik sütunları', desc: 'Hangi temalarda, hangi sıklıkta içerik üretileceği belirlenir. Marka diline uygun sütunlar oluşturulur.' },
              { step: 3, title: 'Aylık planlama ve takvim oluşturma', desc: 'Aylık içerik takvimi hazırlanır. Onay sonrası yayın planı kilitlenir.' },
              { step: 4, title: 'İçerik üretimi / yayın / optimizasyon', desc: 'İçerikler üretilir, zamanında yayınlanır.' },
              { step: 5, title: 'Raporlama ve optimizasyon', desc: 'Aylık performans raporu sunulur. Metriklere göre içerik ve takvim iyileştirilir.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 border-b border-white/10 py-10 last:border-0">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-white/85">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="border-b border-white/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Sıkça sorulan sorular
          </h2>
          <div className="mt-16 space-y-4">
            {[
              { q: 'Hangi markalar için uygun?', a: 'Otel, restoran, klinik, beauty, lifestyle ve premium tüketim markaları ile kurumsal firmalar. Düzenli sosyal medya yönetimi ihtiyacı olan her işletme için uygundur.' },
              { q: 'Sadece içerik üretimi mi yapılıyor?', a: 'Hayır. İçerik planlama, takvim yönetimi, yayın, yorum ve mesaj yönetimi ile raporlama birlikte sunulur. Operasyonel bütünlük esastır.' },
              { q: 'Yorum ve mesaj yönetimi dahil mi?', a: 'Evet. Yorum ve DM yanıtları marka diline uygun şekilde yönetilir. Süre ve ton tutarlılığı sağlanır.' },
              { q: 'Kısa video içerikleri düzenli hazırlanıyor mu?', a: 'Evet. Reels, shorts ve kısa video içerikleri içerik planına dahil edilir ve düzenli üretilip yayınlanır.' },
              { q: 'Aylık planlama nasıl yapılıyor?', a: 'Marka ve hedefe göre içerik sütunları belirlenir. Aylık takvim oluşturulur, onayınızdan sonra yayın planı uygulanır.' },
              { q: 'Onay süreci nasıl işliyor?', a: 'İçerikler size sunulur veya özetlenir; onay sonrası yayına alınır. Kritik paylaşımlar için ön onay talep edilebilir.' },
              { q: 'Raporlama yapılıyor mu?', a: 'Evet. Aylık performans raporu sunulur. Takipçi, etkileşim, erişim ve içerik performansı özetlenir; iyileştirme önerileri paylaşılır.' },
              { q: 'Birden fazla platform birlikte yönetilebiliyor mu?', a: 'Evet. Instagram, Facebook, TikTok, LinkedIn gibi kanallar tek operasyon çatısında planlanıp yönetilebilir.' },
            ].map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <span className="text-teal-400">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-white/10 px-6 py-4 text-white/90">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative border-b border-white/10 bg-zinc-950 px-6 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(20,184,166,0.12),_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Sosyal medyanızı sisteme dönüştürün
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Teklif alın veya planlama görüşmesi yapın. Aşağıdaki formu doldurmanız yeterli.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-950 transition-all hover:bg-white/90 hover:shadow-lg"
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </section>

      {/* 9. CONTACT / LEAD FORM */}
      <section id="form" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            İletişim formu
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-4 md:p-6">
            <FormConsentEmbed
              ariaLabel="Join-Form-Landing"
              src="https://forms.joinpr.com.tr/joinus1/form/JoinFormLanding/formperma/I50RnMGr5e2CLfOswetbEV7jdQ_N9gkidjRZUcvnfl0"
              iframeHeight={500}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
