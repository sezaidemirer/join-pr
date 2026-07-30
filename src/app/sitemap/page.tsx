import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLocale } from '@/lib/metadata';

const baseUrl = 'https://joinpr.com.tr';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  return {
    title: locale === 'tr' ? 'Site Haritası | Join PR' : 'Sitemap | Join PR',
    description: locale === 'tr' 
      ? 'Join PR sitesindeki tüm sayfaların listesi.'
      : 'Complete list of all pages on Join PR website.',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function SitemapPage() {
  const mainPages = [
    { path: '/', title: { tr: 'Ana Sayfa', en: 'Home' }, icon: '🏠' },
    { path: '/join-pr', title: { tr: 'Join PR', en: 'Join PR' }, icon: '📢' },
    { path: '/join-creative', title: { tr: 'Join Creative', en: 'Join Creative' }, icon: '🎨' },
    { path: '/join-social', title: { tr: 'Join Social', en: 'Join Social' }, icon: '📱' },
    { path: '/join-ads', title: { tr: 'Join Ads', en: 'Join Ads' }, icon: '📊' },
    { path: '/join-lab-ai', title: { tr: 'Join AI Lab', en: 'Join AI Lab' }, icon: '🤖' },
    { path: '/join-escapes', title: { tr: 'Join Escapes', en: 'Join Escapes' }, icon: '✈️' },
    { path: '/hakkimizda', title: { tr: 'Hakkımızda', en: 'About Us' }, icon: '👥' },
    { path: '/hizmetlerimiz', title: { tr: 'Hizmetlerimiz', en: 'Services' }, icon: '⚙️' },
    { path: '/iletisim', title: { tr: 'İletişim', en: 'Contact' }, icon: '📧' },
    { path: '/is-ortaklarimiz', title: { tr: 'İş Ortaklarımız', en: 'Partners' }, icon: '🤝' },
    { path: '/is-birliklerimiz', title: { tr: 'İşbirliklerimiz', en: 'Our Collaborations' }, icon: '🤝' },
    { path: '/reklam', title: { tr: 'Reklam', en: 'Advertising' }, icon: '📣' },
    { path: '/en/about-us', title: { tr: 'About Us (EN)', en: 'About Us' }, icon: '👥' },
    { path: '/kategori/blog', title: { tr: 'Blog', en: 'Blog' }, icon: '📝' },
    { path: '/kategori/haberler', title: { tr: 'Haberler', en: 'News' }, icon: '📰' },
  ];

  const adRoutes = [
    { path: '/reklam/turizm-reklam-ajansi-performans-yonetimi', title: { tr: 'Turizm Reklam Ajansı Performans Yönetimi', en: 'Tourism Ad Agency Performance Management' } },
    { path: '/reklam/pr-gorunurluk', title: { tr: 'PR & Görünürlük', en: 'PR & Visibility' } },
    { path: '/reklam/kreatif-produksiyon', title: { tr: 'Kreatif Prodüksiyon', en: 'Creative Production' } },
    { path: '/reklam/sosyal-medya-yonetimi', title: { tr: 'Sosyal Medya Yönetimi', en: 'Social Media Management' } },
    { path: '/reklam/ai-lab-web-otomasyon', title: { tr: 'AI Lab & Web Otomasyon', en: 'AI Lab & Web Automation' } },
    { path: '/clinic-reklam-ajansi-performans-yonetimi', title: { tr: 'Clinic Reklam Ajansı Performans Yönetimi', en: 'Clinic Ad Agency Performance Management' } },
  ];

  const collaborationRoutes = [
    { path: '/is-birliklerimiz/rixos-egypt', title: { tr: 'Rixos Egypt', en: 'Rixos Egypt' } },
    { path: '/is-birliklerimiz/ajet', title: { tr: 'AJet', en: 'AJet' } },
    { path: '/is-birliklerimiz/marriott-dead-sea', title: { tr: 'Marriott Dead Sea', en: 'Marriott Dead Sea' } },
    { path: '/is-birliklerimiz/prontotour', title: { tr: 'Prontotour', en: 'Prontotour' } },
    { path: '/is-birliklerimiz/swissotel-sharm-el-sheikh', title: { tr: 'Swissotel Sharm El Sheikh', en: 'Swissotel Sharm El Sheikh' } },
    { path: '/is-birliklerimiz/villa-resorts-maldives', title: { tr: 'Villa Resorts Maldives', en: 'Villa Resorts Maldives' } },
    { path: '/royal-saray-resort-bahrain', title: { tr: 'Royal Saray Resort Bahrain', en: 'Royal Saray Resort Bahrain' } },
  ];

  const servicePages = [
    { path: '/hizmetlerimiz/digital-pr', title: { tr: 'Dijital PR', en: 'Digital PR' } },
    { path: '/hizmetlerimiz/celebrity-marketing', title: { tr: 'Celebrity Marketing', en: 'Celebrity Marketing' } },
    { path: '/hizmetlerimiz/influencer-celebrity-marketing', title: { tr: 'Influencer & Celebrity Marketing', en: 'Influencer & Celebrity Marketing' } },
    { path: '/hizmetlerimiz/influencer-marketing', title: { tr: 'Influencer Marketing', en: 'Influencer Marketing' } },
    { path: '/hizmetlerimiz/etkinlik-ve-proje-yonetimi', title: { tr: 'Etkinlik ve Proje Yönetimi', en: 'Event & Project Management' } },
    { path: '/hizmetlerimiz/sponsorluk-iletisimi', title: { tr: 'Sponsorluk İletişimi', en: 'Sponsorship Communication' } },
    { path: '/hizmetlerimiz/kurumsal-iletisim', title: { tr: 'Kurumsal İletişim', en: 'Corporate Communication' } },
    { path: '/hizmetlerimiz/pazarlama-iletisimi', title: { tr: 'Pazarlama İletişimi', en: 'Marketing Communication' } },
    { path: '/hizmetlerimiz/marka-iletisimi', title: { tr: 'Marka İletişimi', en: 'Brand Communication' } },
    { path: '/hizmetlerimiz/medya-iliskileri-yonetimi', title: { tr: 'Medya İlişkileri Yönetimi', en: 'Media Relations Management' } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 px-6 py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_60%)]" />
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-16 w-40 md:h-20 md:w-48">
              <Image
                src="/join_pr_logo_offical2.png"
                alt="Join PR Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Site Haritası
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-300 md:text-xl">
            Join PR ekosistemindeki tüm sayfalara kolayca erişin
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Ana Sayfalar */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-8 shadow-xl shadow-black/30 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-teal-500/20 to-sky-500/20 p-2">
                <span className="text-2xl">🏠</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Ana Sayfalar</h2>
            </div>
            <ul className="space-y-3">
              {mainPages.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    className="group flex items-center gap-3 rounded-lg border border-white/5 bg-zinc-900/50 p-3 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/10"
                  >
                    <span className="text-xl transition-transform group-hover:scale-110">
                      {page.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-sky-300">
                        {page.title.tr}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {baseUrl}{page.path}
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hizmet Sayfaları */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-8 shadow-xl shadow-black/30 backdrop-blur-sm md:col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-teal-500/20 to-sky-500/20 p-2">
                <span className="text-2xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Hizmetlerimiz</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {servicePages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="group rounded-lg border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-sky-300">
                        {page.title.tr}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {baseUrl}{page.path}
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Reklam Sayfaları */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-8 shadow-xl shadow-black/30 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-teal-500/20 to-sky-500/20 p-2">
                <span className="text-2xl">📣</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Reklam</h2>
            </div>
            <ul className="space-y-3">
              {adRoutes.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    className="group flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/50 p-3 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/10"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-sky-300">
                        {page.title.tr}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {baseUrl}{page.path}
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İşbirliklerimiz Detay Sayfaları */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-8 shadow-xl shadow-black/30 backdrop-blur-sm md:col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-teal-500/20 to-sky-500/20 p-2">
                <span className="text-2xl">🤝</span>
              </div>
              <h2 className="text-2xl font-bold text-white">İşbirliklerimiz</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {collaborationRoutes.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="group rounded-lg border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-sky-500/30 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-sky-300">
                        {page.title.tr}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {baseUrl}{page.path}
                      </div>
                    </div>
                    <svg
                      className="h-5 w-5 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* XML Sitemap Card */}
        <div className="mt-12 rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-8 shadow-xl shadow-teal-500/20">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">XML Sitemap</h2>
              <p className="text-zinc-300">
                Arama motorları için XML formatında site haritası
              </p>
              <div className="mt-2 text-sm text-zinc-400">
                {baseUrl}/sitemap.xml
              </div>
            </div>
            <Link
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-500/30 transition-transform hover:-translate-y-1"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              XML Sitemap&apos;i Görüntüle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
