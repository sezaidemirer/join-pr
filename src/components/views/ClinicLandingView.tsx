'use client';

import { ReferanslarSection } from '@/components/ReferanslarSection';
import { FormConsentEmbed } from '@/components/FormConsentEmbed';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MonthlyIntelDashboard } from '../MonthlyIntelDashboard';

const BASE_PATH = '';

const PROBLEMS = [
  { text: 'Fiyat rekabeti yüzünden marj erimesi', impact: 94, icon: 'chart' },
  { text: 'Yanlış anahtar kelimelerde bütçe kaybı', impact: 87, icon: 'search' },
  { text: 'Dönemsel planlama olmadan reklam çıkılması', impact: 82, icon: 'calendar' },
  { text: "Meta'da kalitesiz lead", impact: 79, icon: 'users' },
  { text: 'Rakip bütçesini bilmeden strateji kurmak', impact: 91, icon: 'target' },
];

const SOLUTION_ITEMS = [
  {
    title: 'Tedavi / Hizmet Bazlı Arama Hakimiyeti',
    mainDesc: 'Rakiplerinizin hangi tedavilerden randevu aldığını ve hangi aramalarda öne çıktığını net bir şekilde görebilirsiniz.',
    keywords: ['estetik ameliyat fiyat', 'saç ekimi 2026', 'göz lazer tedavisi'],
    closing: 'Randevuya dönüşen aramalarda görünmeyen klinikler pazarı rakiplerine kaptırır.',
  },
  {
    title: 'AI Destekli Rakip Analizi',
    mainDesc: 'Rekabeti tahmin etmiyoruz; verilerle ölçüyoruz.',
    points: [
      'Rakiplerinizin tahmini reklam bütçesi',
      "Google'da en üst sırada görünme oranı",
      'Meta platformlarında görünürlük yoğunluğu',
      'Dönemsel bütçe değişim analizi',
    ],
    closing: 'Kimin ne kadar harcadığını bilmeden doğru strateji kurulamaz.',
  },
  {
    title: 'Randevu Odaklı Funnel Sistemi',
    mainDesc: 'Sadece tıklama değil, randevu odaklı bir sistem.',
    points: [
      'WhatsApp üzerinden dönüşüm takibi',
      'Offline randevu yükleme',
      'Akıllı retargeting',
      'Randevu kampanya otomasyonu',
    ],
    closing: 'Reklamlardan gelen her talep randevuya dönüştürülür.',
  },
];

const KPIS = [
  'Randevu başı kârlılık',
  'Tedavi bazlı talep dönüşümü',
  'Marka arama büyüme oranı',
  'Mutlak üst sıra hakimiyeti',
  'Lead → Randevu kapanış oranı',
];

export function ClinicLandingView() {
  const [howItWorksOpen, setHowItWorksOpen] = useState<number | null>(null);
  const [ctaNotify, setCtaNotify] = useState(false);

  return (
    <div className="flex flex-col gap-0">
      {/* Hero - Full width breakout */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden rounded-b-3xl border-b border-white/10 bg-gradient-to-br from-sky-950/70 via-blue-950/50 to-slate-900/80 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.2),_transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl xl:text-[2.75rem]">
            Rakipleriniz Hangi Tedavi Alanlarında Randevu Topluyor Biliyor musunuz?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300 md:text-xl">
            Reklam bütçenizi harcamadan önce, pazardaki gerçek görünürlüğünüzü ve kaybettiğiniz potansiyeli görün.
          </p>
          <Link
            href="#form"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-sky-400/40"
          >
            Rakip Analizimi Hemen Göster
          </Link>
        </div>
      </section>

      <ReferanslarSection />

      {/* Video */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/5">
            <iframe
              title="Klinik reklam ajansı"
              src="https://www.youtube.com/embed/TgYQ1sZ4YY8?rel=0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Problem - Büyük grafikli dashboard alanı */}
      <section className="relative mt-16 overflow-hidden rounded-3xl border border-sky-500/25 bg-gradient-to-br from-sky-950/30 via-zinc-950/90 to-zinc-950 p-8 shadow-2xl shadow-sky-950/20 md:p-12 lg:p-16 xl:p-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.1),_transparent_60%)]" />
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/5 blur-3xl" />

        <div className="mb-12 flex flex-col items-center gap-4 text-center lg:mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl xl:text-[2.75rem]">
            Kliniklerin %90&apos;ı Bu 5 Hatayı Yapıyor.
          </h2>
          <p className="max-w-2xl text-base text-zinc-400 md:text-lg">
            Bu hataları düzeltmeden yapılan her reklam harcaması bütçenizi zarara uğratır
          </p>
        </div>

        {/* Ana grafik alanı - 2 sütun */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          {/* Sol: Bar chart - Etki oranı grafiği */}
          <div className="rounded-2xl border border-sky-500/15 bg-zinc-900/50 p-6 backdrop-blur-sm md:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white md:text-xl">Etki Oranı (Firma Başına)</h3>
              <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-200">%</span>
            </div>
            <div className="space-y-5 md:space-y-6">
              {PROBLEMS.map((p, i) => (
                <div key={i} className="group">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-200 md:text-base lg:text-lg">{p.text}</span>
                    <span className="font-bold text-sky-300">{p.impact}%</span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-xl bg-zinc-800/80 md:h-10 lg:h-12">
                    <div
                      className="h-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-400 shadow-lg shadow-sky-500/30 transition-all duration-700 group-hover:from-sky-500 group-hover:to-sky-300"
                      style={{ width: `${p.impact}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: Donut / Dağılım grafiği */}
          <div className="rounded-2xl border border-sky-500/15 bg-zinc-900/50 p-6 backdrop-blur-sm md:p-8 lg:p-10">
            <h3 className="mb-6 text-lg font-semibold text-white md:text-xl">Problem Dağılımı</h3>
            <div className="relative mx-auto flex aspect-square max-w-[280px] items-center justify-center md:max-w-[340px]">
              <svg viewBox="0 0 100 100" className="w-full -rotate-90">
                {(() => {
                  const total = PROBLEMS.reduce((s, p) => s + p.impact, 0);
                  const circum = 2 * Math.PI * 45;
                  let offset = 0;
                  const colors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'];
                  return PROBLEMS.map((p, i) => {
                    const length = (p.impact / total) * circum;
                    const segment = (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={colors[i]}
                        strokeWidth="10"
                        strokeDasharray={`${length} ${circum}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    );
                    offset += length;
                    return segment;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white md:text-5xl">5</span>
                <span className="text-sm text-zinc-400">Problem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt mesaj - büyük */}
        <div className="mt-12 rounded-2xl border border-sky-500/25 bg-sky-950/40 px-8 py-6 text-center backdrop-blur-sm md:mt-16 md:px-10 md:py-8">
          <p className="text-xl font-semibold text-sky-200 md:text-2xl lg:text-3xl">
            &quot;Öne çıkmanın yolu daha fazla harcamak değil, rekabette doğru yerde durmaktır.&quot;
          </p>
        </div>
      </section>

      {/* Solution - Join PR System */}
      <section className="mt-16 space-y-10">
        <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
          Join PR Sistemi
        </h2>
        <p className="text-center text-lg text-zinc-400">Reklam Yönetimi Değil, Pazar Hakimiyeti</p>
        <div className="grid gap-8 md:grid-cols-3">
          {SOLUTION_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/30 to-zinc-950/70 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-lg font-bold text-sky-300">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              {item.keywords && (
                <div className="mt-4 space-y-2">
                  {item.mainDesc && <p className="text-sm text-zinc-300">{item.mainDesc}</p>}
                  {item.keywords.map((kw, j) => (
                    <p key={j} className="text-sm text-sky-200/90">
                      • &quot;{kw}&quot;
                    </p>
                  ))}
                  {item.closing && <p className="mt-3 text-sm font-medium text-sky-200">👉 {item.closing}</p>}
                </div>
              )}
              {item.points && (
                <div className="mt-4 space-y-2">
                  {item.mainDesc && <p className="text-sm text-zinc-300">{item.mainDesc}</p>}
                  <ul className="space-y-2">
                    {item.points.map((pt, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {item.closing && <p className="mt-3 text-sm font-medium text-sky-200">👉 {item.closing}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* KPI */}
      <section className="mt-16 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-950/20 to-zinc-950/80 p-8 md:p-12">
        <h2 className="mb-8 text-center text-xl font-bold text-white md:text-2xl">
          Klinikte Gerçek Büyümeyi Ölçtüğümüz Metrikler
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {KPIS.map((kpi, i) => (
            <span
              key={i}
              className="rounded-full border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-sm font-medium text-sky-200"
            >
              {kpi}
            </span>
          ))}
        </div>
      </section>

      {/* Strategic Message */}
      <section className="mt-16 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:p-12">
        <p className="text-center text-lg leading-relaxed text-zinc-200 md:text-xl">
          Klinikte büyüme, rastgele reklam harcayarak değil;
          <br className="hidden sm:block" /> doğru dönemde, doğru tedavi/hizmette, doğru rekabet konumlandırmasıyla sağlanır.
        </p>
        <p className="mt-4 text-center text-base font-semibold text-sky-300">
          Join PR, klinik markalarına büyüme altyapısı sunar.
        </p>
      </section>

      {/* Nasıl Çalışır - Rehber + Dashboardlar */}
      <section className="mt-16 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-sky-400 md:text-3xl lg:text-4xl">Nasıl Çalışır?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white md:text-xl">Klinik markaları için dijital talep, rekabet ve performans verilerini tek bir analiz modelinde birleştiriyoruz.</p>
        </div>

        {/* Nasıl Çalışır - Metinler solda, karakter sağda */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-sky-500/50 via-sky-400/30 to-transparent md:left-6" />
            <div className="space-y-0">
            {[
              { num: 1, title: 'Performans Dashboard', punch: 'Bütçe yönü netleşir.', accordion: ['Harcanan bütçe, randevu ve kârlılık birlikte değerlendirilir.', 'ROAS trendi (haftalık & ortalama)', 'Randevu başı maliyet', 'Kaçış oranı / verimsiz harcama', 'Ciro – Harcama dengesi'] },
              { num: 2, title: 'Rakip Analizi', punch: 'Pazardaki konumunuz ölçülür.', accordion: ['Google Ads ve Meta platformlarında rekabet görünürlüğü incelenir.', 'Google: Impression Share, Absolute Top Rate', 'Meta: Görünürlük yoğunluğu', 'Haftalık görünürlük değişimi', 'Rakip yoğunluk haritası'] },
              { num: 3, title: 'Aylık Klinik İstihbarat', punch: 'Doğru dönem, doğru tedavi/hizmet belirlenir.', accordion: ['Talep nerede yoğunlaşıyor, hangi ay hangi tedavi/hizmet öne çıkıyor analiz edilir.', 'Arama hacimleri ve trend değişimleri ölçülür', 'Dönemsel pik ve düşüşler belirlenir', 'Tedavi / hizmet bazlı talep ayrımı yapılır'] },
              { num: 4, title: 'AI Analiz Raporu', punch: 'Veri aksiyona dönüşür.', accordion: ['Tüm veriler tek bir stratejik özet haline getirilir.', 'Dijital konum skoru', 'Talep durumu', 'Rekabet baskısı', 'Risk & fırsat alanları', 'Net aksiyon önerisi'] },
              { num: 5, title: 'Case Sonucu', punch: 'Potansiyel büyüme somutlaşır.', accordion: ['Sistem uygulandığında oluşabilecek etki modeli gösterilir:', 'Görünürlük artışı', 'ROAS iyileşmesi', 'Bütçe verimliliği', 'Rekabet avantajı'] },
            ].map((item) => (
              <div key={item.num}>
                <button
                  type="button"
                  onClick={() => setHowItWorksOpen((k) => (k === item.num ? null : item.num))}
                  className="group relative flex w-full items-start gap-6 py-2 text-left md:gap-8 md:py-2.5"
                >
                  <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-zinc-950 text-sm font-bold transition-colors md:h-12 md:w-12 md:text-base ${howItWorksOpen === item.num ? 'border-sky-400 bg-sky-500/10 text-sky-300' : 'border-sky-400/50 text-sky-300 group-hover:border-sky-400 group-hover:bg-sky-500/10'}`}>
                    {item.num}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="text-lg font-semibold text-white md:text-xl">{item.title}</h3>
                    <p className="mt-1 text-base font-medium text-sky-200 md:text-lg">{item.punch}</p>
                    {item.accordion && (
                      <span className="mt-2 inline-block text-sm text-sky-400/80">
                        {howItWorksOpen === item.num ? '▲' : '▼'} detay
                      </span>
                    )}
                  </div>
                </button>
                {item.accordion && (
                  <div
                    className={`grid overflow-hidden transition-all duration-300 ease-out ${
                      howItWorksOpen === item.num ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 pl-[52px] pr-4 pb-6 md:pl-16 md:pb-8">
                      <ul className="space-y-2 rounded-lg border border-sky-500/20 bg-sky-950/20 px-4 py-3 text-sm text-zinc-300">
                        {item.accordion.map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-400" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <Image src="/turizm-karakter.webp" alt="Join PR Klinik" width={400} height={520} className="relative z-10 h-auto w-80 object-contain md:w-96 lg:w-[420px]" priority />
              <div className="absolute bottom-0 left-1/2 h-24 w-[140%] -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-sky-500/40 via-sky-400/20 to-transparent blur-xl md:h-32 md:w-[120%]" aria-hidden />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-sky-400 md:text-3xl">Örnek Marka Kontrol Paneli</h3>
          <p className="mx-auto mt-2 max-w-2xl text-base text-zinc-400 md:text-lg">Markanızın dijital konumunu, talep sinyallerini ve performansını tek merkezden yönetin.</p>
        </div>
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2">
        <DashboardMockup />
        <RakipChartMockup />
        <MonthlyIntelDashboard variant="clinic" />
        <AIRaporMockup />
        </div>
        {/* Case sonucu - Anonim gerçek veri */}
        <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-950/25 p-6 md:p-8">
          <h4 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-emerald-300">Case Sonucu (Anonim Veri)</h4>
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-around">
            <div>
              <p className="text-2xl font-bold text-white md:text-3xl">%31</p>
              <p className="text-xs text-zinc-400">Bütçe tasarrufu (3 ay)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white md:text-3xl">+%42</p>
              <p className="text-xs text-zinc-400">Google görünürlük artışı</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white md:text-3xl">2.33x</p>
              <p className="text-xs text-zinc-400">ROAS iyileşmesi</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm italic text-zinc-400">İstanbul merkezli estetik klinik · 2024 Q3 analizi</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-5 text-justify text-lg leading-relaxed text-white md:text-xl">
          <p>Klinik sektöründe sürdürülebilir büyüme, yalnızca reklam bütçesi harcamakla değil; talep analizi, rakip görünürlüğü ve performans metriklerinin birlikte yönetilmesiyle sağlanır.</p>
          <p>Join PR sistemi, arama hacimleri ve dönem trendlerinden Google Ads rekabet verilerine, ROAS ve randevu başı maliyete kadar tüm kritik verileri tek bir kontrol panelinde birleştirerek klinik markalarının dijital konumunu net şekilde ortaya koyar ve bütçeyi kârlı büyüme için optimize eder.</p>
        </div>
      </section>

      {/* CTA + Form */}
      <section className="mt-16 grid gap-10 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-blue-950/30 to-zinc-950 p-8 md:grid-cols-[1fr_1fr] md:p-12">
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            2026&apos;da Rakiplerinizin Gerisinde Kalmayın.
          </h2>
          <p className="text-sm text-white">
            AI destekli rekabet raporu ile rakip bütçelerini, Google görünürlüğünü ve randevu potansiyelinizi öğrenin.
          </p>
          <button
            type="button"
            onClick={() => {
              setCtaNotify(true);
              setTimeout(() => setCtaNotify(false), 4000);
            }}
            className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 hover:shadow-sky-400/40"
          >
            Ücretsiz Rekabet Analizimi Oluştur
          </button>
          {ctaNotify && (
            <p className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
              Lütfen aşağıdaki CRM formunu eksiksiz doldurun.
            </p>
          )}
        </div>

        <div id="form" className="space-y-4 rounded-2xl border border-white/15 bg-black/40 p-6">
          <h3 className="text-lg font-semibold text-white">Analiz Talep Formu</h3>
          <FormConsentEmbed
            ariaLabel="Join-Form-Landing"
            src="https://forms.joinpr.com.tr/JoinPR/form/JoinFormLanding/formperma/I50RnMGr5e2CLfOswetbEV7jdQ_N9gkidjRZUcvnfl0"
            iframeHeight={500}
            trackGoogleAdsConversion
          />
        </div>
      </section>
    </div>
  );
}

const DASHBOARD_WEEK_DATA: Record<
  number,
  { bars: number[]; harcama: string; ciro: string; rezervasyon: number; roas: string; cpa: string; cpaPercent: string; butceKacisi: string; verimsizHarcama: string }
> = {
  1: {
    bars: [68, 72, 70, 74],
    harcama: '80.688 TL',
    ciro: '205.754 TL',
    rezervasyon: 82,
    roas: '2.55x',
    cpa: '984 TL',
    cpaPercent: '—',
    butceKacisi: '%18',
    verimsizHarcama: '14.524 TL',
  },
  2: {
    bars: [74, 70, 68, 66],
    harcama: '89.760 TL',
    ciro: '215.424 TL',
    rezervasyon: 85,
    roas: '2.40x',
    cpa: '1.056 TL',
    cpaPercent: '↑ %7,3',
    butceKacisi: '%21',
    verimsizHarcama: '18.850 TL',
  },
  3: {
    bars: [66, 62, 58, 55],
    harcama: '98.136 TL',
    ciro: '220.806 TL',
    rezervasyon: 87,
    roas: '2.25x',
    cpa: '1.128 TL',
    cpaPercent: '↑ %14,6',
    butceKacisi: '%24',
    verimsizHarcama: '23.552 TL',
  },
  4: {
    bars: [82, 76, 68, 42],
    harcama: '106.800 TL',
    ciro: '224.280 TL',
    rezervasyon: 89,
    roas: '2.1x',
    cpa: '1.200 TL',
    cpaPercent: '↑ %22',
    butceKacisi: '%27',
    verimsizHarcama: '28.836 TL',
  },
};

function DashboardMockup() {
  const [selectedWeek, setSelectedWeek] = useState(4);
  const data = DASHBOARD_WEEK_DATA[selectedWeek];
  const bars = data.bars;

  return (
    <div className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-zinc-900/95 via-sky-950/30 to-zinc-950 p-6 shadow-2xl shadow-sky-950/30 transition-all duration-500 hover:border-sky-400/40 hover:shadow-sky-500/20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(56,189,248,0.12),_transparent_50%)]" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
            <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-white">Performans Dashboard</h4>
            <p className="text-xs text-zinc-500">Randevu & ROAS</p>
          </div>
        </div>
        <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-200">Canlı</span>
      </div>
      {/* Hafta seçici */}
      <div className="mb-3 flex gap-1 rounded-lg bg-white/5 p-1">
        {[1, 2, 3, 4].map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setSelectedWeek(w)}
            className={`flex-1 rounded-md py-2 text-center text-xs font-medium transition-colors ${
              selectedWeek === w
                ? 'bg-sky-500/30 text-sky-200 shadow-sm'
                : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-300'
            }`}
          >
            Hafta {w}
          </button>
        ))}
      </div>
      {/* Grafik alanı - trend + sütunlar (4 hafta) */}
      <div className="relative">
        {/* Haftalar arası dikey çizgiler - 4 bar için 3 çizgi */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white/10 pointer-events-none"
            style={{ left: `${(i / 4) * 100}%` }}
          />
        ))}
        {/* Trend çizgisi */}
        <div className="h-10 w-full relative z-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <polyline
              points={bars.map((h, i) => `${(i / 3) * 100},${100 - h}`).join(' ')}
              fill="none"
              stroke="rgb(244,63,94)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
            {bars.map((h, i) => (
              <circle key={i} cx={(i / 3) * 100} cy={100 - h} r="3" fill="rgb(244,63,94)" />
            ))}
          </svg>
        </div>
        <div className="flex h-32 items-end gap-3 relative z-10">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full min-w-[20px] rounded-t-lg transition-all duration-500"
                style={{
                  height: `${h}%`,
                  backgroundColor: h >= 60 ? 'rgba(56,189,248,0.5)' : 'rgba(244,63,94,0.5)',
                }}
              />
              <span className="text-[10px] font-medium text-zinc-500">H{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Harcama</p>
          <p className="text-sm font-semibold text-white">{data.harcama}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Ciro</p>
          <p className="text-sm font-semibold text-sky-300">{data.ciro}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Randevu</p>
          <p className="text-sm font-semibold text-white">{data.rezervasyon}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-white/5 pt-4">
        <span className="text-sm text-zinc-400">ROAS: <span className="font-semibold text-rose-400">{data.roas}</span></span>
        <span className="text-sm text-zinc-400">
          CPA: <span className="font-semibold text-rose-400">{data.cpa}</span>
          <span className="ml-1 font-medium text-zinc-500">({data.cpaPercent})</span>
        </span>
      </div>
      <div className="mt-auto rounded-lg border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-rose-300">Kaçış Oranı: {data.butceKacisi}</p>
        <p className="mt-1 text-xs text-rose-200/80">Verimsiz Harcama: {data.verimsizHarcama}</p>
      </div>
    </div>
  );
}

type LineSeries = { name: string; values: number[]; stroke: string; highlight?: boolean };

function formatVal(v: number) {
  return v % 1 === 0 ? `${v}%` : `${v.toFixed(2)}%`;
}

function RakipLineChart({ title, series, height = 160 }: { title: string; series: LineSeries[]; height?: number }) {
  const [tooltip, setTooltip] = useState<{ week: string; values: { name: string; value: number; stroke: string }[]; x: number; y: number } | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(3);
  const xLabels = ['H1', 'H2', 'H3', 'H4'];
  const allValues = series.flatMap((s) => s.values);
  const dataMax = Math.max(...allValues, 1);
  const dataMin = Math.min(...allValues, 0);
  const padding = (dataMax - dataMin) * 0.08 || 1;
  const maxVal = dataMax + padding;
  const minVal = Math.max(0, dataMin - padding);
  const range = maxVal - minVal || 1;
  const snapshotValues = series.map((s) => ({ name: s.name, value: s.values[selectedWeek] ?? 0, stroke: s.stroke, highlight: s.highlight }));

  const xPositions = [12.5, 37.5, 62.5, 87.5];
  const yLines = [15, 40, 65, 90];
  // Ortak ölçek: değer -> y (soldaki rakamlarla aynı konumda)
  const valueToY = (value: number) => {
    const y = 95 - ((value - minVal) / range) * 80;
    return Math.max(5, Math.min(95, y));
  };
  const getPoint = (value: number, weekIndex: number) => {
    const x = xPositions[weekIndex] ?? 0;
    return { x, y: valueToY(value) };
  };
  // Soldaki rakamlar: min-max aralığında 5-6 tick, her biri kendi y konumunda
  const axisTicks = (() => {
    const n = 5;
    return Array.from({ length: n + 1 }, (_, i) => {
      const v = minVal + (i / n) * range;
      return Math.round(v * 10) / 10;
    });
  })();

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    let idx = 0;
    if (pct < 25) idx = 0;
    else if (pct < 50) idx = 1;
    else if (pct < 75) idx = 2;
    else idx = 3;
    setTooltip({
      week: xLabels[idx],
      values: series.map((s) => ({ name: s.name, value: s.values[idx] ?? 0, stroke: s.stroke })),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-500">{title}</p>
      <div className="flex gap-4">
        <div className="shrink-0 relative w-6 text-[10px] text-zinc-500 font-medium" style={{ height: `${height}px` }}>
          {axisTicks.map((tick) => {
            const y = valueToY(tick);
            return (
              <div key={tick} className="absolute -translate-y-1/2" style={{ top: `${y}%`, left: 0 }}>
                {tick % 1 === 0 ? tick : tick.toFixed(1)}
              </div>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-0" style={{ height: `${height}px` }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* 4 yatay çizgi - tümü görünür alanda */}
            {yLines.map((gy) => (
              <line key={gy} x1={0} y1={gy} x2={100} y2={gy} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
            {/* Dikey çizgiler - noktalar tam çizgilerin üzerinde (12.5, 37.5, 62.5, 87.5) */}
            {xPositions.map((gx) => (
              <line key={gx} x1={gx} y1={0} x2={gx} y2={100} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            ))}
            {series.map((s) => {
              const visiblePoints = s.values.slice(0, selectedWeek + 1);
              return (
                <g key={s.name}>
                  <polyline
                    points={visiblePoints.map((v, i) => {
                      const pt = getPoint(v, i);
                      return `${pt.x},${pt.y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={s.stroke}
                    strokeWidth={s.highlight ? 3 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={s.highlight ? 1 : 0.85}
                  />
                  {visiblePoints.map((v, i) => {
                    const pt = getPoint(v, i);
                    return <circle key={i} cx={pt.x} cy={pt.y} r={s.highlight ? 2.5 : 1.5} fill={s.stroke} />;
                  })}
                </g>
              );
            })}
          </svg>
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 rounded-lg border border-white/20 bg-zinc-900/95 px-2.5 py-1.5 text-[10px] shadow-xl"
              style={{ left: tooltip.x + 10, top: Math.max(4, tooltip.y - 55) }}
            >
              <div className="font-semibold text-white">{tooltip.week}</div>
              {tooltip.values.map((v) => (
                <div key={v.name} className="flex items-center gap-1.5">
                  <span style={{ color: v.stroke }}>●</span>
                  <span style={{ color: v.stroke }}>{v.name}: {formatVal(v.value)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 relative h-9 text-[11px]">
            <button type="button" onClick={() => setSelectedWeek(0)} className={`absolute py-2 rounded transition-colors -translate-x-1/2 ${selectedWeek === 0 ? 'font-semibold text-sky-300' : 'text-zinc-400 hover:text-zinc-300'}`} style={{ left: '12.5%' }}>H1</button>
            <button type="button" onClick={() => setSelectedWeek(1)} className={`absolute py-2 rounded transition-colors -translate-x-1/2 ${selectedWeek === 1 ? 'font-semibold text-sky-300' : 'text-zinc-400 hover:text-zinc-300'}`} style={{ left: '37.5%' }}>H2</button>
            <button type="button" onClick={() => setSelectedWeek(2)} className={`absolute py-2 rounded transition-colors -translate-x-1/2 ${selectedWeek === 2 ? 'font-semibold text-sky-300' : 'text-zinc-400 hover:text-zinc-300'}`} style={{ left: '62.5%' }}>H3</button>
            <button type="button" onClick={() => setSelectedWeek(3)} className={`absolute py-2 rounded transition-colors -translate-x-1/2 ${selectedWeek === 3 ? 'font-semibold text-sky-300' : 'text-zinc-400 hover:text-zinc-300'}`} style={{ left: '87.5%' }}>H4</button>
          </div>
        </div>
        {/* Snapshot mini panel - tıklanan haftanın verisi */}
        <div className="shrink-0 rounded-lg border border-white/10 bg-zinc-900/50 px-2.5 py-2 w-[90px] max-w-[90px]">
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">{selectedWeek + 1}. Hafta</p>
          {snapshotValues.map((v) => (
            <div key={v.name} className="flex items-center justify-between gap-1.5 text-[9px] whitespace-nowrap">
              <span className={`truncate font-medium ${v.highlight ? 'font-semibold' : ''}`} style={{ color: v.stroke }}>{v.name}</span>
              <span className="font-medium text-white shrink-0">{formatVal(v.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RAKIP_SLIDE_DATA: Array<{
  title: string;
  charts: Array<{ title: string; series: LineSeries[] }>;
  footnote?: string;
}> = [
  {
    title: 'Google Ads Rekabet Görünürlüğü (Auction Insights)',
    charts: [
      {
        title: 'Haftalık Gösterim Payı (Impression Share)',
        series: [
          { name: 'Siz', values: [12, 13, 13.5, 13.18], stroke: 'rgb(56,189,248)', highlight: true },
          { name: 'Rakip A', values: [11, 11.5, 12, 12.08], stroke: 'rgb(34,197,94)' },
          { name: 'Rakip B', values: [9.5, 10, 10.5, 10.59], stroke: 'rgb(236,72,153)' },
          { name: 'Rakip C', values: [9, 9.5, 10, 10.06], stroke: 'rgb(234,179,8)' },
        ],
      },
      {
        title: 'Haftalık Mutlak Üst Sıra Oranı (Absolute Top Rate)',
        series: [
          { name: 'Siz', values: [17, 18, 18.5, 18.73], stroke: 'rgb(56,189,248)', highlight: true },
          { name: 'Rakip A', values: [35, 37, 38, 39], stroke: 'rgb(34,197,94)' },
          { name: 'Rakip B', values: [27, 28, 29, 30], stroke: 'rgb(236,72,153)' },
          { name: 'Rakip C', values: [20, 21, 21.5, 22], stroke: 'rgb(234,179,8)' },
        ],
      },
    ],
  },
  {
    title: 'Çakışma & SERP Rekabet Analizi',
    charts: [
      {
        title: 'Haftalık Çakışma Oranı (Overlap Rate)',
        series: [
          { name: 'Rakip A', values: [45, 48, 50, 52], stroke: 'rgb(34,197,94)' },
          { name: 'Rakip B', values: [38, 40, 42, 44], stroke: 'rgb(236,72,153)' },
          { name: 'Rakip C', values: [30, 32, 34, 36], stroke: 'rgb(234,179,8)' },
        ],
      },
      {
        title: 'SERP Dominasyon Grafiği (Haftalık)',
        series: [
          { name: 'Siz', values: [25, 28, 30, 32], stroke: 'rgb(56,189,248)', highlight: true },
          { name: 'Rakip A', values: [22, 24, 26, 28], stroke: 'rgb(34,197,94)' },
          { name: 'Rakip B', values: [18, 20, 22, 24], stroke: 'rgb(236,72,153)' },
          { name: 'Rakip C', values: [15, 17, 19, 21], stroke: 'rgb(234,179,8)' },
        ],
      },
    ],
  },
];

function RakipChartMockup() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = RAKIP_SLIDE_DATA[slideIndex];

  return (
    <div className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-zinc-900/95 via-sky-950/30 to-zinc-950 p-6 shadow-2xl shadow-sky-950/30 transition-all duration-500 hover:border-sky-400/40 hover:shadow-sky-500/20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(14,165,233,0.12),_transparent_50%)]" />
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
            <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-white">Rakip Analizi</h4>
            <p className="text-xs text-zinc-500">{slide.title}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlideIndex(i)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                slideIndex === i ? 'bg-sky-400 text-sky-950' : 'bg-white/15 text-zinc-400 hover:bg-white/25'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {slide.charts.map((chart, i) => (
          <RakipLineChart key={i} title={chart.title} series={chart.series} />
        ))}
      </div>
    </div>
  );
}

function AIRaporMockup() {
  const metrics = [
    { label: 'Dijital Konum', value: '84/100', color: 'text-sky-300' },
    { label: 'Talep Durumu', value: 'Yüksek', color: 'text-emerald-300' },
    { label: 'Rekabet Baskısı', value: 'Orta', color: 'text-amber-300' },
    { label: 'Karlılık', value: '↑ 2.4x ROAS', color: 'text-sky-200' },
    { label: 'Aksiyon Önerisi', value: 'Bütçe optimizasyonu', color: 'text-sky-200' },
    { label: 'Risk & Fırsat', value: 'Döviz riski / Yurt dışı hasta fırsatı', color: 'text-amber-200' },
  ];
  return (
    <div className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-zinc-900/95 via-sky-950/20 to-zinc-950 p-6 shadow-2xl shadow-sky-950/20 transition-all duration-500 hover:border-sky-400/40 hover:shadow-sky-500/15">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),_transparent_60%)]" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
            <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-white">AI Analiz Raporu</h4>
            <p className="text-xs text-zinc-500">Dijital konum özeti</p>
          </div>
        </div>
        <Image
          src={`${BASE_PATH}/join_pr_logo_offical2.png`}
          alt="Join PR"
          width={70}
          height={24}
          className="h-6 w-auto object-contain opacity-70"
        />
      </div>
      <div className="space-y-2.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-2.5 backdrop-blur-sm transition-all hover:border-sky-500/20"
          >
            <span className="text-sm text-zinc-400">{m.label}</span>
            <span className={`text-right text-sm font-bold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


