'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function SponsorshipCommunicationView() {
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
            {isEn ? 'Sponsorship Management' : 'Sponsorluk İletişimi ile Markanızı Doğru Alanlarda Güçlü Şekilde Konumlandırın'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın hedef kitlesiyle en doğru temas noktalarında buluşmasını sağlayan sponsorluk iletişimi
              stratejileri geliştiriyor; iş birliklerini görünürlüğün ötesine taşıyan, etki yaratan ve marka değerini
              destekleyen güçlü iletişim modelleri kurguluyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_sponsorluk_iletisimi.webp`}
            alt={isEn ? 'Sponsorship management - brand partnership' : 'Sponsorluk yönetimi - marka ortaklığı'}
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
              We develop sponsorship communication strategies that connect brands with their audiences at the most impactful touchpoints. Across sports, gastronomy, music, culture, and live experiences, we design partnerships that elevate brand positioning, enhance visibility, and build long-term value.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Every opportunity is evaluated through the lens of the brand’s strategic goals. Through creative activations, experiential concepts, compelling content, and integrated media visibility, we transform sponsorships into powerful communication and engagement platforms.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Sponsorluk İletişimi Neden Önemlidir?</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Sponsorluk iletişimi, markaların hedef kitlesiyle daha güçlü, daha doğal ve daha etkili bağlar kurmasını
                  sağlayan önemli iletişim alanlarından biridir. Doğru planlanmış bir sponsorluk stratejisi; markanın
                  yalnızca görünürlüğünü artırmaz, aynı zamanda bulunduğu alanla kurduğu bağı güçlendirir ve daha anlamlı
                  bir marka algısı oluşturur. Join PR olarak markalar için sponsorluk süreçlerini stratejik bir yaklaşımla
                  ele alıyor, iş birliklerini markanın büyüme hedefleriyle uyumlu hale getiriyoruz.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Markaya Uygun Sponsorluk Alanları Oluşturuyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Spor, gastronomi, müzik, kültür-sanat, etkinlikler ve özel projeler gibi farklı alanlarda markanın
                    yapısına, hedef kitlesine ve iletişim hedeflerine uygun sponsorluk fırsatları geliştiriyoruz. Her iş
                    birliğini markanın konumlandırmasını güçlendirecek, görünürlüğünü destekleyecek ve hedef kitlesiyle daha
                    etkili bir temas kurmasını sağlayacak şekilde değerlendiriyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">İş Birliklerini Güçlü Bir İletişim Alanına Dönüştürüyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Her sponsorluk fırsatını marka stratejisiyle uyumlu biçimde analiz ediyor; yaratıcı aktivasyonlar,
                    deneyim odaklı uygulamalar, içerik kurguları ve medya entegrasyonlarıyla bu iş birliklerini çok daha
                    güçlü bir iletişim alanına dönüştürüyoruz. Böylece sponsorluk çalışmaları yalnızca logo görünürlüğüyle
                    sınırlı kalmaz.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Görünürlükten Daha Fazla Değer Üreten Bir Yaklaşım</h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-200 md:text-lg">
                  Join PR&apos;nin sponsorluk iletişimi yaklaşımı, markalara yalnızca görünürlük sağlamayı hedeflemez.
                  Asıl amaç; doğru iş birlikleriyle markanın algısını güçlendirmek, daha etkili bir iletişim zemini
                  oluşturmak ve uzun vadeli marka değerine katkı sunmaktır. Bu sayede sponsorluk çalışmaları, markalar için
                  geçici bir görünürlük alanı olmaktan çıkar; stratejik, etkili ve sürdürülebilir bir iletişim gücüne
                  dönüşür.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn ? 'Build the Right Sponsorship Strategy for Your Brand' : 'Markanız İçin Doğru Sponsorluk Stratejisini Birlikte Kuralım'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s shape your sponsorship communication with a brand-specific strategy and turn your partnerships into stronger impact.'
            : 'Sponsorluk iletişiminizi markanıza özel bir stratejiyle şekillendirelim, iş birliklerinizi daha güçlü bir etki alanına dönüştürelim.'}
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

