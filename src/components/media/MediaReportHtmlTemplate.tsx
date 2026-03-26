'use client';

import { CTASection } from '@/components/CTASection';
import { useEffect, useMemo, useState } from 'react';

type MediaReportHtmlTemplateProps = {
  title: string;
  pdfUrl: string;
  logoUrl?: string | null;
  updatedAt?: string | null;
};

type ExtractedReportData = {
  title: string | null;
  publishedAt: string | null;
  aiScore: string | null;
  coverageCount: string | null;
  adValue: string | null;
  journalistsReached: string | null;
  topReach: string | null;
  domains: string[];
  socialItems: string[];
  pages: Array<{ pageNumber: number; lines: string[]; links: string[] }>;
  sourceMode?: 'text' | 'annotations' | 'fallback';
};

const EMPTY_DATA: ExtractedReportData = {
  title: null,
  publishedAt: null,
  aiScore: null,
  coverageCount: null,
  adValue: null,
  journalistsReached: null,
  topReach: null,
  domains: [],
  socialItems: [],
  pages: [],
  sourceMode: 'fallback',
};

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test((value || '').trim());
}

function hostFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Kaynak';
  }
}

export function MediaReportHtmlTemplate({ title, pdfUrl, logoUrl, updatedAt }: MediaReportHtmlTemplateProps) {
  const [data, setData] = useState<ExtractedReportData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function run() {
      if (active) setLoading(true);
      try {
        const url = `/api/media-reports/extract?pdfUrl=${encodeURIComponent(pdfUrl)}&title=${encodeURIComponent(title)}`;
        const res = await fetch(url, { cache: 'no-store' });
        const json = await res.json();
        if (!active) return;
        const extracted = (json?.data ?? null) as ExtractedReportData | null;
        if (res.ok && extracted) {
          setData(extracted);
          setLoading(false);
          return;
        }
        setData({ ...EMPTY_DATA, title });
        setLoading(false);
      } catch {
        if (active) {
          setData({ ...EMPTY_DATA, title });
          setLoading(false);
        }
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [pdfUrl, title]);

  const featured = useMemo(
    () => data.domains.slice(0, 4),
    [data.domains]
  );
  const social = useMemo(
    () => data.socialItems.slice(0, 30),
    [data.socialItems]
  );
  const allDomains = useMemo(
    () => data.domains.slice(0, 120),
    [data.domains]
  );
  const allLinks = useMemo(() => {
    const links = new Set<string>();
    for (const page of data.pages) {
      for (const link of page.links || []) {
        if (isHttpUrl(link)) links.add(link);
      }
      for (const line of page.lines || []) {
        const m = line.match(/https?:\/\/[^\s]+/gi) || [];
        for (const u of m) {
          if (isHttpUrl(u)) links.add(u);
        }
      }
    }
    for (const s of data.socialItems || []) {
      if (isHttpUrl(s)) links.add(s);
    }
    return Array.from(links);
  }, [data.pages, data.socialItems]);

  const linkForDomain = useMemo(() => {
    return (targetDomain: string): string | null => {
      const d = (targetDomain || '').trim().toLowerCase();
      if (!d) return null;
      const matched = allLinks.find((u) => hostFromUrl(u).toLowerCase().includes(d));
      if (matched) return matched;
      if (d.includes('.')) return `https://${d}`;
      return null;
    };
  }, [allLinks]);

  const updatedText = data.publishedAt || (updatedAt ? new Date(updatedAt).toLocaleDateString('tr-TR') : '');

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-200">Ana Sayfa</p>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">Medya Yansıma Raporu</h2>
        <p className="text-lg leading-relaxed text-zinc-300 md:text-xl">Basın ve medyadaki yansımalarımızın özeti.</p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-400">Basın Bülteni</p>
          <h3 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{loading ? '' : data.title || ''}</h3>
          <p className="mt-3 text-zinc-400">{loading || !updatedText ? '' : `Dağıtım tarihi: ${updatedText} · Hedef ülke: Türkiye · Dil: Türkçe`}</p>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Genel basın yansıma özeti</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">En çok kişiye ulaştıran</p>
            <p className="mt-1 text-lg font-semibold text-white">{loading ? '' : data.topReach || ''}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Yansıma sayısı</p>
            <p className="mt-1 text-lg font-semibold text-white">{loading ? '' : data.coverageCount || ''}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Reklam eşdeğeri</p>
            <p className="mt-1 text-lg font-semibold text-white">{loading ? '' : data.adValue ? `$${data.adValue}` : ''}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gazeteciye ulaştırıldı</p>
            <p className="mt-1 text-lg font-semibold text-white">{loading ? '' : data.journalistsReached || ''}</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">AI Görünürlük Puanı</h3>
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-sky-500/10 p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 px-6 py-4 text-2xl font-bold tabular-nums text-teal-300 whitespace-nowrap md:text-3xl">
              {loading ? '' : data.aiScore ? `${data.aiScore} / 10` : ''}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-zinc-300">
                AI Görünürlük Puanı, basın bülteninin medya kapsamının ötesine geçerek markanın dijital varlığını ölçen
                özet göstergedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Öne çıkan online basın yansımaları</h3>
        <p className="text-zinc-400">Basın bülteninizi web sitesinde görüntülemek için bir yayına tıklayabilirsiniz.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((outlet) => (
            (() => {
              const href = linkForDomain(outlet) || '';
              const external = Boolean(href);
              return (
            <a
              key={outlet}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-teal-400">Türkiye</p>
                  <h4 className="mt-1 font-semibold text-white group-hover:text-teal-300">{outlet}</h4>
                  <p className="mt-1 text-sm text-zinc-500">Kaynak: PDF verisi</p>
                </div>
                <span className="flex-shrink-0 text-sm font-medium text-teal-400 group-hover:underline">Görüntüle →</span>
              </div>
            </a>
              );
            })()
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Online yansımalar</h3>
        <p className="text-zinc-400">
          Bu liste basın bülteninin yayınlandığı tüm web sitelerini içerir.
          {data.sourceMode === 'annotations' ? ' (PDF link anotasyonlarından alındı)' : ''}
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allDomains.map((d, i) => (
              <li key={`${d}-${i}`} className="flex items-center gap-2 text-sm">
                <span className="flex-shrink-0 font-mono text-zinc-500">{i + 1}.</span>
                <a
                  href={linkForDomain(d) || `https://${d}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-teal-400 hover:underline"
                >
                  {d}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Sosyal medya yansımaları</h3>
        <p className="text-zinc-400">Basın bülteninin yanı sıra sosyal medya paylaşımları.</p>
        <ul className="space-y-2">
          {social.map((entry) => (
            (() => {
              const direct = isHttpUrl(entry) ? entry : null;
              const byDomain = direct ? null : linkForDomain(hostFromUrl(entry));
              const href = direct || byDomain || '';
              const external = Boolean(href);
              return (
            <li key={entry}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-teal-500/20 hover:bg-white/10 hover:text-teal-400"
              >
                <span>{entry}</span>
                <span className="text-teal-400">→</span>
              </a>
            </li>
              );
            })()
          ))}
        </ul>
      </section>

      {logoUrl ? (
        <div className="mt-2 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt={title} className="max-h-20 w-auto rounded-xl bg-white p-3 object-contain" />
        </div>
      ) : null}

      <CTASection
        title="Birlikte fark yaratalım."
        description="Hedeflerini ve projeni paylaş, Join ekibi 24 saat içinde seninle iletişime geçsin."
        buttonLabel="BİZE ULAŞIN"
        href="/iletisim"
      />
    </div>
  );
}
