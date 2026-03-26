'use client';

import Link from 'next/link';

import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { getBrandBySlug } from '@/data/medya-raporu-brands';

export function MedyaYansimaRaporuBrandClient({ brandSlug }: { brandSlug: string }) {
  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-white">Marka bulunamadı</h1>
        <Link
          href="/medya-yansima-raporu"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-teal-500/50 hover:text-teal-400"
        >
          ← Medya Yansıma Raporu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <MedyaRaporuBanner brandName={brand.name} brandSlug={brand.slug} />

      {brand.projects.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.projects.map((project) => (
            <Link
              key={project.slug}
              href={`/medya-yansima-raporu/${brand.slug}/${project.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
            >
              {project.logo ? (
                <div className="relative mb-4 flex min-h-[7rem] w-full items-center justify-center rounded-xl bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="max-h-[5.5rem] w-full max-w-[280px] object-contain object-center"
                    width={280}
                    height={88}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : null}
              <span className="text-lg font-semibold text-white group-hover:text-teal-300">
                {project.name}
              </span>
              <span className="mt-1 text-sm text-zinc-400">
                Raporu görüntüle →
              </span>
            </Link>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-zinc-400">
            Bu marka için raporlar yakında eklenecek.
          </p>
          <Link
            href="/medya-yansima-raporu"
            className="mt-4 inline-block text-sm text-teal-400 hover:underline"
          >
            ← Tüm markalara dön
          </Link>
        </div>
      )}
    </div>
  );
}
