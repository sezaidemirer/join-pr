'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

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
            {isEn ? 'Celebrity Marketing' : 'Celebrity Marketing ile Markanıza Güçlü, Etkili ve Uluslararası Bir Görünürlük Kazandırın'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızı dizi ve sinema oyuncuları, müzisyenler, sporcular ve tanınmış isimlerle buluşturan celebrity
              marketing stratejileri geliştiriyor; iş birliklerini yüksek görünürlük, güçlü algı ve uzun vadeli marka
              değerine dönüştürüyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_celebrity_marketing.webp`}
            alt={isEn ? 'Celebrity marketing - brand partnership' : 'Celebrity marketing - marka ortaklığı'}
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
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Celebrity Marketing Neden Önemlidir?</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Celebrity marketing, markaların hedef kitleleriyle daha güçlü, daha dikkat çekici ve daha etkili bağlar
                  kurmasını sağlayan en güçlü iletişim alanlarından biridir. Tanınmış isimlerle kurulan doğru iş birlikleri,
                  markanın yalnızca daha fazla görünmesini sağlamaz; aynı zamanda güven duygusunu destekler, mesajın etkisini
                  artırır ve kampanyaya çok daha güçlü bir hikaye kazandırır.
                </p>
                <p className="text-base leading-relaxed md:text-lg">
                  Join PR olarak celebrity marketing süreçlerini yalnızca ünlü isim kullanımı olarak görmüyoruz. Bizim için
                  asıl önemli olan, markanın hedefiyle uyumlu doğru yüzü seçmek, bu iş birliğini güçlü bir yaratıcı
                  çerçeveye oturtmak ve ortaya çıkan görünürlüğü markaya gerçek değer sağlayan bir iletişim modeline
                  dönüştürmektir.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Markanızı Doğru Yüzlerle Buluşturuyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Başarılı bir celebrity marketing çalışmasının temelinde doğru eşleşme yer alır. Her tanınmış isim, her
                    marka için doğru tercih değildir. Bu nedenle iş birliklerini yalnızca popülerlik üzerinden değil; kişinin
                    hedef kitle üzerindeki etkisi, bilinirlik alanı, iletişim dili, kamuoyu algısı ve markayla kuracağı doğal
                    bağ üzerinden değerlendiriyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Yerel Etkinin Ötesinde Uluslararası Görünürlük</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Join PR’nin celebrity marketing alanındaki en güçlü yönlerinden biri, çalıştığı oyuncular ve tanınmış
                    isimlerin yalnızca yerel pazarda değil, uluslararası ölçekte de güçlü bir etki alanına sahip olmasıdır.
                    Birçok iş birliğinde yer alan isimler; Orta Doğu, Avrupa, Balkanlar ve Asya başta olmak üzere geniş bir
                    coğrafyada tanınır, takip edilir ve yüksek etkileşim üretir.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Celebrity İş Birliklerini Güçlü Bir Hikayeye Dönüştürüyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Celebrity marketing çalışmalarında asıl farkı yaratan unsur, tanınmış ismin kampanyaya sadece dahil
                    edilmesi değil; bu iş birliğinin güçlü bir hikaye, doğru içerik ve etkili medya planlamasıyla
                    desteklenmesidir. Join PR olarak celebrity iş birliklerini kreatif içerik kurguları, kampanya konseptleri,
                    prodüksiyon süreçleri, medya entegrasyonları ve PR çalışmalarıyla çok daha güçlü bir yapıya
                    dönüştürüyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Global Sosyal Medya ve PR Gücüyle Desteklenen Kampanyalar</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Celebrity marketing çalışmalarının etkisini büyüten en önemli unsurlardan biri, bu iş birliklerinin doğru
                    medya ve sosyal medya stratejileriyle desteklenmesidir. Join PR olarak celebrity kampanyalarını yalnızca
                    içerik üretimiyle sınırlamıyor; global sosyal medya görünürlüğü, haber yansımaları, dijital yayın gücü ve
                    PR planlamasıyla çok daha büyük bir iletişim alanına taşıyoruz.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Marka Değerini Güçlendiren Stratejik İş Birlikleri</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Doğru celebrity iş birlikleri, markanın hedef kitlesiyle kurduğu ilişkiyi güçlendirirken aynı zamanda
                  marka değerini de yukarı taşır. Burada önemli olan yalnızca popülerlik değil; markayla celebrity arasında
                  doğal, inandırıcı ve stratejik bir bağ kurabilmektir.
                </p>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Join PR Celebrity Marketing Yaklaşımı</h2>
                <p className="mt-2 text-base leading-relaxed md:text-lg">
                  Join PR olarak celebrity marketing süreçlerini strateji, kreatif kurgu, medya planlaması ve görünürlük
                  gücüyle birlikte ele alıyoruz. Markanın hedef kitlesine, pazarına ve iletişim hedeflerine uygun isimleri
                  belirliyor; iş birliklerini güçlü içerik ve iletişim kurgularıyla destekliyoruz. Yerel etkiden global
                  görünürlüğe uzanan bu yapı sayesinde markalara daha güçlü, daha dikkat çekici ve daha değerli bir iletişim
                  alanı sunuyoruz.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn
            ? 'Move Your Brand to a Stronger Impact with the Right Faces'
            : 'Markanızı Doğru Yüzlerle Daha Güçlü Bir Etkiye Taşıyalım'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s build your celebrity marketing strategy together and design high-impact campaigns that go beyond local visibility.'
            : 'Celebrity marketing stratejinizi birlikte oluşturalım, markanızı yerel görünürlüğün ötesine taşıyan güçlü ve uluslararası etkisi yüksek kampanyalar kurgulayalım.'}
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

