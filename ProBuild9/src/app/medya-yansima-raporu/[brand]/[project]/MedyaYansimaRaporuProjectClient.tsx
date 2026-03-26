'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { getBrandBySlug, getProjectBySlug } from '@/data/medya-raporu-brands';

const MedyaYansimaRaporuView = dynamic(
  () => import('@/components/views/MedyaYansimaRaporuView').then((m) => m.MedyaYansimaRaporuView),
  { ssr: false, loading: () => <div className="py-12 text-center text-zinc-400">Yükleniyor...</div> }
);

export function MedyaYansimaRaporuProjectClient({
  brandSlug,
  projectSlug,
}: {
  brandSlug: string;
  projectSlug: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const brand = getBrandBySlug(brandSlug);
  const project = getProjectBySlug(brandSlug, projectSlug);

  if (!brand || !project) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-white">Rapor bulunamadı</h1>
        <Link
          href="/medya-yansima-raporu"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-teal-500/50 hover:text-teal-400"
        >
          ← Medya Yansıma Raporu
        </Link>
      </div>
    );
  }

  if (!project.hasReport) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
        <MedyaRaporuBanner
          brandName={brand.name}
          projectName={project.name}
          brandSlug={brand.slug}
        />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-zinc-400">Bu rapor henüz mevcut değil.</p>
          <Link
            href={`/medya-yansima-raporu/${brand.slug}`}
            className="mt-4 inline-block text-sm text-teal-400 hover:underline"
          >
            ← {brand.name} sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <MedyaRaporuBanner
        brandName={brand.name}
        projectName={project.name}
        brandSlug={brand.slug}
      />
      {mounted ? (
        <MedyaYansimaRaporuView />
      ) : (
        <div className="py-12 text-center text-zinc-400">Yükleniyor...</div>
      )}
    </div>
  );
}
