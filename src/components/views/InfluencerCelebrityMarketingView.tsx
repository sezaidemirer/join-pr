'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import { useLanguage } from '@/context/LanguageContext';

export function InfluencerCelebrityMarketingView() {
  const BASE_PATH = ''; // Root dizin - joinpr.com.tr
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
            {isEn ? 'Influencer & Celebrity Marketing' : 'Influencer Marketing ile Ölçümlenebilir, Güçlü ve Sonuç Odaklı Kampanyalar'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın doğru içerik üreticileriyle, doğru platformlarda ve doğru stratejiyle buluşmasını sağlayan
              influencer marketing çözümleri geliştiriyor; görünürlüğü veriye, etkileşimi performansa ve kampanyaları
              somut sonuçlara dönüştürüyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_influencer_marketing.webp`}
            alt={isEn ? 'Influencer and celebrity marketing - brand partnerships' : 'Influencer ve celebrity marketing - marka ortaklıkları'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
        </div>
      </div>

      <ReferanslarSection />

      <Link
        href="/is-birliklerimiz/"
        className="group relative block min-h-[430px] overflow-hidden rounded-3xl border border-white/10 px-6 py-10 shadow-2xl shadow-black/35 transition-transform duration-300 hover:-translate-y-0.5 sm:px-8 sm:py-[68px] md:min-h-0 md:py-[68px]"
        aria-label={isEn ? 'Go to our collaborations page' : 'İş birliklerimiz sayfasına git'}
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: 'url(/join_pr_is_birliklerimiz.jpg)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-0 hidden bg-cover bg-center md:block"
          style={{ backgroundImage: 'url(/isbirliklerimiz_banner.webp)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="max-w-3xl space-y-3 pt-1 md:pt-0">
            <h3 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Our Collaborations' : 'İş Birliklerimiz'}
            </h3>
            <p className="text-sm text-zinc-300 md:text-base">
              {isEn ? (
                'Explore our partnerships and collaborations across hospitality, travel, aviation, and lifestyle.'
              ) : (
                <>
                  Konaklama, turizm, havacılık ve lifestyle alanlarında
                  <br />
                  gerçekleştirdiğimiz marka iş birliklerimizi keşfedin.
                </>
              )}
            </p>
          </div>

          <div className="mt-6">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-7 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-sky-500/25 transition-all group-hover:shadow-sky-500/40">
              {isEn ? 'View' : 'Görüntüle'}
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-zinc-200 shadow-xl shadow-black/30">
        {isEn ? (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              We build influencer marketing strategies that create authentic, high-impact connections between brands and their audiences. By aligning the right creators with the right campaign objectives, we ensure a strong and sustainable presence across the digital ecosystem.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              As a Meta Business with direct API integrations across platforms such as TikTok and YouTube, we deliver performance analytics that are accurate, real, and fully measurable. This advanced data infrastructure stands as one of Join PR’s key differentiators in the influencer marketing landscape.
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
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Influencer Marketing Neden Önemlidir?</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Influencer marketing, markaların hedef kitleleriyle daha doğal, daha güçlü ve daha etkili bir bağ
                  kurmasını sağlayan en önemli dijital iletişim alanlarından biridir. Günümüzde tüketiciler yalnızca
                  reklama değil, güvendikleri içerik üreticilerinin deneyimlerine, önerilerine ve anlatım biçimlerine de
                  dikkat ediyor. Bu nedenle doğru planlanmış bir influencer marketing stratejisi, markanın yalnızca
                  görünürlüğünü artırmakla kalmaz; aynı zamanda güven duygusunu güçlendirir, marka algısını destekler ve
                  satın alma kararına etki eden önemli bir iletişim alanı yaratır.
                </p>
                <p className="text-base leading-relaxed md:text-lg">
                  Join PR olarak influencer marketing çalışmalarını yalnızca içerik üretimi üzerinden değerlendirmiyoruz.
                  Süreci; marka hedefleri, hedef kitle yapısı, platform dinamikleri, içerik dili ve performans beklentileri
                  doğrultusunda stratejik bir bütün olarak ele alıyoruz. Böylece kampanyalar yalnızca dikkat çeken işler
                  olmaktan çıkıyor; markaya ölçülebilir katkı sağlayan, planlı ve güçlü iletişim modellerine dönüşüyor.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Doğru Influencer, Doğru Hedef, Doğru Strateji</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Başarılı bir influencer marketing çalışmasının temelinde doğru eşleşme vardır. Her içerik üreticisi her
                    marka için doğru tercih değildir. Bu nedenle iş birliklerini yalnızca takipçi sayısına göre değil;
                    içerik üreticisinin hedef kitle profiline, etkileşim yapısına, içerik kalitesine, marka uyumuna ve
                    kampanya hedeflerine göre değerlendiriyoruz.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Markanın konumlandırmasına uygun içerik üreticilerini belirliyor, kampanya hedeflerine göre doğru mecra
                    dağılımını planlıyor ve iletişim yapısını tek bir stratejik çatı altında kurguluyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Veriye Dayalı Influencer Marketing Altyapısı</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Join PR’nin influencer marketing alanındaki en güçlü ayrışma noktalarından biri, tüm kampanya
                    süreçlerini veriye dayalı şekilde yönetebilmesidir. Meta Business, TikTok ve YouTube gibi platformlarla
                    sahip olduğumuz API bağlantıları sayesinde kampanyalarda yayınlanan içeriklerin performansını doğrudan,
                    gerçek ve ölçümlenebilir veriler üzerinden analiz ediyoruz.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Canlı Dashboard ile Anlık Performans Takibi</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Markalar için özel olarak tasarladığımız canlı dashboard sistemleri, influencer marketing
                    kampanyalarının tüm süreçlerini anlık olarak takip edilebilir hale getirir. Erişim, etkileşim,
                    görüntülenme, tıklama, izlenme süresi, CPM, CPE, CPV ve CPC gibi kritik metrikler tek bir panel
                    üzerinden detaylı biçimde sunulur.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Şeffaf Raporlama ve Gerçek Sonuçlar</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Influencer marketing alanında en büyük sorunlardan biri, kampanya sonuçlarının çoğu zaman yüzeysel ya
                    da eksik verilerle değerlendirilmesidir. Join PR olarak bu alanı tamamen şeffaf bir yapıyla yönetiyoruz.
                    Tüm içerikleri gerçek platform verileriyle raporluyor, performansı kampanyanın verimliliğini ortaya
                    koyan detaylı metriklerle birlikte sunuyoruz.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Sürdürülebilir Görünürlük ve Güçlü Marka Etkisi</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Influencer marketing çalışmalarında asıl hedef, tek seferlik içerikler üretmek değil; markanın dijital
                  ekosistemde daha güçlü ve sürdürülebilir bir görünürlük elde etmesini sağlamaktır. Bu nedenle kampanyaları
                  yalnızca yayın takvimi üzerinden değil, marka iletişiminin genel yapısı içinde değerlendiriyoruz.
                </p>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Join PR Influencer Marketing Yaklaşımı</h2>
                <p className="mt-2 text-base leading-relaxed md:text-lg">
                  Join PR’nin influencer marketing yaklaşımı, yalnızca içerik üretimine odaklanan klasik modellerden
                  ayrılır. Bizim için önemli olan; markaya uygun içerik üreticileriyle doğru kampanya yapısını kurmak,
                  süreci profesyonel biçimde yönetmek, tüm çıktıları gerçek verilerle ölçmek ve kampanyayı somut sonuçlarla
                  değerlendirmektir. İçerik, strateji, performans ve raporlamayı tek bir sistem içinde bir araya getirerek
                  markalara daha güçlü, daha kontrollü ve daha verimli bir influencer marketing modeli sunuyoruz.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn
            ? 'Strengthen Influencer Marketing with Data'
            : 'Influencer Marketing Süreçlerinizi Veriye Dayalı Şekilde Güçlendirin'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s build influencer marketing campaigns with the right creators, right platforms, and real data.'
            : 'Markanız için doğru içerik üreticileriyle, doğru platformlarda ve gerçek verilerle desteklenen influencer marketing kampanyaları oluşturalım.'}
        </p>
        <div className="mt-6">
          <Link
            href="/iletisim/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-teal-500/25 transition-all hover:opacity-95 hover:shadow-teal-500/40"
          >
            {isEn ? 'Contact' : 'İletişime Geç'}
          </Link>
        </div>
      </section>
    </div>
  );
}

