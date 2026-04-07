'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { getMediaReportsApiUrl } from '@/lib/media-reports-api';

type PublicBrand = {
  slug: string;
  name: string;
  logoUrl: string | null;
  projects: Array<{ slug: string; name: string }>;
};

export default function MedyaYansimaRaporuLandingPage() {
  const [brands, setBrands] = useState<PublicBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(getMediaReportsApiUrl('/api/media-reports/tree/'), {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Raporlar alinamadi');
        if (active) setBrands(Array.isArray(data.brands) ? data.brands : []);
      } catch (err: any) {
        if (active) setError(err.message ?? 'Raporlar alinamadi');
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <MedyaRaporuBanner />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/medya-yansima-raporu/${brand.slug}`}
            className="group flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
          >
            {brand.logoUrl ? (
              <div className="mb-4 w-full min-w-0 overflow-hidden rounded-xl bg-white">
                <div className="relative w-full pb-[50%]">
                  <div className="absolute inset-0 box-border overflow-hidden p-2.5 sm:p-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-full w-full origin-center scale-[4] object-contain object-center"
                    />
                  </div>
                </div>
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
      {loading ? <p className="text-center text-sm text-zinc-400">Yukleniyor...</p> : null}
      {!loading && !brands.length && !error ? (
        <p className="text-center text-sm text-zinc-400">Henuz yayinlanmis rapor bulunmuyor.</p>
      ) : null}
      {error ? <p className="text-center text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
