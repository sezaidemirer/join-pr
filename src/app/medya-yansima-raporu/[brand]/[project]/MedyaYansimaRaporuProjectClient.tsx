'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MediaReportHtmlTemplate } from '@/components/media/MediaReportHtmlTemplate';
import { MedyaRaporuBanner } from '@/components/MedyaRaporuBanner';
import { getMediaReportsApiUrl } from '@/lib/media-reports-api';

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

type EntryItem = {
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

export function MedyaYansimaRaporuProjectClient({
  brandSlug,
  projectSlug,
}: {
  brandSlug?: string;
  projectSlug?: string;
}) {
  const pathname = usePathname();
  const parts = (pathname || '').split('/').filter(Boolean);
  const pathBrandSlug = parts[1] || '';
  const pathProjectSlug = parts[2] || '';
  const effectiveBrandSlug = pathBrandSlug || brandSlug || '';
  const effectiveProjectSlug = pathProjectSlug || projectSlug || '';

  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [legacyItem, setLegacyItem] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      setError('');
      try {
        // Önce entries tablosundan çoklu rapor listesini dene
        const entriesUrl = getMediaReportsApiUrl(
          `/api/media-reports/entries/?brand=${encodeURIComponent(effectiveBrandSlug)}&project=${encodeURIComponent(effectiveProjectSlug)}`
        );
        const entriesRes = await fetch(entriesUrl, { method: 'GET', mode: 'cors', cache: 'no-store' });
        const entriesData = await entriesRes.json();
        const fetchedEntries: EntryItem[] = Array.isArray(entriesData?.entries) ? entriesData.entries : [];

        if (fetchedEntries.length > 0) {
          if (active) { setEntries(fetchedEntries); setLegacyItem(null); }
          return;
        }

        // Entries yoksa eski tek-rapor API'sine düş
        const itemUrl = getMediaReportsApiUrl(
          `/api/media-reports/item/?brand=${encodeURIComponent(effectiveBrandSlug)}&project=${encodeURIComponent(effectiveProjectSlug)}`
        );
        const itemRes = await fetch(itemUrl, { method: 'GET', mode: 'cors', cache: 'no-store' });
        const itemData = await itemRes.json();
        if (!itemRes.ok) throw new Error(itemData.error || 'Rapor alinamadi');
        if (active) { setLegacyItem((itemData.item as ReportItem | null) ?? null); setEntries([]); }
      } catch (err: any) {
        if (active) setError(err.message ?? 'Rapor alinamadi');
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false; };
  }, [effectiveBrandSlug, effectiveProjectSlug]);

  const brandName = entries[0]?.brand_name || legacyItem?.brand_name || 'Yukleniyor...';
  const brandSlugResolved = entries[0]?.brand_slug || legacyItem?.brand_slug;
  const subBrandName = entries[0]?.sub_brand_name || legacyItem?.sub_brand_name;
  const logoUrl = entries[0]?.sub_brand_logo_url || legacyItem?.sub_brand_logo_url;

  if (!loading && entries.length === 0 && !legacyItem) {
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
        brandName={brandName}
        projectName={subBrandName}
        brandSlug={brandSlugResolved}
        logoUrl={logoUrl}
      />

      {loading ? <div className="py-12 text-center text-zinc-400">Yukleniyor...</div> : null}
      {error ? <div className="py-12 text-center text-rose-300">{error}</div> : null}

      {/* Çoklu rapor listesi */}
      {!loading && entries.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Medya Yansıma Raporları
            <span className="ml-2 text-sm font-normal text-zinc-400">({entries.length} rapor)</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/medya-yansima-raporu/${effectiveBrandSlug}/${effectiveProjectSlug}/${entry.slug || entry.id}`}
                className="group flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-teal-500/30 hover:bg-white/10"
              >
                <span className="text-base font-semibold text-white group-hover:text-teal-300">
                  {entry.title}
                </span>
                {entry.report_date ? (
                  <span className="text-sm text-zinc-400">
                    {new Date(entry.report_date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                ) : null}
                <span className="mt-1 text-xs text-teal-400">Raporu görüntüle →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Eski tek-rapor (geriye dönük uyumluluk) */}
      {!loading && entries.length === 0 && legacyItem?.pdf_url ? (
        <MediaReportHtmlTemplate
          title={legacyItem.sub_brand_name}
          pdfUrl={legacyItem.pdf_url}
          updatedAt={legacyItem.updated_at}
        />
      ) : null}

      {!loading && entries.length === 0 && !legacyItem?.pdf_url && !error ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-zinc-400">
          Bu rapor icin PDF bulunamadi.
        </div>
      ) : null}

      {brandSlugResolved ? (
        <Link
          href={`/medya-yansima-raporu/${brandSlugResolved}`}
          className="text-sm text-teal-400 hover:underline"
        >
          ← {brandName} sayfasina don
        </Link>
      ) : null}
    </div>
  );
}
