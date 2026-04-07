'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function PlaceholderAvatar({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-500 bg-zinc-800/60 text-zinc-500"
      style={{ width: size, height: size }}
    >
      <span className="text-xl">?</span>
    </div>
  );
}

function CreatorAvatar({ name, imagePath, size = 48 }: { name: string; imagePath?: string; size?: number }) {
  if (imagePath) {
    return (
      <div className="relative shrink-0 overflow-hidden rounded-full bg-zinc-800" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagePath} alt={name} width={size} height={size} className="h-full w-full object-cover" />
      </div>
    );
  }
  return <PlaceholderAvatar size={size} />;
}

// Maldives.pdf — genel performans özeti
const VILLA_KPIS = {
  posts: 5,
  influencers: 3,
  engagement: '291.71K',
  value: '$254.5K',
};

const VILLA_PERFORMANCE = {
  posts: 5,
  creators: 3,
  views: '3.72M',
  engagements: '291.71K',
  engagementRate: '2.76%',
  reach: '3.25M',
  emv: '$254.5K',
  followers: '6.63M',
  shares: '—',
  likes: '289.63K',
  comments: '2.08K',
  dateRange: 'Aug 25, 2024 – Aug 27, 2024',
};

const VILLA_CREATORS = [
  {
    name: 'Yıldız Çağrı Atiksoy',
    handle: 'yildiz_c_atiksoy',
    image: '/rixos-infleuncers/yildiz_cagri_atiksoy.webp',
    posts: 2,
    views: '2.48M',
    engagementRate: '3.83%',
    reach: '2.21M',
    emv: '$145.4K',
    followers: '2.46M',
  },
  {
    name: 'Berk Oktay',
    handle: 'brkokty23',
    image: '/rixos-infleuncers/berk_oktay.webp',
    posts: 1,
    views: '784.93K',
    engagementRate: '2.85%',
    reach: '678.34K',
    emv: '$67K',
    followers: '2.69M',
  },
  {
    name: 'Didem Balçın Aydın',
    handle: 'didembalcin',
    image: '/rixos-infleuncers/didem_balcin_aydin.webp',
    posts: 2,
    views: '453.98K',
    engagementRate: '0.9%',
    reach: '365.91K',
    emv: '$42.2K',
    followers: '1.49M',
  },
];

const VILLA_FEATURED_CONTENT: { src: string; label: string }[] = [
  { src: '/Maldives_content/yildiz_cagr,i_contentjpg.jpg', label: 'Yıldız Çağrı Atiksoy' },
  { src: '/Maldives_content/berk_oktay_content.jpg', label: 'Berk Oktay' },
  { src: '/Maldives_content/Didem_balcin_content.jpg', label: 'Didem Balçın Aydın' },
];

type ParticipatingInfluencer = { name: string; imagePath?: string };

const VILLA_ALL_INFLUENCERS: ParticipatingInfluencer[] = [
  { name: 'Yıldız Çağrı Atiksoy', imagePath: '/rixos-infleuncers/yildiz_cagri_atiksoy.webp' },
  { name: 'Berk Oktay', imagePath: '/rixos-infleuncers/berk_oktay.webp' },
  { name: 'Didem Balçın Aydın', imagePath: '/rixos-infleuncers/didem_balcin_aydin.webp' },
];

export default function VillaResortsMaldivesPage() {
  const { translations } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-black p-4">
            <img src="/marka-logolari/villa-resorts-maldives.png" alt="Villa Resorts Maldives" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Villa Resorts Maldives İş Birliği Raporu</h1>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Gönderi</p>
            <p className="mt-1 text-3xl font-bold text-white">{VILLA_KPIS.posts}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katılımcılar</p>
            <p className="mt-1 text-3xl font-bold text-white">{VILLA_KPIS.influencers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Etkileşim</p>
            <p className="mt-1 text-3xl font-bold text-sky-400">{VILLA_KPIS.engagement}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katma Değer (EMV)</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{VILLA_KPIS.value}</p>
          </div>
        </div>

        <section className="mb-12">
          <div className="space-y-10">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Kampanya Detayları</h3>
              <p className="whitespace-pre-line rounded-xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
                Villa Resorts Maldives iş birliğiyle destinasyonun ayrıcalıklı atmosferini güçlü bir seyahat hikayesine dönüştürdük. Türkiye pazarında marka bilinirliğini güçlendirmeyi hedefleyen tesis, kurgulanan bu iletişim sürecinde; Maldivler&apos;in doğal cazibesini, lüks konaklama deneyimi ve seçkin yaşam tarzı unsurlarıyla bir araya getirerek ilham veren bir içerik dünyası oluşturdu.{'\n\n'}
                Seçkin celebrity profillerinin katılımıyla deneyim odaklı içerik kurgusu, markanın hem yerel hem de global kitlelerde güçlü bir etkileşim yaratmasına katkı sağladı. Üretilen içeriklerde yalnızca resort deneyimi değil; Maldivler&apos;in huzur, ayrıcalık ve kaçış duygusunu yansıtan bütünsel atmosferi de ön plana taşınarak destinasyonun dijital dünyadaki görünürlüğü daha güçlü ve etkileyici bir yapıya kavuştu.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Performans Özeti</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Posts</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.posts}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Katılımcılar</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.creators}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Views</p>
                  <p className="mt-1 text-xl font-bold text-sky-400">{VILLA_PERFORMANCE.views}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagements</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.engagements}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagement Rate</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">{VILLA_PERFORMANCE.engagementRate}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Reach</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.reach}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">EMV</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">{VILLA_PERFORMANCE.emv}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Followers (kitlenin toplamı)</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.followers}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Shares</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.shares}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Likes</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.likes}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Comments</p>
                  <p className="mt-1 text-xl font-bold text-white">{VILLA_PERFORMANCE.comments}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Tarih Aralığı</p>
                  <p className="mt-1 text-sm font-medium text-white">{VILLA_PERFORMANCE.dateRange}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">En Çok Görüntülenme Alan Katılımcılar</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {VILLA_CREATORS.map((c) => (
                  <div key={c.handle} className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <CreatorAvatar name={c.name} imagePath={c.image} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-sm text-zinc-400">@{c.handle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-zinc-400">Posts:</span>
                      <span className="text-white">{c.posts}</span>
                      <span className="text-zinc-400">Views:</span>
                      <span className="text-sky-400">{c.views}</span>
                      <span className="text-zinc-400">ER:</span>
                      <span className="text-white">{c.engagementRate}</span>
                      <span className="text-zinc-400">Reach:</span>
                      <span className="text-white">{c.reach}</span>
                      <span className="text-zinc-400">EMV:</span>
                      <span className="text-emerald-400">{c.emv}</span>
                      <span className="text-zinc-400">Followers:</span>
                      <span className="text-white">{c.followers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-white">Öne Çıkan İçerikler</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {VILLA_FEATURED_CONTENT.map(({ src, label }, index) => {
                  const safeSrc = src
                    .split('/')
                    .map((part, partIndex) => (partIndex === 0 ? part : encodeURIComponent(part)))
                    .join('/');

                  return (
                    <div key={`${label}-${index}`} className="flex flex-col items-center gap-2">
                      <div className="w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                        <div className="aspect-[9/16] w-full">
                          <img src={safeSrc} alt={label} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      </div>
                      <p className="text-center text-sm font-medium text-white">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-10">
              <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Tüm Katılımcılar</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
                {VILLA_ALL_INFLUENCERS.map((person) => (
                  <div key={person.name} className="flex flex-col items-center gap-2">
                    <CreatorAvatar name={person.name} imagePath={person.imagePath} size={64} />
                    <p className="text-center text-sm font-medium text-white">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/is-birliklerimiz"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40"
          >
            İşbirliklerimiz
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-700/80"
          >
            {translations.common.project.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
