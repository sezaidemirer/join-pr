'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { getMediaReportsApiUrl } from '@/lib/media-reports-api';

type PublicProject = {
  slug: string;
  name: string;
  logoUrl: string | null;
};

type PublicBrand = {
  slug: string;
  name: string;
  logoUrl: string | null;
  projects: PublicProject[];
};

export function MedyaYansimaRaporuBrandClient({ brandSlug }: { brandSlug?: string }) {
  const pathname = usePathname();
  const pathBrandSlug = (pathname || '').split('/').filter(Boolean)[1] || '';
  const effectiveBrandSlug = pathBrandSlug || brandSlug || '';
  const [brand, setBrand] = useState<PublicBrand | null>(null);
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
        const brands = Array.isArray(data.brands) ? (data.brands as PublicBrand[]) : [];
        const found = brands.find((x) => x.slug === effectiveBrandSlug) || null;
        if (active) setBrand(found);
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
  }, [effectiveBrandSlug]);

  if (!loading && !brand) {
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
      <MedyaRaporuBanner brandName={brand?.name || 'Yukleniyor...'} brandSlug={brand?.slug} />

      {loading ? <div className="py-12 text-center text-zinc-400">Yukleniyor...</div> : null}
      {error ? <div className="py-12 text-center text-rose-300">{error}</div> : null}

      {brand && brand.projects.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.projects.map((project) => (
            <Link
              key={project.slug}
              href={`/medya-yansima-raporu/${brand.slug}/${project.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
            >
              {project.logoUrl ? (
                <div className="mb-4 flex min-h-[7rem] items-center justify-center rounded-xl bg-white p-4 sm:min-h-[8rem] sm:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.logoUrl} alt={project.name} className="max-h-[5.75rem] w-auto object-contain sm:max-h-[6.5rem]" />
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
