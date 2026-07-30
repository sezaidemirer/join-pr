'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function CorporateCommunicationView() {
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
            {isEn ? 'Corporate Communications' : 'Kurumsal İletişimde Güçlü, Tutarlı ve Stratejik Bir Yapı'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın medya, paydaş ve hedef kitleyle kurduğu iletişimi tek bir stratejik çerçevede şekillendiriyor;
              kurumsal duruşu netleştiren, güven oluşturan ve uzun vadeli değer yaratan iletişim modelleri geliştiriyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_kurumsal_iletisim.webp`}
            alt={isEn ? 'Corporate communications - business handshake' : 'Kurumsal iletişim - el sıkışan iş ortakları'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 p-4 shadow-xl shadow-black/30 md:p-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
            <iframe
              src="https://www.youtube.com/embed/al-D_BC5cYc?rel=0"
              title="Join PR Kurumsal İletişim"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-zinc-200 shadow-xl shadow-black/30">
        {isEn ? (
          <>
            <p className="text-base leading-relaxed md:text-lg">
              Join PR is a next-generation communications agency that turns brand narratives into powerful, enduring experiences.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Specializing in hospitality, aviation, national tourism boards, and lifestyle brands, we unite deep industry expertise with global perspective. Our 360° communication framework is driven by strategy, creativity, and data intelligence—empowering brands to shape perception, amplify influence, and build lasting equity.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Every collaboration is a strategic alliance. We champion the ambitions of the brands we partner with, transforming their goals into measurable impact and global recognition.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Join PR crafts communication that stands out, resonates, and endures.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Stratejik Kurumsal İletişim</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Kurumsal iletişim, bir markanın kendini nasıl anlattığını, nasıl algılandığını ve sektörde nasıl bir
                  konum edindiğini belirleyen temel alanlardan biridir. Join PR olarak markaların iç ve dış paydaşlarıyla
                  kurduğu tüm iletişim süreçlerini stratejik bir bütünlük içinde ele alıyor; kurum kimliğini güçlendiren,
                  marka değerini yükselten ve uzun vadeli güven oluşturan iletişim modelleri geliştiriyoruz.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Mesaj ve Söylem Yönetimi</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Basın ilişkilerinden kriz iletişimine, lider iletişiminden içerik stratejisine kadar tüm başlıklarda
                    markaların söylemini netleştiriyor, mesajlarını güçlendiriyor ve her temas noktasında daha tutarlı bir
                    iletişim yapısı kuruyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Sürdürülebilir Etki</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Hedefimiz yalnızca mesaj üretmek değil; markanın duruşunu doğru yansıtan, güven veren ve
                    sürdürülebilir etki yaratan bir iletişim zemini oluşturmaktır.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Markaya Özel Çözüm Modeli</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Her markanın sektörü, hedef kitlesi ve iletişim ihtiyacı farklıdır. Bu nedenle hazır kalıplar yerine,
                  markanın yapısına ve hedeflerine özel çözümler geliştiriyoruz. Günlük iletişim ihtiyaçlarının ötesine
                  geçen bu yaklaşım, markaların kısa vadeli görünürlükten çok daha fazlasını elde etmesini sağlar; daha
                  güçlü bir kurumsal yapı, daha net bir marka dili ve daha sağlam bir algı oluşturur.
                </p>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Join PR Yaklaşımı</h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-200 md:text-lg">
                  Join PR&apos;nin kurumsal iletişim yaklaşımı, markaların yalnızca daha fazla görünmesini değil; daha
                  güvenilir, daha tutarlı ve daha güçlü bir konuma ulaşmasını hedefler. Kurumun tüm iletişim alanlarını
                  tek bir stratejik çerçevede bir araya getirerek, markalar için uzun vadeli değer yaratan bir iletişim
                  modeli kurarız.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn ? 'Contact Us Now for Corporate Communications Solutions' : 'Kurumsal İletişim Çözümleri İçin Hemen İletişime Geçin'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Strengthen your brand positioning, message architecture and stakeholder trust with a tailored corporate communications strategy.'
            : 'Markanız için güçlü bir iletişim mimarisi, net bir söylem ve sürdürülebilir itibar yönetimi kurgulayalım.'}
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

