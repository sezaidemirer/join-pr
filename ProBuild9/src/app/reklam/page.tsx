'use client';

import Link from 'next/link';

const PAGES = [
  { href: '/reklam/sosyal-medya-yonetimi', label: 'Sosyal Medya Yönetimi' },
  { href: '/reklam/ai-lab-web-otomasyon', label: 'AI Lab Web Otomasyon' },
  { href: '/reklam/kreatif-produksiyon', label: 'Kreatif Prodüksiyon' },
  { href: '/reklam/pr-gorunurluk', label: 'PR Görünürlük' },
  { href: '/reklam/turizm-reklam-ajansi-performans-yonetimi', label: 'Turizm Reklam Ajansı' },
  { href: '/clinic-reklam-ajansi-performans-yonetimi', label: 'Klinik Reklam Ajansı' },
];

export default function ReklamIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold text-white">
          Reklam Landing Sayfaları
        </h1>
        <p className="mb-10 text-zinc-400">
          Tüm reklam sayfalarına hızlı erişim
        </p>
        <ul className="space-y-3">
          {PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="block rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white transition-colors hover:border-teal-500/50 hover:bg-white/10"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-zinc-500">
          Local: <code className="rounded bg-zinc-800 px-1.5 py-0.5">http://localhost:3000/reklam</code>
        </p>
      </div>
    </div>
  );
}
