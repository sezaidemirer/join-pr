'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import { FormConsentEmbed } from '@/components/FormConsentEmbed';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Video ID'yi buradan değiştirebilirsiniz (YouTube: watch?v=XXXXX içindeki XXXXX)
const EXPLAINER_VIDEO_ID = 'al-D_BC5cYc';

const HIZMET_SECIMI = [
  'Influencer Marketing',
  'Celebrity Marketing',
  'Dijital PR',
  'Medya İlişkileri',
  'Etkinlik ve Proje Yönetimi',
  'Sponsorluk İletişimi',
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

const SEKTOREL_SLIDES = [
  { src: '/reklam_pr_gorunurluk/trafel.webp', alt: 'Turizm' },
  { src: '/reklam_pr_gorunurluk/premium_product.webp', alt: 'Premium tüketim' },
  { src: '/reklam_pr_gorunurluk/beauty_wellness.webp', alt: 'Beauty / Wellness' },
  { src: '/reklam_pr_gorunurluk/fly.webp', alt: 'Havacılık' },
  { src: '/reklam_pr_gorunurluk/luxury.webp', alt: 'Lüks otel' },
  { src: '/reklam_pr_gorunurluk/lifestyle.webp', alt: 'Lifestyle' },
];

const HERO_VIMEO_SLIDES = [
  { src: 'https://player.vimeo.com/video/1178977111?h=aa2a010373', label: 'Video 2' },
  { src: 'https://player.vimeo.com/video/1178978221?h=3113924713', label: 'Video 3' },
  { src: 'https://player.vimeo.com/video/1178965341?h=300176222e', label: 'Video 2' },
  { src: 'https://player.vimeo.com/video/1178988925?h=015a087f4d', label: 'Video 4' },
  { src: 'https://player.vimeo.com/video/1178986645?h=40914c0539', label: 'Video 5' },
  { src: 'https://player.vimeo.com/video/1178990184?h=94b24a315c', label: 'Video 6' },
  { src: 'https://player.vimeo.com/video/1178945644?h=c52d587b62', label: 'Video 7' },
  { src: 'https://player.vimeo.com/video/1178953638?h=6be6c37736', label: 'Video 8' },
];

const RIXOS_VIMEO_SLIDES = [
  { src: 'https://player.vimeo.com/video/1178950703?h=da2b7a11bf', label: 'Dilara Özkan' },
  { src: 'https://player.vimeo.com/video/1178963266?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Valentina Raso' },
  { src: 'https://player.vimeo.com/video/1178967733?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Diego Fusina' },
  { src: 'https://player.vimeo.com/video/1178959730?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Pelin Akil Altan' },
  { src: 'https://player.vimeo.com/video/1178957436?h=2be209e53e', label: 'Şeyma Büşra Gözdamga' },
  { src: 'https://player.vimeo.com/video/1178965088?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Gizem Güneş' },
];

const PRESS_REPORT_SLIDES = [
  {
    src: '/basin_yansima_1.png',
    alt: 'Basın yansıma raporu 1',
  },
  {
    src: '/Basin_yansima_2.png',
    alt: 'Basın yansıma raporu 2',
  },
  {
    src: '/basin_yansima_3.png',
    alt: 'Basın yansıma raporu 3',
  },
];

export function PRGorunurlukLandingView() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sektorelSlide, setSektorelSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [rixosSlide, setRixosSlide] = useState(0);
  const [pressReportSlide, setPressReportSlide] = useState(0);
  const heroTouchStartX = useRef<number | null>(null);
  const rixosTouchStartX = useRef<number | null>(null);
  const pressTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSektorelSlide((i) => (i + 1) % SEKTOREL_SLIDES.length);
    }, 4500);
    return () => clearInterval(t);
  }, [SEKTOREL_SLIDES.length]);

  const goPrevRixosSlide = () => {
    setRixosSlide((i) => (i - 1 + RIXOS_VIMEO_SLIDES.length) % RIXOS_VIMEO_SLIDES.length);
  };

  const goNextRixosSlide = () => {
    setRixosSlide((i) => (i + 1) % RIXOS_VIMEO_SLIDES.length);
  };

  const onRixosTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    rixosTouchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onRixosTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (rixosTouchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const deltaX = endX - rixosTouchStartX.current;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX > 0) goPrevRixosSlide();
    else goNextRixosSlide();
    rixosTouchStartX.current = null;
  };

  const goPrevPressReportSlide = () => {
    setPressReportSlide((i) => (i - 1 + PRESS_REPORT_SLIDES.length) % PRESS_REPORT_SLIDES.length);
  };

  const goNextPressReportSlide = () => {
    setPressReportSlide((i) => (i + 1) % PRESS_REPORT_SLIDES.length);
  };

  const onPressTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    pressTouchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onPressTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pressTouchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const deltaX = endX - pressTouchStartX.current;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX > 0) goPrevPressReportSlide();
    else goNextPressReportSlide();
    pressTouchStartX.current = null;
  };

  const goPrevHeroSlide = () => {
    setHeroSlide((i) => (i - 1 + HERO_VIMEO_SLIDES.length) % HERO_VIMEO_SLIDES.length);
  };

  const goNextHeroSlide = () => {
    setHeroSlide((i) => (i + 1) % HERO_VIMEO_SLIDES.length);
  };

  const onHeroTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    heroTouchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onHeroTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (heroTouchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const deltaX = endX - heroTouchStartX.current;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX > 0) goPrevHeroSlide();
    else goNextHeroSlide();
    heroTouchStartX.current = null;
  };

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
        body: JSON.stringify({ ...form, topic: form.topic || 'PR / Influencer / Celebrity Marketing' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        setIsSubmitting(false);
        return;
      }
      setForm(INITIAL_STATE);
      setTimeout(() => router.push('/tesekkurler'), 500);
    } catch {
      setFeedback('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 px-6 py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.12),_transparent_50%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="space-y-8">
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-[2.75rem]">
              Influencer ve Celebrity Marketing ile markanızı dünyaya tanıtın
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white">
              Hedef kitlenize ses getiren iş birlikleriyle ulaşın, markanızın bilinirliğini artırın ve satışa dönüşebilecek güçlü bir etki yaratın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#form"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-teal-500/25 transition-all hover:opacity-95 hover:shadow-teal-500/30"
              >
                Teklif Al
              </Link>
            </div>
          </div>
          <div
            className="relative mx-auto aspect-[9/16] w-[63%] overflow-hidden rounded-2xl border border-white/10 bg-black"
            onTouchStart={onHeroTouchStart}
            onTouchEnd={onHeroTouchEnd}
          >
            <iframe
              src={`${HERO_VIMEO_SLIDES[heroSlide].src}${HERO_VIMEO_SLIDES[heroSlide].src.includes('?') ? '&' : '?'}title=0&byline=0&portrait=0&dnt=1`}
              className="h-full w-full"
              loading="eager"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              allowFullScreen
              title={HERO_VIMEO_SLIDES[heroSlide].label}
            />
            <button
              type="button"
              onClick={goPrevHeroSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
              aria-label="Önceki video"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNextHeroSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
              aria-label="Sonraki video"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {HERO_VIMEO_SLIDES.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setHeroSlide(i)}
                  aria-label={`${item.label} videosuna git`}
                  className={`h-2 rounded-full transition-all ${
                    i === heroSlide ? 'w-6 bg-teal-400' : 'w-2 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ReferanslarSection />

      {/* VIDEO: Nasıl çalışıyor? / Tanıtım */}
      <section className="border-b border-white/10 bg-zinc-900/30 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Join Pr | Deneyimi Stratejiye Dönüştürür
          </h2>
          <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
            {EXPLAINER_VIDEO_ID ? (
              <iframe
                title="Join PR tanıtım"
                src={`https://www.youtube.com/embed/${EXPLAINER_VIDEO_ID}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-teal-950/40 to-zinc-900 text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/5">
                  <svg className="h-10 w-10 text-teal-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-lg font-medium">Tanıtım videomuz yakında</p>
                <p className="max-w-sm text-center text-sm text-white/80">YouTube veya Vimeo linkinizi EXPLAINER_VIDEO_ID ile ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM */}
      <section className="border-b border-white/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Markaların yaşadığı gerçek problemler
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Yanlış influencer seçimi',
              'Ölçümsüz kampanyalar',
              'Tek kanal odaklılık',
            ].map((title, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition-colors hover:border-teal-500/20 hover:bg-white/[0.07]"
              >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="mx-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white px-6 py-10 md:py-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
              Join Pr Yaklaşımı
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-700 md:text-xl">
              Global celebrity ve geniş influencer ağımızı; doğru eşleşme, stratejik planlama, proje yönetimi ve raporlama süreçleriyle markalar için etkili kampanyalara dönüştürüyoruz.
            </p>
            <Link
              href="https://joinpr.com.tr/is-birliklerimiz/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              İş Birlikleri ve Meta raporları için tıklayınız
            </Link>
            <div className="mt-5 space-y-2 text-sm font-medium text-zinc-700 md:text-base">
              <Link
                href="https://joinpr.com.tr/hizmetlerimiz/kurumsal-iletisim/"
                className="block rounded-lg border border-zinc-300 px-3 py-2 transition-colors hover:bg-zinc-50"
              >
                Kurumsal İletişiim
              </Link>
              <Link
                href="https://joinpr.com.tr/hizmetlerimiz/marka-iletisimi/"
                className="block rounded-lg border border-zinc-300 px-3 py-2 transition-colors hover:bg-zinc-50"
              >
                Marka İletişimi
              </Link>
              <Link
                href="https://joinpr.com.tr/hizmetlerimiz/medya-iliskileri-yonetimi/"
                className="block rounded-lg border border-zinc-300 px-3 py-2 transition-colors hover:bg-zinc-50"
              >
                Medya İlişkileri Yönetimi
              </Link>
              <Link
                href="https://joinpr.com.tr/hizmetlerimiz/medya-iliskileri-yonetimi/"
                className="block rounded-lg border border-zinc-300 px-3 py-2 transition-colors hover:bg-zinc-50"
              >
                Etkinlik Ve Proje Yönetimi
              </Link>
            </div>
          </div>
          <div className="flex justify-center bg-transparent p-2">
            <div
              className="relative aspect-[9/16] w-[64%] overflow-hidden rounded-xl"
              onTouchStart={onRixosTouchStart}
              onTouchEnd={onRixosTouchEnd}
            >
              <iframe
                src={`${RIXOS_VIMEO_SLIDES[rixosSlide].src}&title=0&byline=0&portrait=0&dnt=1`}
                className="h-full w-full"
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                title={RIXOS_VIMEO_SLIDES[rixosSlide].label}
              />
              <button
                type="button"
                onClick={goPrevRixosSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
                aria-label="Önceki video"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNextRixosSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
                aria-label="Sonraki video"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {RIXOS_VIMEO_SLIDES.map((item, i) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setRixosSlide(i)}
                    aria-label={`${item.label} videosuna git`}
                    className={`h-2 rounded-full transition-all ${
                      i === rixosSlide ? 'w-6 bg-teal-400' : 'w-2 bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BASIN YANSIMA RAPORU */}
      <section className="border-b border-white/10 bg-zinc-950 px-6 py-14 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Örnek Basın Yansıma Raporu
          </h2>
          <div
            className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40"
            onTouchStart={onPressTouchStart}
            onTouchEnd={onPressTouchEnd}
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={PRESS_REPORT_SLIDES[pressReportSlide].src}
                alt={PRESS_REPORT_SLIDES[pressReportSlide].alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 900px"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={goPrevPressReportSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
              aria-label="Önceki görsel"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNextPressReportSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
              aria-label="Sonraki görsel"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {PRESS_REPORT_SLIDES.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setPressReportSlide(i)}
                  aria-label={`Görsel ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === pressReportSlide ? 'w-6 bg-teal-400' : 'w-2 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEKTÖREL ODAK */}
      <section className="border-b border-white/10 bg-white/[0.02] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Sektörel odak
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[180px] bg-zinc-900">
              {SEKTOREL_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === sektorelSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    unoptimized
                  />
                </div>
              ))}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-transparent pointer-events-none" />
              <p className="absolute bottom-10 left-4 right-4 text-center text-sm font-medium text-white/90 md:text-base z-20 pointer-events-none">Turizm, otel, havacılık, lifestyle, beauty ve premium markalar.</p>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-auto">
                {SEKTOREL_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSektorelSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === sektorelSlide ? 'w-6 bg-teal-400' : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {['Turizm', 'Otelcilik', 'Havacılık', 'Lifestyle', 'Beauty / Wellness', 'Premium tüketim markaları'].map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-teal-500/30 hover:bg-teal-500/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative border-b border-white/10 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 px-6 py-16 md:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Markanızı görünürlükten etkiye taşıyın
          </h2>
          <p className="mt-4 text-lg text-white">
            Teklif alın veya strateji görüşmesi planlayın. Aşağıdaki formu doldurmanız yeterli.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:opacity-95"
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </section>

      {/* 9. CONTACT / LEAD FORM */}
      <section id="form" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            İletişim formu
          </h2>
          <p className="mt-2 text-center text-white">
            Teklif veya strateji görüşmesi için bilgilerinizi bırakın.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-4 md:p-6">
            <FormConsentEmbed
              ariaLabel="Join-Form-Landing"
              src="https://forms.joinpr.com.tr/JoinPR/form/JoinFormLanding/formperma/I50RnMGr5e2CLfOswetbEV7jdQ_N9gkidjRZUcvnfl0"
              iframeHeight={500}
              trackGoogleAdsConversion
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
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
      />
    </div>
  );
}
