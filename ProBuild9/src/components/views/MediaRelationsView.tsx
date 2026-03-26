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
            {isEn ? 'Media Relations' : 'Medya İlişkileri Yönetimi'}
          </h1>
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
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Markaların medya dünyasındaki görünürlüğünü, konumunu ve itibarını güçlendirmek için kapsamlı bir medya ilişkileri stratejisi
              oluşturur ve yönetiriz. Ulusal ve uluslararası basınla doğru bağlantıları kurar, haber değerini yükselten içerikler üretir ve
              markaların medya gündeminde etkili bir şekilde yer almasını sağlarız.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Basın bültenlerinden özel röportajlara, haber koordinasyonundan medya etkinliklerine kadar tüm süreçleri titizlikle
              kurgulayarak, markaların kamuoyuyla güçlü, tutarlı ve güvenilir bir bağ kurmasına öncülük ederiz.
            </p>
            <p className="text-base leading-relaxed text-zinc-200 md:text-lg">
              Medya ilişkileri yaklaşımımız, markaların yalnızca duyulmasını değil; doğru mesajlarla, doğru zamanda ve doğru mecrada etki
              yaratmasını hedefler.
            </p>
          </>
        )}
      </div>
    </div>
  );
}


