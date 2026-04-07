'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import { FormConsentEmbed } from '@/components/FormConsentEmbed';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Showreel slider: 5 video. Her biri { id: 'YouTube ID', startSeconds?: number } (opsiyonel başlangıç saniyesi)
const SHOWREEL_VIDEOS: { id: string; start?: number }[] = [
  { id: 'yKVqZNb5p-s' },
  { id: 'BjvRTrv_35w' },
  { id: '6qv5e5n5mCg', start: 25 },
  { id: '4cquC9a4B_E' },
  { id: 'FLNg5aQb9rk' },
];

const SHORTS_ITEMS: { videoId: string; title: string }[] = [
  { videoId: '4ev7EgpMA80', title: 'Turkish Celebrities in Alami' },
  { videoId: 'Ndl6uBv5-R0', title: 'Turkish Celebrities in Hurghada' },
  { videoId: 'WAy4EBBaAu0', title: 'Turkish Celebrity x Rixos Master Chef' },
  { videoId: 'YSK4kWuAslQ', title: 'Ferida Restaurant Shooting' },
  { videoId: 'hPuHEpYYyTU', title: 'Restaurant Social Media Shooting' },
  { videoId: 'Mc1he2_Yebk', title: 'Video 6' },
  { videoId: 'c4GHm-Fe3bw', title: 'Video 7' },
  { videoId: 'Hnx4FnPuduA', title: 'Video 8' },
  { videoId: 'N0NBaj0o-qc', title: 'Video 9' },
];

const HIZMET_SECIMI = [
  'Reklam Filmi Prodüksiyonu',
  'Dijital İçerik Üretimi',
  'Kısa Video / Reels / Shorts',
  'Ürün ve Mekan Çekimleri',
  'Turizm & Otel Filmleri',
  'Kampanya ve Lansman İçerikleri',
  'AI Görsel Prodüksiyon',
  'AI Video Prodüksiyon',
  'Genel Bilgi',
];

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
};

export function KreatifProduksiyonLandingView() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showreelIndex, setShowreelIndex] = useState(0);
  const [isShortsPaused, setIsShortsPaused] = useState(false);
  const [isShortsHovered, setIsShortsHovered] = useState(false);
  const [openedShorts, setOpenedShorts] = useState<Set<string>>(new Set());

  const currentShowreel = SHOWREEL_VIDEOS[showreelIndex];
  const goShowreelPrev = () => setShowreelIndex((i) => (i === 0 ? SHOWREEL_VIDEOS.length - 1 : i - 1));
  const goShowreelNext = () => setShowreelIndex((i) => (i === SHOWREEL_VIDEOS.length - 1 ? 0 : i + 1));

  const onChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/sendmail.php' : '/api/contact';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, topic: form.topic || 'Kreatif Prodüksiyon / Reklam Filmi' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        setIsSubmitting(false);
        return;
      }
      setForm(INITIAL_STATE);
      setTimeout(() => router.push('/thankyou'), 500);
    } catch {
      setFeedback('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative min-h-0 overflow-hidden border-b border-white/10 bg-zinc-950 px-6 py-12 md:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_20%,rgba(255,255,255,0.04),_transparent_50%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-center">
          <div className="space-y-8 lg:space-y-10">
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-6xl">
              Markanız için sadece içerik değil, etki üreten prodüksiyon.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
              Reklam filmi, kısa video ve kampanya içeriğini tek yapıda kurgulayın. Fikri, görüntüyü ve duyguyu satışa dönüştüren kreatif prodüksiyon.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#form"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-950 transition-all hover:bg-white/92 hover:shadow-xl hover:shadow-white/5"
              >
                Proje Konuşalım
              </Link>
              <Link
                href="#form"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Teklif Al
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/70">
              <span>Kampanya odaklı üretim</span>
              <span>Çoklu format teslim</span>
              <span>AI destekli hız</span>
            </div>
          </div>
          <div className="relative lg:flex lg:justify-end">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl lg:aspect-[4/3] lg:max-w-[540px]">
              <Image
                src="/reklam_kreatif_produksiyon/creative_hero.webp"
                alt="Kreatif prodüksiyon"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 540px"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </section>

      <ReferanslarSection />

      {/* SHOWREEL SLIDER */}
      <section className="border-b border-white/10 bg-zinc-900/40 px-6 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            Showreel | Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-white/80">
            Reklam filmi, dijital içerik ve kampanya prodüksiyonlarından örnek işler.
          </p>
          <div className="relative mt-10">
            <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/5">
              <iframe
                key={currentShowreel.id + (currentShowreel.start ?? 0)}
                title={`Showreel ${showreelIndex + 1}`}
                src={`https://www.youtube.com/embed/${currentShowreel.id}?rel=0${currentShowreel.start != null ? `&start=${currentShowreel.start}` : ''}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <button
              type="button"
              onClick={goShowreelPrev}
              aria-label="Önceki video"
              className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 -translate-x-2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/95 text-white shadow-lg transition-colors hover:border-white/40 hover:bg-white/10 md:-translate-x-4 md:h-14 md:w-14"
            >
              <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={goShowreelNext}
              aria-label="Sonraki video"
              className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/95 text-white shadow-lg transition-colors hover:border-white/40 hover:bg-white/10 md:translate-x-4 md:h-14 md:w-14"
            >
              <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="mt-6 flex justify-center gap-2">
              {SHOWREEL_VIDEOS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setShowreelIndex(i)}
                  aria-label={`Video ${i + 1}`}
                  className={`h-2 rounded-full transition-all md:h-2.5 ${
                    i === showreelIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60 md:w-2.5'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-sm text-white/60">
              {showreelIndex + 1} / {SHOWREEL_VIDEOS.length}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM */}
      <section className="border-b border-white/10 bg-zinc-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Markaların prodüksiyonda yaşadığı gerçek sorunlar
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            İçerik üretiyorsunuz ama etki ve dönüşüm hedeflerine ulaşmıyorsanız, sorun sadece çekim değil.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[160px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=85"
                alt="Prodüksiyon ve içerik stratejisi"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Doğru strateji olmadan içerik hedefe ulaşmaz.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Estetik ama etkisiz içerik', desc: 'İçeriklerimiz estetik açıdan güçlüydü ama kampanyaya ve markaya gerçek bir katkı sağlamadı.', img: '/reklam_kreatif_produksiyon/estekik_ama_etkisiz_icerik.webp' },
              { title: 'Kopuk kampanya ve sosyal medya', desc: 'Kampanya filmimizle sosyal medya içeriklerimiz birbirinden kopuk ilerledi ve bütünlüklü bir etki yaratmadı.', img: '/reklam_kreatif_produksiyon/kopuk_kampanya_ve_sosyal_medya.webp' },
              { title: 'Pahalı çekim, verimsiz çıktı', desc: 'Yüksek prodüksiyon bütçesi ayırdık ama içeriklerden beklediğimiz verimi alamadık.', img: '/reklam_kreatif_produksiyon/pahali_cekim_verimsiz_cikti_tr.webp' },
              { title: 'Kısa video ihtiyacı sürekli büyüyor', desc: 'Kısa video ihtiyacımız sürekli arttı ama üretim hızımız bu talebe yetişemedi.', img: '/reklam_kreatif_produksiyon/kisa_video_icerik.webp' },
              { title: 'Marka dili ile görsel dil uyuşmuyor', desc: 'Ürettiğimiz içerikler görsel olarak güçlüydü ama marka dilimizle tam olarak örtüşmedi.', img: '/reklam_kreatif_produksiyon/marka_dili_gorsel_dil.webp' },
              { title: 'Ağır ve yavaş süreç', desc: 'Prodüksiyon sürecimiz ağır ilerlediği için kampanya ihtiyaçlarına hızlı yanıt veremedik.', img: '/reklam_kreatif_produksiyon/agir_yavas_surec.webp' },
            ].map((item, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="relative aspect-square w-full">
                  <Image src={item.img} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[1.31rem] font-semibold uppercase tracking-[0.2em] text-teal-400">Join Creative</p>
          <h2 className="mt-2 text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Tek çatıda prodüksiyon hizmetleri
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Reklam filminden kısa videoya, ürün çekiminden AI destekli üretime kadar kampanyanıza hizmet eden tüm formatlar.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[160px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=85"
                alt="Prodüksiyon hizmetleri"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Reklam filmi, dijital içerik ve kampanya prodüksiyonu.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Reklam Filmi Prodüksiyonu', desc: 'Marka filmi, TV ve dijital reklam. Sinematik dil, kampanya hedefine uygun kurgu.' },
              { title: 'Dijital İçerik Üretimi', desc: 'Web, sosyal medya ve kampanya için özel içerik. Tek brief, çoklu kullanım.' },
              { title: 'Kısa Video / Reels / Shorts', desc: 'Platforma özel formatlar. Dikkat çeken, paylaşılabilir kısa form içerik.' },
              { title: 'Ürün ve Mekan Çekimleri', desc: 'Ürün tanıtımı, mekan ve atmosfer. E-ticaret ve marka sayfaları için görsel.' },
              { title: 'Turizm & Otel Filmleri', desc: 'Destinasyon ve otel tanıtım filmleri. Duygu ve deneyimi görselleştiren prodüksiyon.' },
              { title: 'Kampanya ve Lansman İçerikleri', desc: 'Yeni ürün, koleksiyon ve lansman. Stratejik mesaj + güçlü görsel anlatı.' },
              { title: 'AI Görsel Prodüksiyon', desc: 'Hızlı, ölçeklenebilir görsel üretimi. Kampanya varyasyonları ve test içerikleri.' },
              { title: 'AI Video Prodüksiyon', desc: 'Kısa sürede video çıktı. Sosyal medya ve reklam için AI destekli üretim.' },
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

      {/* 4. PROCESS */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Süreç nasıl işler?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg text-white/90">
            Net adımlar, şeffaf ilerleme, teslim odaklı çalışma.
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
              <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white/90 md:left-8 md:right-auto md:max-w-md">Brief&apos;ten teslime şeffaf ve adım adım.</p>
            </div>
          </div>
          <div className="mt-16 space-y-0">
            {[
              { step: 1, title: 'Brief ve marka analizi', desc: 'Hedef, hedef kitle ve kampanya çerçevesi netleştirilir. Marka dili ve rakipler değerlendirilir.' },
              { step: 2, title: 'Kreatif konsept geliştirme', desc: 'Fikir, görsel dil ve mesaj stratejisi oluşturulur. Onay sonrası prodüksiyon planına geçilir.' },
              { step: 3, title: 'Prodüksiyon planlama', desc: 'Çekim takvimi, lokasyon, ekip ve format planı. Tek seferde çoklu kullanım için shot list.' },
              { step: 4, title: 'Çekim / üretim / post-prodüksiyon', desc: 'Çekim günü koordinasyonu, kurgu, renk ve ses. Reklam ve sosyal medya versiyonları.' },
              { step: 5, title: 'Final teslim ve çoklu format uyarlama', desc: 'Tüm formatlarda teslim: reklam filmi, reels, shorts, web. Kullanım hakları ve arşiv.' },
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

      {/* 5. REFERANSLAR - Shorts Videolar */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="mx-auto max-w-5xl space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
              Referanslar
            </h2>
            <p className="mx-auto max-w-4xl text-base text-white/85 md:max-w-5xl md:text-lg leading-relaxed lg:max-w-[60rem]">
              Dijital dünyanın benimsediği dikey formatı merkezimize alıyor, markalar için ekrana en uygun biçimde tasarlanmış etkili dikey video içerikleri üretiyoruz. Üretimden kreatife, kurgudan yayına kadar tüm süreçlerde dikey dünyanın dinamiklerine hâkim, yenilikçi çözümler sunuyoruz.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-zinc-900 via-zinc-900/70 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-zinc-900 via-zinc-900/70 to-transparent" />
            <div
              className="flex min-w-max gap-4 animate-marquee cursor-pointer"
              style={{ animationPlayState: (isShortsPaused || isShortsHovered) ? 'paused' : 'running' }}
              onClick={() => setIsShortsPaused(!isShortsPaused)}
              onMouseEnter={() => setIsShortsHovered(true)}
              onMouseLeave={() => setIsShortsHovered(false)}
            >
              {[...SHORTS_ITEMS, ...SHORTS_ITEMS].map((item, index) => {
                const uniqueKey = `${item.videoId}-${index}`;
                const isOpened = openedShorts.has(uniqueKey);
                return (
                  <div
                    key={uniqueKey}
                    className="group relative flex w-[180px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-lg shadow-black/40 transition-transform hover:-translate-y-1 hover:border-teal-500/40"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.videoId) {
                        setOpenedShorts((prev) => {
                          const newSet = new Set(prev);
                          if (isOpened) newSet.delete(uniqueKey);
                          else newSet.add(uniqueKey);
                          return newSet;
                        });
                      }
                    }}
                  >
                    {item.videoId ? (
                      <div className="relative w-full pt-[177.78%]">
                        {isOpened ? (
                          <iframe
                            className="absolute inset-0 h-full w-full"
                            src={`https://www.youtube.com/embed/${item.videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&controls=1&autoplay=1`}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        ) : (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`}
                              alt={item.title}
                              className="absolute inset-0 h-full w-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                                <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                            <div className="absolute inset-x-0 top-0 p-3">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-white drop-shadow-md">j@inpr</span>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 py-4">
                              <p className="line-clamp-2 text-center text-xs font-medium leading-snug text-white drop-shadow-md">{item.title}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full pt-[177.78%]">
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
                          <span className="text-4xl">🎬</span>
                          <p className="text-xs text-zinc-400">{item.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Sıkça sorulan sorular
          </h2>
          <div className="mt-16 space-y-4">
            {[
              { q: 'Hangi markalar için uygun?', a: 'Turizm, otel, havacılık, restoran, lifestyle, beauty, wellness ve premium tüketim markaları ile kurumsal firmalar. Reklam filmi ve dijital içerik ihtiyacı olan her marka için uygundur.' },
              { q: 'Sadece reklam filmi mi üretiliyor?', a: 'Hayır. Reklam filmi, kısa video, reels/shorts, ürün ve mekan çekimleri, kampanya ve lansman içerikleri ile AI destekli görsel ve video prodüksiyon sunuyoruz.' },
              { q: 'Kısa video içerikleri de hazırlanıyor mu?', a: 'Evet. Sosyal medya için platforma özel kısa video, reels ve shorts formatında içerik üretiyoruz. Tek çekimden birden fazla format çıkarılabilir.' },
              { q: 'AI destekli içerik üretimi nasıl çalışıyor?', a: 'Geleneksel prodüksiyonla birlikte AI araçları kullanarak hızlı varyasyon, test içerikleri ve ölçeklenebilir üretim sunuyoruz. Kalite ve marka diline uyum korunur.' },
              { q: 'Çekim ve post-prodüksiyon birlikte mi ilerliyor?', a: 'Evet. Konseptten final teslime kadar tek ekip. Çekim, kurgu, renk ve ses dahil tüm süreç koordineli yürütülür.' },
              { q: 'İçerikler reklam ve sosyal medya için ayrı formatlanabiliyor mu?', a: 'Evet. Aynı prodüksiyondan TV/dijital reklam, reels, shorts ve web formatları üretilir. Tek brief, çoklu teslim.' },
              { q: 'Turizm ve otel prodüksiyonlarında süreç nasıl işliyor?', a: 'Brief ve konsept onayından sonra lokasyon ve çekim planı çıkarılır. Destinasyon/otel filmi, oda ve atmosfer çekimleri, lansman içerikleri tek proje çatısında üretilir.' },
              { q: 'Tek seferlik proje dışında sürekli içerik üretimi mümkün mü?', a: 'Evet. Hem tek seferlik kampanya hem de dönemsel veya sürekli içerik üretimi için çalışıyoruz. İhtiyaca göre paket ve retainer modeli sunulabilir.' },
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

      {/* 7. FINAL CTA */}
      <section className="relative border-b border-white/10 bg-zinc-950 px-6 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(20,184,166,0.12),_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="whitespace-nowrap text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Markanız için iz bırakan içerikler üretin
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Proje konuşalım veya teklif alın. Aşağıdaki formu doldurmanız yeterli.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-950 transition-all hover:bg-white/90 hover:shadow-lg"
            >
              Proje Konuşalım
            </Link>
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CONTACT / LEAD FORM */}
      <section id="form" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            İletişim formu
          </h2>
          <p className="mt-3 text-center text-white/90">
            Proje veya teklif için bilgilerinizi bırakın.
          </p>
          <div
            className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-4 md:p-6"
          >
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

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
      />
    </div>
  );
}
