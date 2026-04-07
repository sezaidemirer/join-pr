'use client';

import { CTASection } from '@/components/CTASection';
import { resolveLocalHaberLogoPath } from '@/data/haber-platform-logos';
import { useEffect, useMemo, useState } from 'react';
import { cleanPressReleaseTitle } from '@/lib/clean-press-release-title';
import { getMediaReportsApiUrl } from '@/lib/media-reports-api';

type MediaReportHtmlTemplateProps = {
  title: string;
  pdfUrl: string;
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
  /** PDF "III. Öne çıkan online basın yansımaları" (Online Yansımalar tablosundan ayrı) */
  domainsFeatured?: string[];
  /** PDF "Online Yansımalar" tablosu satırları */
  onlineYansimaRows?: Array<{ no: number; outlet: string; url: string }>;
  socialItems: string[];
  socialRows?: Array<{ no: number; outlet: string; url: string }>;
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
  domainsFeatured: [],
  onlineYansimaRows: [],
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

/**
 * Öne çıkan yayın logosu: önce mecra eşlemesi (Supabase `haber-platform-logos` URL),
 * yoksa DuckDuckGo → Google favicon; en sonda domain metni.
 */
function FeaturedOutletLogo({ outlet }: { outlet: string }) {
  const label = outlet.replace(/^www\./i, '').trim();
  const domain = label.toLowerCase();
  const localPath = useMemo(() => resolveLocalHaberLogoPath(outlet), [outlet]);
  const [localBroken, setLocalBroken] = useState(false);
  const [step, setStep] = useState<'ddg' | 'google' | 'text'>('ddg');

  const hasDomain = Boolean(domain && domain.includes('.'));

  const ddgUrl =
    hasDomain && step !== 'text'
      ? `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`
      : '';
  const googleUrl =
    hasDomain && step !== 'text'
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
      : '';

  if (localPath && !localBroken) {
    return (
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white">
        <img
          src={localPath}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain p-1.5"
          loading="lazy"
          onError={() => setLocalBroken(true)}
        />
      </div>
    );
  }

  if (step === 'text' || !hasDomain) {
    return (
      <div
        className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 px-1.5 text-center"
        aria-hidden
      >
        <span className="line-clamp-3 text-[10px] font-semibold leading-tight text-white/95">{label}</span>
      </div>
    );
  }

  const src = step === 'ddg' ? ddgUrl : googleUrl;
  return (
    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white">
      <img
        src={src}
        alt=""
        width={56}
        height={56}
        className="h-full w-full object-contain p-1.5"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setStep((s) => (s === 'ddg' ? 'google' : 'text'))}
      />
    </div>
  );
}

export function MediaReportHtmlTemplate({ title, pdfUrl, updatedAt }: MediaReportHtmlTemplateProps) {
  const [data, setData] = useState<ExtractedReportData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function run() {
      if (active) setLoading(true);
      try {
        const url = getMediaReportsApiUrl(
          `/api/media-reports/extract/?pdfUrl=${encodeURIComponent(pdfUrl)}&title=${encodeURIComponent(title)}`
        );
        const res = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
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

  const social = useMemo(
    () => data.socialItems.slice(0, 30),
    [data.socialItems]
  );
  const socialRows = useMemo(
    () => (Array.isArray(data.socialRows) ? data.socialRows.slice(0, 60) : []),
    [data.socialRows]
  );
  const onlineRows = useMemo(
    () => (Array.isArray(data.onlineYansimaRows) ? data.onlineYansimaRows : []),
    [data.onlineYansimaRows]
  );

  const featuredOutlets = useMemo(() => {
    const f = data.domainsFeatured;
    if (Array.isArray(f) && f.length) return f;
    return [];
  }, [data.domainsFeatured]);

  const allDomains = useMemo(() => {
    if (onlineRows.length) {
      return onlineRows.map((r) => {
        const o = r.outlet.trim();
        if (/^https?:\/\//i.test(o)) return hostFromUrl(o);
        return o.replace(/^www\./, '');
      });
    }
    return data.domains;
  }, [onlineRows, data.domains]);

  const allLinks = useMemo(() => {
    const links = new Set<string>();
    for (const row of onlineRows) {
      if (isHttpUrl(row.url)) links.add(row.url.trim());
    }
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
  }, [data.pages, data.socialItems, onlineRows]);

  const linkForDomain = useMemo(() => {
    return (targetDomain: string): string | null => {
      const d = (targetDomain || '').trim().toLowerCase();
      if (!d) return null;
      for (const row of onlineRows) {
        const out = row.outlet.replace(/^www\./i, '').toLowerCase();
        const host = hostFromUrl(row.url).toLowerCase();
        if (out === d || out.includes(d) || d.includes(out) || host === d || host.includes(d)) {
          return row.url;
        }
      }
      const matched = allLinks.find((u) => hostFromUrl(u).toLowerCase().includes(d));
      if (matched) return matched;
      if (d.includes('.')) return `https://${d}`;
      return null;
    };
  }, [allLinks, onlineRows]);

  const linkForFeaturedOutlet = useMemo(() => {
    return (outlet: string): string => {
      const o = outlet.replace(/^www\./i, '').trim().toLowerCase();
      if (!o) return '';
      const fromTable = linkForDomain(outlet);
      if (fromTable) return fromTable;
      return linkForDomain(o) || (o.includes('.') ? `https://${o}` : '');
    };
  }, [linkForDomain]);

  const updatedText = data.publishedAt || (updatedAt ? new Date(updatedAt).toLocaleDateString('tr-TR') : '');

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h2 className="text-4xl font-semibold text-white md:text-5xl">Medya Yansıma Raporu</h2>
        <p className="text-lg leading-relaxed text-zinc-300 md:text-xl">Basın ve medyadaki yansımalarımızın özeti.</p>
        <div className="min-w-0 w-full rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-400">Basın Bülteni</p>
          <h3
            lang="tr"
            className="font-inter mt-2 max-w-full text-xl font-semibold leading-snug text-white hyphens-none break-normal text-pretty ligatures-none md:text-2xl"
          >
            {loading ? '' : cleanPressReleaseTitle(data.title || '')}
          </h3>
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
                AI Görünürlük Puanı (10 üzerinden), basın bülteninin medya kapsamının ötesine geçerek markanın dijital
                varlığını ölçen özet göstergedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Öne çıkan online basın yansımaları</h3>
        <p className="text-zinc-400">Basın bülteninizi web sitesinde görüntülemek için bir yayına tıklayabilirsiniz.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {(featuredOutlets.length ? featuredOutlets : []).map((outlet) => {
            const href = linkForFeaturedOutlet(outlet);
            const external = Boolean(href);
            return (
              <a
                key={outlet}
                href={href || undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-teal-500/30 hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <FeaturedOutletLogo key={outlet} outlet={outlet} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-teal-400">Türkiye</p>
                    <h4 className="mt-1 font-semibold text-white group-hover:text-teal-300">{outlet}</h4>
                    <p className="mt-1 text-sm text-zinc-500">Kaynak: PDF (Öne çıkan bölümü)</p>
                  </div>
                  <span className="flex-shrink-0 text-sm font-medium text-teal-400 group-hover:underline">Görüntüle →</span>
                </div>
              </a>
            );
          })}
        </div>
        {!loading && !featuredOutlets.length ? (
          <p className="text-sm text-zinc-500">
            Bu PDF içinde ayrı bir &quot;Öne çıkan online basın yansımaları&quot; bölümü algılanamadıysa liste boş
            görünebilir.
          </p>
        ) : null}
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Online yansımalar</h3>
        {!onlineRows.length ? (
          <p className="text-zinc-400">
            Bu liste basın bülteninin yayınlandığı web sitelerini içerir.
            {data.sourceMode === 'annotations' ? ' (PDF link anotasyonlarından alındı)' : ''}
          </p>
        ) : null}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          {onlineRows.length ? (
            <div className="overflow-x-auto">
              <div className="grid min-w-[36rem] grid-cols-[3rem_1fr_2fr] gap-3 border-b border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                <span>No</span>
                <span>Yayın Adı</span>
                <span>Yayın Linki</span>
              </div>
              <ul className="divide-y divide-white/5">
                {onlineRows.map((row) => (
                  <li key={`${row.no}-${row.url}`} className="grid grid-cols-[3rem_1fr_2fr] gap-3 px-4 py-3 text-sm">
                    <span className="text-zinc-400">{row.no}</span>
                    <span className="text-zinc-200">{row.outlet}</span>
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={row.url}
                      className="min-w-0 block truncate text-teal-400 hover:underline"
                    >
                      {row.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Sosyal medya yansımaları</h3>
        <p className="text-zinc-400">Basın bülteninin yanı sıra sosyal medya paylaşımları.</p>
        {socialRows.length ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="grid grid-cols-[3rem_1fr_2fr] gap-3 border-b border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-300">
              <span>No</span>
              <span>Yayın Adı</span>
              <span>Yayın Linki</span>
            </div>
            <ul className="divide-y divide-white/5">
              {socialRows.map((row) => (
                <li key={`${row.no}-${row.url}`} className="grid grid-cols-[3rem_1fr_2fr] gap-3 px-4 py-3 text-sm">
                  <span className="text-zinc-400">{row.no}</span>
                  <span className="text-zinc-200">{row.outlet}</span>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={row.url}
                    className="min-w-0 block truncate text-teal-400 hover:underline"
                  >
                    {row.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
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
                  title={entry}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-teal-500/20 hover:bg-white/10 hover:text-teal-400"
                >
                  <span className="min-w-0 flex-1 truncate">{entry}</span>
                  <span className="text-teal-400">→</span>
                </a>
              </li>
                );
              })()
            ))}
          </ul>
        )}
      </section>

      <CTASection
        title="Birlikte fark yaratalım."
        description="Hedeflerini ve projeni paylaş, Join ekibi 24 saat içinde seninle iletişime geçsin."
        buttonLabel="BİZE ULAŞIN"
        href="/iletisim"
      />
    </div>
  );
}
