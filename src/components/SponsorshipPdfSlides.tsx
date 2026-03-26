'use client';

import { useEffect, useMemo, useState } from 'react';

type SponsorshipPdfSlidesProps = {
  pdfUrl: string;
  projectTitle: string;
  /** DB `updated_at` + id; pdf.js ve tarayici ayni PDF URL’sini cache’lemesin. */
  cacheBust?: string | null;
};

function pdfFetchUrl(baseUrl: string, cacheBust?: string | null) {
  const u = (baseUrl || '').trim();
  if (!u) return '';
  if (!cacheBust) return u;
  const sep = u.includes('?') ? '&' : '?';
  return `${u}${sep}cb=${encodeURIComponent(cacheBust)}`;
}

function SunumLoadingBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className="mx-auto mt-5 w-full max-w-md">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-600 to-sky-400 transition-[width] duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** PDF’yi tarayıcıda sayfa sayfa görsele çevirir; tam ekran slayt hissi (iframe / yerleşik PDF okuyucu yok). */
export function SponsorshipPdfSlides({ pdfUrl, projectTitle, cacheBust }: SponsorshipPdfSlidesProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState('');

  const normalizedPdfUrl = useMemo(() => pdfFetchUrl(pdfUrl, cacheBust), [pdfUrl, cacheBust]);

  useEffect(() => {
    let cancelled = false;
    let objectUrls: string[] = [];
    let indeterminateTimer: ReturnType<typeof setInterval> | null = null;

    async function renderPdf() {
      if (!normalizedPdfUrl) {
        setSlides([]);
        setLoading(false);
        setLoadProgress(0);
        return;
      }

      setLoading(true);
      setLoadProgress(0);
      setError('');

      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const task = pdfjs.getDocument({
          url: normalizedPdfUrl,
          withCredentials: false,
          useSystemFonts: true,
        });

        let bytesProgress = 0;
        task.onProgress = (p: { loaded?: number; total?: number }) => {
          if (cancelled) return;
          const loaded = p.loaded ?? 0;
          const total = p.total ?? 0;
          if (total > 0) {
            bytesProgress = Math.min(78, (loaded / total) * 78);
            setLoadProgress(bytesProgress);
          }
        };

        indeterminateTimer = setInterval(() => {
          if (cancelled) return;
          setLoadProgress((prev) => {
            if (bytesProgress > 0) return Math.max(prev, bytesProgress);
            return Math.min(38, prev + 0.9);
          });
        }, 45);

        const pdf = await task.promise;
        if (indeterminateTimer) {
          clearInterval(indeterminateTimer);
          indeterminateTimer = null;
        }
        if (cancelled) return;

        setLoadProgress((prev) => Math.max(prev, 78));

        const urls: string[] = [];
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i += 1) {
          if (cancelled) return;

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.6 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.width = Math.max(1, Math.floor(viewport.width));
          canvas.height = Math.max(1, Math.floor(viewport.height));

          await page.render({ canvasContext: context, viewport, canvas } as any).promise;

          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.92));
          if (blob) {
            const objectUrl = URL.createObjectURL(blob);
            objectUrls.push(objectUrl);
            urls.push(objectUrl);
          } else {
            urls.push(canvas.toDataURL('image/png'));
          }

          const renderProgress = 78 + (i / numPages) * 22;
          setLoadProgress(Math.min(100, renderProgress));
        }

        if (!cancelled) setSlides(urls);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Sunum sayfalari olusturulamadi.');
      } finally {
        if (indeterminateTimer) clearInterval(indeterminateTimer);
        if (!cancelled) {
          setLoadProgress(100);
          setLoading(false);
        }
      }
    }

    renderPdf();

    return () => {
      cancelled = true;
      if (indeterminateTimer) clearInterval(indeterminateTimer);
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls = [];
    };
  }, [normalizedPdfUrl]);

  if (loading) {
    const pct = Math.max(0, Math.min(100, Math.round(loadProgress)));
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-lg font-medium text-zinc-100">Sunum Yükleniyor Lütfen Bekleyin...</p>
          <p className="mt-4 text-center text-base font-medium tabular-nums tracking-wide text-sky-300/90">
            {pct}%
          </p>
          <SunumLoadingBar progress={loadProgress} />
        </div>
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <p className="text-zinc-300">{error || 'Sunum sayfalari olusturulamadi.'}</p>
          <a
            href={normalizedPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            PDF indir
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {slides.map((src, idx) => (
        <section
          key={`${idx}-${src.slice(0, 40)}`}
          className="relative border-b border-zinc-900 bg-zinc-950 md:flex md:min-h-screen md:items-center md:justify-center md:bg-black md:px-6 md:py-6"
        >
          <div className="w-full md:flex md:h-full md:items-center md:justify-center">
            <img
              src={src}
              alt={`${projectTitle} sayfa ${idx + 1}`}
              className="mx-auto h-auto w-[92%] object-contain sm:w-[90%] md:w-auto md:max-h-[86vh] md:max-w-[80vw] md:rounded-md lg:max-w-[78vw]"
            />
          </div>
          <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[11px] tracking-wide text-zinc-200 sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
            Sayfa {idx + 1} / {slides.length}
          </span>
        </section>
      ))}
    </div>
  );
}
