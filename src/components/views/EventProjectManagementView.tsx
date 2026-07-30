'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

export function EventProjectManagementView() {
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
            {isEn ? 'Event and Project Management' : 'Etkinlik ve Proje Yönetimi ile Markanıza Güçlü ve Etkili Deneyimler Tasarlayın'}
          </h1>
          {!isEn ? (
            <p className="max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Markanızın hedeflerine, konumlandırmasına ve iletişim stratejisine uygun etkinlik ve proje yönetimi
              çözümleri geliştiriyor; yaratıcı fikirden uygulamaya kadar tüm süreci uçtan uca yöneterek güçlü, planlı ve
              etkili deneyimler oluşturuyoruz.
            </p>
          ) : null}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 md:h-56">
          <Image
            src={`${BASE_PATH}/join_pr_etkinlik_ve_proje_yonetimi.webp`}
            alt={isEn ? 'Event and project management - professional organization' : 'Etkinlik ve proje yönetimi - profesyonel organizasyon'}
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
              We build data-driven media planning and buying strategies that connect brands with their audiences in the most effective and impactful way. From digital platforms to television, print, and out-of-home channels, we design holistic media ecosystems that deliver the right message at the right moment through the right touchpoints.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              Our process combines budget optimization, channel selection, performance measurement, and campaign management—maximizing visibility while driving measurable return on investment.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              With a results-focused and insight-led approach, we empower brands with more than reach; we deliver influence, efficiency, and sustained communication power across every media channel.
            </p>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white md:text-2xl">Etkinlik ve Proje Yönetimi Neden Önemlidir?</h2>
                <p className="text-base leading-relaxed md:text-lg">
                  Etkinlik ve proje yönetimi, markaların hedef kitleleriyle doğrudan bağ kurduğu, deneyim yarattığı ve
                  iletişimini fiziksel ya da özel kurgulanmış alanlarda daha güçlü hissettirdiği en önemli çalışma
                  alanlarından biridir. Doğru planlanmış bir etkinlik ya da proje, markanın yalnızca görünmesini değil;
                  hissedilmesini, hatırlanmasını ve daha güçlü bir algıyla öne çıkmasını sağlar. Join PR olarak markalar
                  için etkinlik ve proje süreçlerini stratejik bir bakış açısıyla ele alıyor, her aşamayı markanın iletişim
                  hedefleriyle uyumlu biçimde kurguluyoruz.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Tüm Süreçleri Uçtan Uca Yönetiyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Kreatif fikrin geliştirilmesinden planlamaya, operasyonel süreçlerden deneyim tasarımına kadar tüm
                    adımları tek bir stratejik yapı içinde yönetiyoruz. Böylece markalar için yalnızca iyi organize edilmiş
                    değil, aynı zamanda mesajı güçlü, amacı net ve etkisi yüksek projeler ortaya çıkıyor. Sürecin her
                    aşamasında detayları titizlikle ele alıyor, yaratıcı yaklaşımı güçlü operasyonel planlamayla
                    birleştiriyoruz.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                  <h3 className="text-lg font-semibold text-white">Farklı Alanlarda Güçlü Projeler Tasarlıyoruz</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300 md:text-base">
                    Lansmanlardan özel davetlere, sponsorluk entegrasyonlarından destinasyon projelerine, medya
                    etkinliklerinden influencer aktivasyonlarına kadar geniş bir alanda projeler geliştiriyoruz. Her
                    projeyi markanın konumlandırmasına, hedef kitlesine ve iletişim hedeflerine uygun biçimde tasarlıyor;
                    her temas noktasında daha güçlü, daha tutarlı ve daha etkili bir marka deneyimi oluşturuyoruz.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-400/30 bg-teal-500/10 p-5">
                <h2 className="text-lg font-semibold text-white md:text-xl">Deneyim, Etki ve Stratejiyi Bir Araya Getiriyoruz</h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-200 md:text-lg">
                  Join PR&apos;nin etkinlik ve proje yönetimi yaklaşımı, markalara yalnızca bir organizasyon sunmaz. Asıl
                  hedef; iz bırakan, dönüşüm yaratan ve marka hikayesine gerçek değer katan projeler oluşturmaktır. Bu
                  sayede etkinlikler ve özel projeler, geçici bir temas alanı olmanın ötesine geçer; markanın gücünü
                  hissettiren, hedef kitleyle bağ kuran ve iletişimi daha etkili hale getiren stratejik bir deneyim alanına
                  dönüşür.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <section className="rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 via-sky-500/10 to-blue-600/10 p-8 text-center shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">
          {isEn ? 'Design Stronger Events and Projects for Your Brand' : 'Markanız İçin Etkili Etkinlik ve Projeler Tasarlayalım'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200 md:text-base">
          {isEn
            ? 'Let’s plan your event and project management processes with a brand-specific strategy and transform memorable experiences into stronger outcomes.'
            : 'Etkinlik ve proje yönetimi süreçlerinizi markanıza özel bir stratejiyle planlayalım, unutulmaz deneyimleri güçlü sonuçlara dönüştürelim.'}
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

