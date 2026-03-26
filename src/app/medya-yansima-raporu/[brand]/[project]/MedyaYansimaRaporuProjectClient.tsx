'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MediaReportHtmlTemplate } from '@/components/media/MediaReportHtmlTemplate';
import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
type ReportItem = {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  brand_logo_url?: string | null;
  sub_brand_id: string;
  sub_brand_name: string;
  sub_brand_slug: string;
  sub_brand_logo_url?: string | null;
  pdf_url: string;
  updated_at?: string;
};

export function MedyaYansimaRaporuProjectClient({
  brandSlug,
  projectSlug,
}: {
  brandSlug: string;
  projectSlug: string;
}) {
  const [item, setItem] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const url = `/api/media-reports/item?brand=${encodeURIComponent(brandSlug)}&project=${encodeURIComponent(projectSlug)}`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Rapor alinamadi');
        if (active) setItem((data.item as ReportItem | null) ?? null);
      } catch (err: any) {
        if (active) setError(err.message ?? 'Rapor alinamadi');
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [brandSlug, projectSlug]);

  if (!loading && !item) {
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

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <MedyaRaporuBanner
        brandName={item?.brand_name || 'Yukleniyor...'}
        projectName={item?.sub_brand_name}
        brandSlug={item?.brand_slug}
      />
      {loading ? <div className="py-12 text-center text-zinc-400">Yukleniyor...</div> : null}
      {error ? <div className="py-12 text-center text-rose-300">{error}</div> : null}
      {item?.pdf_url ? (
        <MediaReportHtmlTemplate
          title={item.sub_brand_name}
          pdfUrl={item.pdf_url}
          logoUrl={item.sub_brand_logo_url}
          updatedAt={item.updated_at}
        />
      ) : null}
      {!loading && !item?.pdf_url && !error ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-zinc-400">
          Bu rapor icin PDF bulunamadi.
        </div>
      ) : null}
      {item ? (
        <Link
          href={`/medya-yansima-raporu/${item.brand_slug}`}
          className="text-sm text-teal-400 hover:underline"
        >
          ← {item.brand_name} sayfasina don
        </Link>
      ) : null}
    </div>
  );
}
