import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.joinpr.com';

const routes = [
  '',
  '/join-pr',
  '/join-creative',
  '/join-social',
  '/join-ads',
  '/join-lab-ai',
  '/join-escapes',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}

