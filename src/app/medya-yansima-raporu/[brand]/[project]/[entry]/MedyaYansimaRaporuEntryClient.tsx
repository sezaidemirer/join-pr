'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MediaReportHtmlTemplate } from '@/components/media/MediaReportHtmlTemplate';
import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { getMediaReportsApiUrl } from '@/lib/media-reports-api';

type EntryDetail = {
  id: string;
  sub_brand_id: string;
  title: string;
  slug: string;
  pdf_url: string;
  report_date: string | null;
  brand_name: string;
  brand_slug: string;
  sub_brand_name: string;
  sub_brand_slug: string;
  sub_brand_logo_url: string | null;
};

export function MedyaYansimaRaporuEntryClient({
  brandSlug,
  projectSlug,
  entryId,
}: {
  brandSlug?: string;
  projectSlug?: string;
  entryId?: string;
}) {
  const pathname = usePathname();
  const parts = (pathname || '').split('/').filter(Boolean);
  const pathBrandSlug = parts[1] || '';
  const pathProjectSlug = parts[2] || '';
  const pathEntryParam = parts[3] || '';

  const effectiveBrandSlug = pathBrandSlug || brandSlug || '';
  const effectiveProjectSlug = pathProjectSlug || projectSlug || '';
  const effectiveEntryParam = pathEntryParam || entryId || '';

  const [entry, setEntry] = useState<EntryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!effectiveEntryParam) { setLoading(false); return; }
    let active = true;
    async function run() {
      setLoading(true);
      setError('');
      try {
        // UUID mi yoksa slug mu? UUID formatı: 8-4-4-4-12 hex
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(effectiveEntryParam);

        let found: EntryDetail | null = null;

        if (isUuid) {
          // UUID ile geriye dönük uyumluluk: önce listeyi çek, içinde bul
          const listUrl = getMediaReportsApiUrl(
            `/api/media-reports/entries/?brand=${encodeURIComponent(effectiveBrandSlug)}&project=${encodeURIComponent(effectiveProjectSlug)}`
          );
          const listRes = await fetch(listUrl, { method: 'GET', mode: 'cors', cache: 'no-store' });
          const listData = await listRes.json();
          const list: EntryDetail[] = Array.isArray(listData?.entries) ? listData.entries : [];
          found = list.find((e) => e.id === effectiveEntryParam) ?? null;
        } else {
          // Slug ile direkt çek
          const url = getMediaReportsApiUrl(
            `/api/media-reports/entries/?brand=${encodeURIComponent(effectiveBrandSlug)}&project=${encodeURIComponent(effectiveProjectSlug)}&entry=${encodeURIComponent(effectiveEntryParam)}`
          );
          const res = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Rapor alinamadi');
          found = (data.entry as EntryDetail | null) ?? null;
        }

        if (active) setEntry(found);
      } catch (err: any) {
        if (active) setError(err.message ?? 'Rapor alinamadi');
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false; };
  }, [effectiveEntryParam, effectiveBrandSlug, effectiveProjectSlug]);

  if (!loading && !entry) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-white">Rapor bulunamadı</h1>
        <Link
          href={`/medya-yansima-raporu/${effectiveBrandSlug}/${effectiveProjectSlug}`}
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-teal-500/50 hover:text-teal-400"
        >
          ← Tüm raporlara dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <MedyaRaporuBanner
        brandName={entry?.brand_name || 'Yukleniyor...'}
        projectName={entry?.sub_brand_name}
        brandSlug={entry?.brand_slug}
        logoUrl={entry?.sub_brand_logo_url}
      />

      {loading ? <div className="py-12 text-center text-zinc-400">Yukleniyor...</div> : null}
      {error ? <div className="py-12 text-center text-rose-300">{error}</div> : null}

      {entry?.pdf_url ? (
        <MediaReportHtmlTemplate
          title={entry.title}
          pdfUrl={entry.pdf_url}
          updatedAt={entry.report_date ?? undefined}
        />
      ) : null}

      {!loading && !error ? (
        <Link
          href={`/medya-yansima-raporu/${effectiveBrandSlug}/${effectiveProjectSlug}`}
          className="text-sm text-teal-400 hover:underline"
        >
          ← {entry?.sub_brand_name || 'Tüm raporlara'} dön
        </Link>
      ) : null}
    </div>
  );
}
