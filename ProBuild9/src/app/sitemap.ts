import type { MetadataRoute } from 'next';
import { slugify } from '@/lib/metadata';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

const baseUrl = 'https://joinpr.com.tr';

type RouteItem = { path: string; priority: number; changefreq: 'weekly' | 'monthly' | 'yearly' };

// Ana sayfalar
const mainRoutes: RouteItem[] = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/join-pr', priority: 0.9, changefreq: 'monthly' },
  { path: '/join-creative', priority: 0.9, changefreq: 'monthly' },
  { path: '/join-social', priority: 0.9, changefreq: 'monthly' },
  { path: '/join-ads', priority: 0.9, changefreq: 'monthly' },
  { path: '/join-lab-ai', priority: 0.9, changefreq: 'monthly' },
  { path: '/join-escapes', priority: 0.9, changefreq: 'monthly' },
  { path: '/hakkimizda', priority: 0.8, changefreq: 'monthly' },
  { path: '/hizmetlerimiz', priority: 0.8, changefreq: 'monthly' },
  { path: '/iletisim', priority: 0.8, changefreq: 'monthly' },
  { path: '/thankyou', priority: 0.5, changefreq: 'yearly' },
  { path: '/reklam/turizm-reklam-ajansi-performans-yonetimi', priority: 0.9, changefreq: 'monthly' },
  { path: '/clinic-reklam-ajansi-performans-yonetimi', priority: 0.9, changefreq: 'monthly' },
  { path: '/is-ortaklarimiz', priority: 0.7, changefreq: 'monthly' },
  { path: '/is-birliklerimiz', priority: 0.7, changefreq: 'monthly' },
  { path: '/is-birliklerimiz/rixos-egypt', priority: 0.6, changefreq: 'monthly' },
  { path: '/is-birliklerimiz/ajet', priority: 0.6, changefreq: 'monthly' },
  { path: '/sitemap', priority: 0.5, changefreq: 'monthly' },
  { path: '/en/about-us', priority: 0.7, changefreq: 'monthly' },
  { path: '/kategori/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/kategori/haberler', priority: 0.7, changefreq: 'weekly' },
];

// Hizmet alt sayfaları
const serviceRoutes: RouteItem[] = [
  { path: '/hizmetlerimiz/digital-pr', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/celebrity-marketing', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/influencer-celebrity-marketing', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/influencer-marketing', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/etkinlik-ve-proje-yonetimi', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/sponsorluk-iletisimi', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/kurumsal-iletisim', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/pazarlama-iletisimi', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/marka-iletisimi', priority: 0.7, changefreq: 'monthly' },
  { path: '/hizmetlerimiz/medya-iliskileri-yonetimi', priority: 0.7, changefreq: 'monthly' },
];

// Haber slug'ları (TR başlıklarından)
function getHaberSlugs(): string[] {
  const cards = (tr.homepage?.cases?.cards || []) as Array<{ title: string }>;
  const slugs = new Set<string>();
  cards.forEach((item) => slugs.add(slugify(item.title)));
  return Array.from(slugs);
}

// Blog slug'ları
function getBlogSlugs(): string[] {
  const blogTr = (tr.homepage?.blog?.cards || []) as Array<{ title: string; link?: string }>;
  const blogEn = (en.homepage?.blog?.cards || []) as Array<{ title: string; link?: string }>;
  const slugs = new Set<string>();
  slugs.add('turizm-reklam-ajansi-performans-yonetimi');
  slugs.add('genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlarini-kesfedin');
  slugs.add('ucak-bileti-fiyatina-avrupa-turlari');
  blogTr.forEach((item) => {
    if (item.link) slugs.add(item.link.replace(/^\//, ''));
    else slugs.add(slugify(item.title));
  });
  blogEn.forEach((item) => {
    if (item.link) slugs.add(item.link.replace(/^\//, ''));
    else slugs.add(slugify(item.title));
  });
  return Array.from(slugs);
}

// Proje slug'ları
function getProjectSlugs(): string[] {
  const items = (tr.homepage?.projects?.items || {}) as Record<string, { slug?: string }>;
  return Object.values(items).map((p) => p.slug).filter((s): s is string => Boolean(s));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const haberSlugs = getHaberSlugs();
  const blogSlugs = getBlogSlugs();
  const projectSlugs = getProjectSlugs();

  const routes: RouteItem[] = [
    ...mainRoutes,
    ...serviceRoutes,
    ...haberSlugs.map((slug) => ({ path: `/haber/${slug}`, priority: 0.6, changefreq: 'monthly' as const })),
    ...blogSlugs.filter((s) => s !== 'turizm-reklam-ajansi-performans-yonetimi').map((slug) => ({ path: `/${slug}`, priority: 0.6, changefreq: 'monthly' as const })),
    ...projectSlugs.map((slug) => ({ path: `/projects/${slug}`, priority: 0.6, changefreq: 'monthly' as const })),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));
}
