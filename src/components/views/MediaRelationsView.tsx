'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function MediaRelationsView() {
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
            {isEn ? 'Media Relations' : 'Medya İlişkileri Yönetimi ile Doğru Yerde, Doğru Şekilde Görünür Olun'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın medya dünyasında daha güçlü bir konum kazanması için ulusal ve uluslararası basınla etkili
              bağlantılar kuruyor, haber değeri taşıyan içerikler üretiyor ve görünürlüğü stratejik bir yapıyla
              yönetiyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_medya_iliskileri.webp`}
            alt={isEn ? 'Media relations - media wall' : 'Medya ilişkileri yönetimi - medya görseli'}
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
              title="Join PR Medya İlişkileri Yönetimi"
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
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              We develop and manage comprehensive media relations strategies that reinforce brand visibility, strengthen positioning, and
              build lasting credibility across the media landscape. Through trusted connections with national and international press, we
              create newsworthy content and ensure brands appear in the right stories, in the right places, at the right time.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Our work spans press releases, feature stories, editorial coordination, executive interviews, and media-led experiences. Each
              step is crafted to elevate a brand’s presence and shape meaningful engagement with public audiences.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              With a strategic and influence-driven approach, we empower brands to communicate with authority and create measurable impact
              across the media ecosystem.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Medya İlişkileri Neden Önemlidir?</h2>
                <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
                  Medya ilişkileri, bir markanın kamuoyuna nasıl yansıdığını belirleyen en kritik iletişim alanlarından
                  biridir. Doğru planlanmış bir medya ilişkileri stratejisi, markanın yalnızca daha fazla görünmesini
                  değil; doğru mesajlarla, doğru mecralarda ve doğru zamanlamayla öne çıkmasını sağlar. Join PR olarak
                  markaların medya dünyasındaki varlığını stratejik bir çerçevede ele alıyor, görünürlüğü daha güçlü ve
                  daha etkili hale getiren iletişim modelleri geliştiriyoruz.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Ulusal ve Uluslararası Basınla Güçlü Bağlantılar</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Markaların hedeflerine uygun medya planlamaları oluşturuyor, ulusal ve uluslararası basınla doğru
                    bağlantıları kuruyoruz. Haber değeri taşıyan içerikler, basın bültenleri, özel röportajlar, editoryal
                    çalışmalar ve medya koordinasyonlarıyla markaların basında daha güçlü şekilde yer almasını sağlıyoruz.
                    Amaç yalnızca haber çıkarmak değil; markanın doğru içerikle, doğru yayınlarda ve doğru çerçevede
                    temsil edilmesini sağlamaktır.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Tüm Süreçleri Stratejik Olarak Kurguluyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Basın iletişiminden medya etkinliklerine, özel dosya çalışmalarından röportaj süreçlerine kadar tüm
                    adımları titizlikle planlıyoruz. Markanın anlatmak istediği hikayeyi medya diliyle buluşturuyor,
                    kamuoyuna daha net, daha güçlü ve daha profesyonel bir şekilde yansıtıyoruz. Her adımda tutarlılığı
                    koruyan bu yaklaşım, markanın medya ile kurduğu bağı daha sağlam hale getirir.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Doğru Mesaj, Doğru Zaman, Doğru Mecra</h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-200 md:text-lg">
                  Medya ilişkileri yönetiminde asıl değer, yalnızca görünür olmak değil; etki yaratacak bir görünürlük
                  oluşturmaktır. Join PR&apos;nin medya ilişkileri yaklaşımı, markaların mesajlarını doğru zamanda, doğru
                  yayınlarda ve doğru içerik kurgusuyla öne çıkarmayı hedefler. Böylece markalar medya gündeminde daha
                  güçlü bir yer edinir, hedef kitlesiyle daha etkili bir bağ kurar ve sektöründe daha sağlam bir konuma
                  ulaşır.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn ? 'Position Your Brand Stronger in Media' : 'Markanızı Medyada Daha Güçlü Konumlandıralım'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s build your media relations strategy together and make your brand visible with the right publications and messages.'
            : 'Medya ilişkileri stratejinizi birlikte oluşturalım, markanızı doğru yayınlarla ve doğru mesajlarla öne çıkaralım.'}
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


