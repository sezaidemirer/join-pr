'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

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
            src="/join_pr_medya_iliskileri.jpg"
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

      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {isEn ? 'Request a Quote for Media Relations' : 'Medya İlişkileri Yönetimi için Teklif İsteyin'}
            </h2>
            <p className="mt-3 text-sm text-zinc-200 md:text-base">
              {isEn
                ? 'Get in touch with us to discuss your media relations needs.'
                : 'Medya ilişkileri yönetimi ihtiyaçlarınızı görüşmek için bizimle iletişime geçin.'}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/25 whitespace-nowrap"
          >
            {isEn ? 'Contact Us' : 'İletişime Geç'}
          </Link>
        </div>
      </section>
    </div>
  );
}


