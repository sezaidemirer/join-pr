'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReferanslarSection } from '@/components/ReferanslarSection';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function BrandCommunicationView() {
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
            {isEn ? 'Brand Communication' : 'Marka İletişimi ile Güçlü, Tutarlı ve Tercih Edilen Markalar'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın kimliğini, değerlerini ve sunduğu vaadi doğru hedef kitleyle buluşturan stratejik iletişim
              modelleri geliştiriyor; her temas noktasında daha güçlü, daha net ve daha akılda kalıcı bir marka algısı
              oluşturuyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_marka_iletisimi.webp`}
            alt={isEn ? 'Brand communication - brand building' : 'Marka iletişimi - marka inşası görseli'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
        </div>
      </div>

      <ReferanslarSection />

      <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-zinc-200 shadow-xl shadow-black/30">
        {isEn ? (
          <>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              We design brand communication frameworks that define identity, amplify value, and create lasting relevance. Every narrative,
              touchpoint, and expression is crafted to strengthen recognition, build emotional connection, and establish a distinct
              position in the market.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Our approach transforms brand stories into impactful experiences—driving preference, loyalty, and influence. With strategic
              clarity and creative precision, we ensure brands speak with purpose, resonate with their audiences, and stand out with
              unmistakable presence.
            </p>
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white md:text-2xl">Marka İletişimi Neden Önemlidir?</h2>
              <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
                Marka iletişimi, bir markanın yalnızca kendini anlatma biçimini değil, hedef kitlesi tarafından nasıl
                algılandığını da belirler. Doğru kurgulanmış bir marka iletişimi; markanın değerlerini görünür hale
                getirir, mesajlarını netleştirir ve pazardaki konumunu daha güçlü hale getirir. Join PR olarak markaların
                kimliğini, söylemini ve iletişim dilini stratejik bir bütünlük içinde ele alıyor, her mecrada tutarlı ve
                etkili bir yapı kuruyoruz.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                <h3 className="text-lg font-semibold text-white">Stratejik ve Tutarlı Bir Marka Dili</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                  Bir markanın güçlü olması için yalnızca tanınması yetmez; doğru anlaşılması, hatırlanması ve güven
                  vermesi gerekir. Bu nedenle marka iletişimini sadece görünürlük sağlayan bir alan olarak değil, markayı
                  rakiplerinden ayrıştıran temel bir güç olarak değerlendiriyoruz.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                <h3 className="text-lg font-semibold text-white">Markanızı Doğru Kitleyle Buluşturuyoruz</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                  Her markanın faaliyet alanı, hedef kitlesi ve büyüme hedefi farklıdır. Bu yüzden standart çözümler
                  yerine, markanın yapısına ve ihtiyaçlarına özel marka iletişimi stratejileri geliştiriyoruz.
                </p>
              </div>
            </div>

            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              İletişim dilinden içerik kurgusuna, marka söyleminden hedef kitleye verilen mesaja kadar her noktada daha
              net, daha güçlü ve daha sürdürülebilir bir iletişim yapısı oluşturuyoruz. Markanın hikayesini doğru zeminde
              konumlandırıyor, değerlerini öne çıkarıyor ve hedef kitlesiyle daha güçlü bir bağ kurmasını sağlıyoruz.
              Amacımız markaların yalnızca bilinir hale gelmesi değil; benimsenen, güven duyulan ve tercih edilen bir
              konuma ulaşmasıdır.
            </p>

            <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
              <h2 className="text-lg font-semibold text-white md:text-xl">Join PR Marka İletişimi Yaklaşımı</h2>
              <p className="mt-2 text-base leading-relaxed text-zinc-200 md:text-lg">
                Join PR&apos;nin marka iletişimi yaklaşımı; markanın özünü koruyan, iletişim gücünü artıran ve tüm temas
                noktalarında tutarlılık sağlayan stratejik bir yapı sunar. Böylece markalar daha net bir kimlik kazanır,
                daha güçlü bir algı oluşturur ve kendi sektöründe daha etkili bir konuma yerleşir.
              </p>
            </div>
          </div>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn ? 'Position Your Brand Stronger' : 'Markanızı Daha Güçlü Konumlandırın'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s build your brand communication strategy together and deliver your message to the right audience.'
            : 'Marka iletişimi stratejinizi birlikte oluşturalım, markanızı doğru mesajlarla doğru kitleye ulaştıralım.'}
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


