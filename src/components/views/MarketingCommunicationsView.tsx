'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function MarketingCommunicationsView() {
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
            {isEn ? 'Marketing Communications' : 'Pazarlama İletişimi ile Markanızı Daha Güçlü ve Daha Etkili Konumlandırın'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın değer önerisini, konumlandırmasını ve mesajlarını doğru hedef kitleyle buluşturan bütünleşik
              pazarlama iletişimi stratejileri geliştiriyor; görünürlüğü etkileşime, ilgiyi tercihe ve iletişimi sonuca
              dönüştürüyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_pazarlama_iletisimi.webp`}
            alt={isEn ? 'Marketing communications - strategy presentation' : 'Pazarlama iletişimi - strateji sunumu görseli'}
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
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              We create integrated marketing communication strategies that articulate a brand’s value, define its positioning, and connect
              its message with the right audiences. By combining data, insight, and creativity, we help brands build not only visibility,
              but preference, relevance, and meaningful engagement.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Our approach unifies every touchpoint—campaign planning, content creation, digital strategy, and brand experiences—under a
              single strategic vision, transforming marketing objectives into measurable impact.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Through precise storytelling and audience-focused communication, we strengthen brand narratives, enhance competitive
              advantage, and support sustainable growth.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Pazarlama İletişimi Neden Önemlidir?</h2>
                <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
                  Pazarlama iletişimi, bir markanın sunduğu değeri hedef kitlesine nasıl anlattığını ve pazarda nasıl bir
                  yer edindiğini belirleyen en önemli alanlardan biridir. Doğru kurgulanmış bir pazarlama iletişimi
                  stratejisi, markanın yalnızca görünür olmasını değil; hatırlanmasını, ilgi görmesini ve tercih edilmesini
                  sağlar. Join PR olarak markaların iletişim süreçlerini stratejik bir bütünlük içinde ele alıyor, pazarlama
                  hedeflerini destekleyen güçlü iletişim modelleri geliştiriyoruz.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Veri, İçgörü ve Yaratıcılığı Bir Araya Getiriyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Etkili bir pazarlama iletişimi, yalnızca yaratıcı fikirlerden değil; doğru analizden, güçlü içgörüden
                    ve net bir stratejiden beslenir. Bu nedenle markanın hedef kitlesini, rekabet alanını, iletişim
                    ihtiyaçlarını ve büyüme hedeflerini birlikte değerlendiriyoruz. Veri odaklı yaklaşımı yaratıcı iletişim
                    kurgularıyla birleştirerek markaların daha güçlü mesajlar üretmesini ve bu mesajları doğru kanallarda
                    etkili biçimde kullanmasını sağlıyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Tüm İletişim Süreçlerini Tek Çatı Altında Kurguluyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Kampanya kurgularından içerik tasarımına, dijital stratejilerden marka deneyimine kadar pazarlama
                    iletişiminin tüm bileşenlerini tek bir stratejik yapı altında ele alıyoruz. Böylece markanın farklı
                    mecralarda dağınık değil, birbiriyle uyumlu ve birbirini güçlendiren bir iletişim yapısına sahip
                    olmasını sağlıyoruz.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Görünürlükten Daha Fazlasını Hedefliyoruz</h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-200 md:text-lg">
                  Join PR&apos;nin pazarlama iletişimi yaklaşımı, markaların yalnızca daha fazla kişiye ulaşmasına
                  odaklanmaz. Asıl hedef; markayı daha güçlü bir algıyla öne çıkarmak, hedef kitleyle daha anlamlı bir bağ
                  kurmak ve iletişim çalışmalarını somut çıktılara dönüştürmektir. Bu sayede markalar daha hatırlanır, daha
                  fazla etkileşim üretir ve kendi kategorisinde daha güçlü bir konum kazanır.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn ? 'Strengthen Your Marketing Communications' : 'Pazarlama İletişiminizi Daha Güçlü Hale Getirin'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s build an integrated marketing communications strategy for your brand and transform communication into stronger outcomes.'
            : 'Markanız için bütünleşik bir pazarlama iletişimi stratejisi oluşturalım, iletişiminizi daha etkili sonuçlara dönüştürelim.'}
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


