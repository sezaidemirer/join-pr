'use client';

import Link from 'next/link';

import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { MEDYA_RAPORU_BRANDS } from '@/data/medya-raporu-brands';

export default function MedyaYansimaRaporuLandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <MedyaRaporuBanner />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MEDYA_RAPORU_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/medya-yansima-raporu/${brand.slug}`}
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
          >
            {brand.logo ? (
              <div className="relative mb-4 flex min-h-[7rem] w-full items-center justify-center rounded-xl bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={brand.name}
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
              {brand.name}
            </span>
            <span className="mt-1 text-sm text-zinc-400">
              Haber yansıma raporları →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
