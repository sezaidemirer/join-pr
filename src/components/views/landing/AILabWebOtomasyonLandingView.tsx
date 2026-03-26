'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import Link from 'next/link';

const SEKTOREL_SLIDES = [
  { src: '/reklam_sosyal_medya/trafel_join_pr-07864a11-d44d-453b-9843-f3629a6f33c3.webp', label: 'Turizm & Seyahat' },
  { src: '/reklam_sosyal_medya/luxury_join_pr-7ff2ec58-e42e-41bf-b08f-0f567160a7fc.webp', label: 'Otelcilik' },
  { src: '/reklam_sosyal_medya/fly_join_pr-41030733-95b8-4722-bef9-f1aa02157f55.webp', label: 'Acenteler' },
  { src: '/reklam_sosyal_medya/beauty_wellness_join_pr-26b0b4c3-d13c-45cc-9d5a-dae701e74d11.webp', label: 'Klinikler' },
  { src: '/reklam_sosyal_medya/premium_product_join_pr-8913c24a-bcfc-4258-a437-44f80e44ccf7.webp', label: 'E-ticaret' },
  { src: '/reklam_sosyal_medya/kurumsal_sirket_join_pr-8e6c5e79-bb8e-4a8d-9f5e-bd0dc67e52ca.webp', label: 'Kurumsal' },
  { src: '/reklam_sosyal_medya/life_style_join_pr-226029c5-91b5-4df1-9b77-f1fc6c808388.webp', label: 'Lifestyle' },
];
const SEKTOREL_SLIDER_INTERVAL = 4500;

const COZUM_SECIMI = [
  'Web Tasarım & Geliştirme',
  'UI/UX Tasarımı',
  'Chatbot Geliştirme',
  'AI Agent Çözümleri',
  'CRM Entegrasyonları',
  'API & Webhook Entegrasyonları',
  'Otomasyon Akışları',
  'Form / Teklif / Satış Süreci Dijitalleştirme',
  'Veri Akışı ve Operasyon Sistemi',
  'Genel Bilgi',
];

export function AILabWebOtomasyonLandingView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sektorelSlideIndex, setSektorelSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSektorelSlideIndex((prev) => (prev + 1) % SEKTOREL_SLIDES.length);
    }, SEKTOREL_SLIDER_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 px-6 py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_40%,rgba(20,184,166,0.08),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20 lg:items-center">
            <div className="space-y-8 lg:space-y-10">
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-[3rem] xl:text-6xl">
                Web sitenizi vitrin olmaktan çıkarın, çalışan bir sisteme dönüştürün.
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
                Chatbot, otomasyon ve veri akışlarını tek dijital yapıda birleştirin. AI destekli altyapılarla satış, destek ve operasyon süreçlerini hızlandırın.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#form"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-950 transition-all hover:bg-white/92 hover:shadow-xl hover:shadow-white/5"
                >
                  Proje Konuşalım
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  Web + CRM + Chatbot
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  Otomasyon akışları
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  Veri entegrasyonu
                </span>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[540px]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-zinc-800 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                  <Image
                    src="/rekalm_ai_web_banner.webp"
                    alt="Dijital altyapı ve otomasyon"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 540px"
                    unoptimized
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-zinc-950/80 px-5 py-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Web · Chatbot · CRM · Otomasyon</span>
                      <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40">
                        <span className="h-1 w-1 rounded-full bg-white" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                    <p className="text-lg font-bold text-teal-400 md:text-xl">Veri</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60">Akış</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                    <p className="text-lg font-bold text-teal-400 md:text-xl">AI</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60">Chatbot</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                    <p className="text-lg font-bold text-teal-400 md:text-xl">CRM</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60">Entegre</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReferanslarSection />

      {/* 2. PROBLEM */}
      <section className="border-b border-white/10 bg-zinc-950 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Dijitalde sık yaşanan sorunlar
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Web ve operasyon ayrı gidiyorsa, verimlilik ve lead kalitesi düşer.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[160px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85"
                alt="Süreç ve veri"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Dağınık araçlar yerine çalışan sistem.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Web var, lead akışı zayıf', desc: 'Site güzel ama formlar takip edilmiyor veya doğru yere akmıyor.' },
              { title: 'Formlar ekip içinde kayboluyor', desc: 'Veri mail veya tabloda kalıyor; CRM veya görev sistemine düşmüyor.' },
              { title: 'CRM ile web konuşmuyor', desc: 'Lead web’den geliyor ama CRM’e manuel giriliyor. Gecikme ve hata artıyor.' },
              { title: 'Müşteri soruları manuel', desc: 'Aynı sorular tekrar tekrar cevaplanıyor. Chatbot veya otomatik yanıt yok.' },
              { title: 'Teklif ve takip dağınık', desc: 'Teklif, takip ve destek süreçleri farklı kanallarda; bütünlük yok.' },
              { title: 'Veriler parçalı', desc: 'Veriler farklı araçlarda. Tek bir akış ve raporlama zor.' },
              { title: 'Operasyon büyüdükçe yük artıyor', desc: 'Ekip büyümeden kapasite artmıyor. Otomasyon eksik.' },
              { title: 'Dijital görünüm, sistem yok', desc: 'Şirket dijital ama arka planda iş akışı ve entegrasyon yok.' },
            ].map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Çalışan dijital altyapı hizmetleri
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Web, chatbot, CRM ve otomasyon tek yapıda kurgulanır.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[140px] bg-zinc-900">
              <Image
                src="/reklam_ai_banner_3.webp"
                alt="Sistem ve entegrasyon"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Web · Chatbot · CRM · Otomasyon</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Web Tasarım & Geliştirme', desc: 'Satış ve lead odaklı, mobil uyumlu kurumsal ve e-ticaret web yapıları.' },
              { title: 'UI/UX Tasarımı', desc: 'Kullanıcı deneyimi ve dönüşüm odaklı arayüz. Net akış, az sürtünme.' },
              { title: 'Chatbot Geliştirme', desc: 'Müşteri iletişimi ve ilk temas. Soru-cevap, yönlendirme ve randevu akışları.' },
              { title: 'AI Agent Çözümleri', desc: 'Yapay zeka destekli yanıt ve yönlendirme. Satış ve destek süreçlerine entegrasyon.' },
              { title: 'CRM Entegrasyonları', desc: 'Web, form ve chatbot verisinin CRM’e otomatik akışı. Lead ve görev oluşturma.' },
              { title: 'API & Webhook Entegrasyonları', desc: 'Araçlar arası veri akışı. n8n, webhook ve API tabanlı bağlantılar.' },
              { title: 'Otomasyon Akışları', desc: 'Tekrarlayan işlerin otomasyonu. Form → CRM → bildirim → takip akışları.' },
              { title: 'Form / Teklif / Satış Süreci Dijitalleştirme', desc: 'Teklif, onay ve takip süreçlerinin dijital akışı.' },
              { title: 'Veri Akışı ve Operasyon Sistemi', desc: 'Veri toplama, yönlendirme ve raporlama. Operasyonel verimlilik.' },
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
            Neden bu yapı çalışır?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Sadece tasarım değil, işleyen dijital sistem kurulur.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[140px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85"
                alt="Ekip ve sistem"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/30 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Web + CRM + chatbot + veri tek yapıda.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Sadece tasarım değil sistem', desc: 'Görsel ve iş akışı birlikte düşünülür. Lead ve veri doğru yere akar.' },
              { title: 'Tekrarlayan işler otomatik', desc: 'Form, bildirim ve takip akışları otomasyonla hızlanır.' },
              { title: 'Web + CRM + chatbot entegre', desc: 'Tüm kanallar aynı veri ve süreç mantığında çalışır.' },
              { title: 'Daha hızlı müşteri dönüşü', desc: 'Chatbot ve otomatik yönlendirme ile yanıt süresi kısalır.' },
              { title: 'Operasyonel hata azalır', desc: 'Manuel aktarım azalır; veri tek kaynaktan akar.' },
              { title: 'Ekip verimliliği artar', desc: 'Rutin işler otomasyonda; ekip stratejik işlere odaklanır.' },
              { title: 'Ölçeklenebilir altyapı', desc: 'İhtiyaç büyüdükçe yeni modül ve akış eklenebilir.' },
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
            Hangi ihtiyaçlar için?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Lead, randevu, satış ve operasyon odaklı kullanım senaryoları.
          </p>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Web’den kaliteli lead toplama',
              'Chatbot ile ilk temas ve soru yanıtlama',
              'Form verilerini CRM’e otomatik aktarma',
              'Satış ekibine otomatik görev açma',
              'Teklif süreçlerini dijitalleştirme',
              'Randevu / rezervasyon / başvuru akışları',
              'Müşteri destek taleplerini yönlendirme',
              'Operasyonel işleri otomasyonla azaltma',
            ].map((label, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SEKTÖREL ODAK */}
      <section className="border-b border-white/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Sektörel odak
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/90">
            Bu sektörlerde dijital altyapı ve otomasyon için güçlü bir partneriz.
          </p>
          <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[200px] bg-zinc-900">
              {SEKTOREL_SLIDES.map((slide, i) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === sektorelSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  aria-hidden={i !== sektorelSlideIndex}
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
              onClick={() => setSektorelSlideIndex((prev) => (prev - 1 + SEKTOREL_SLIDES.length) % SEKTOREL_SLIDES.length)}
              aria-label="Önceki"
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white transition-colors hover:border-white/40 hover:bg-white/10 md:left-4 md:h-12 md:w-12"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setSektorelSlideIndex((prev) => (prev + 1) % SEKTOREL_SLIDES.length)}
              aria-label="Sonraki"
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white transition-colors hover:border-white/40 hover:bg-white/10 md:right-4 md:h-12 md:w-12"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {SEKTOREL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSektorelSlideIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-colors md:h-2 md:w-2 ${i === sektorelSlideIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROCESS */}
      <section className="border-b border-white/10 bg-zinc-900/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Süreç nasıl işler?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg text-white/90">
            İhtiyaçtan yayına ve iyileştirmeye net adımlar.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[160px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&q=85"
                alt="Süreç"
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/40 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90">Analiz → Tasarım → Geliştirme → Entegrasyon → İyileştirme</p>
            </div>
          </div>
          <div className="mt-16 space-y-0">
            {[
              { step: 1, title: 'İhtiyaç ve süreç analizi', desc: 'Mevcut süreçler, veri akışı ve hedefler netleştirilir. Web, CRM ve otomasyon ihtiyacı haritalanır.' },
              { step: 2, title: 'Dijital yapı ve akış tasarımı', desc: 'Web yapısı, form akışları, chatbot senaryoları ve CRM/otomasyon kurgusu tasarlanır.' },
              { step: 3, title: 'Web / chatbot / entegrasyon geliştirme', desc: 'Web sitesi, chatbot ve API/webhook entegrasyonları geliştirilir.' },
              { step: 4, title: 'CRM ve otomasyon bağlantısı', desc: 'Form, chatbot ve diğer kaynaklardan gelen veri CRM ve otomasyon akışlarına bağlanır.' },
              { step: 5, title: 'Test, yayın ve iyileştirme', desc: 'Test sonrası canlıya alınır. Kullanım verisine göre iyileştirme önerileri sunulur.' },
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

      {/* 12. FAQ */}
      <section className="border-b border-white/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Sıkça sorulan sorular
          </h2>
          <div className="mt-16 space-y-4">
            {[
              { q: 'Hangi markalar için uygun?', a: 'Turizm, otel, acente, klinik, e-ticaret, kurumsal hizmet ve lifestyle markaları. Dijitalleşme ve operasyonel verimlilik hedefleyen her işletme için uygundur.' },
              { q: 'Sadece web sitesi mi yapılıyor?', a: 'Hayır. Web sitesi, chatbot, CRM entegrasyonu ve otomasyon akışları birlikte veya ayrı sunulabilir. İhtiyaca göre paket oluşturulur.' },
              { q: 'Chatbot sistemleri de dahil mi?', a: 'Evet. Chatbot geliştirme ve mevcut web/CRM ile entegrasyonu yapılır. Soru-cevap, yönlendirme ve randevu akışları kurgulanabilir.' },
              { q: 'CRM entegrasyonu yapılabiliyor mu?', a: 'Evet. Form, chatbot ve diğer kaynaklardan gelen veri CRM’e (Salesforce, HubSpot, özel CRM vb.) API veya webhook ile aktarılır.' },
              { q: 'Mevcut sistemlerle entegre çalışılabiliyor mu?', a: 'Evet. Mevcut web, CRM ve araçlara entegrasyon planlanır. API ve webhook ile bağlantı kurulur.' },
              { q: 'Otomasyon akışları nasıl planlanıyor?', a: 'İhtiyaç analizi sonrası form → CRM → bildirim → takip gibi akışlar tasarlanır. n8n, Zapier veya özel entegrasyon kullanılabilir.' },
              { q: 'Web sitesi satış ve lead toplama odaklı kurgulanabiliyor mu?', a: 'Evet. Sayfa yapısı, formlar ve CTA’lar dönüşüm odaklı tasarlanır. Veri CRM ve otomasyona bağlanır.' },
              { q: 'Sonradan geliştirme ve yeni modül ekleme mümkün mü?', a: 'Evet. Altyapı ölçeklenebilir kurgulanır. Yeni form, chatbot senaryosu veya entegrasyon ihtiyaca göre eklenebilir.' },
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

      {/* 13. FINAL CTA */}
      <section className="relative border-b border-white/10 bg-zinc-950 px-6 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(20,184,166,0.12),_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            Dijital altyapınızı çalışan bir sisteme dönüştürün
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Proje konuşalım veya keşif görüşmesi planlayın. Aşağıdaki formu doldurmanız yeterli.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-950 transition-all hover:bg-white/90 hover:shadow-lg"
            >
              Proje Konuşalım
            </Link>
          </div>
        </div>
      </section>

      {/* 14. CONTACT / LEAD FORM */}
      <section id="form" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            İletişim formu
          </h2>
          <p className="mt-3 text-center text-white/90">
            Proje veya keşif görüşmesi için bilgilerinizi bırakın.
          </p>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-4 md:p-6">
            <iframe
              aria-label="Join-Form-Landing"
              frameBorder="0"
              style={{ height: 500, width: '99%', border: 'none' }}
              src="https://forms.joinpr.com.tr/joinus1/form/JoinFormLanding/formperma/I50RnMGr5e2CLfOswetbEV7jdQ_N9gkidjRZUcvnfl0"
              title="Join CRM Form"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
