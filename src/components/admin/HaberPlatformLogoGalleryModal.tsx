'use client';

import { useEffect, useState } from 'react';

import { HaberPlatformGalleryThumb } from '@/components/admin/HaberPlatformGalleryThumb';
import { HABER_PLATFORM_LOGOS } from '@/data/haber-platform-logos';

type ArchiveFile = { path: string; label: string; sourceUrl?: string };
type UsedLogo = { url: string; label: string };

export type HaberPlatformLogoGalleryModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Logo URL veya public path form alanına yazılır */
  onSelect: (imageUrl: string) => void;
  /** Galeri kapanır; gizli file input tetiklenir — `platformGalleryPick` korunmalı */
  onRequestUploadFromDisk: () => void;
};

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 0 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HaberPlatformLogoGalleryModal({
  open,
  onClose,
  title = 'Haber platform logosu seç',
  onSelect,
  onRequestUploadFromDisk,
}: HaberPlatformLogoGalleryModalProps) {
  const [logoArchiveFiles, setLogoArchiveFiles] = useState<ArchiveFile[]>([]);
  const [logoArchiveDb, setLogoArchiveDb] = useState<UsedLogo[]>([]);
  const [hiddenPlatformPaths, setHiddenPlatformPaths] = useState<Set<string>>(() => new Set());
  const [deleteBusy, setDeleteBusy] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  async function loadArchiveData() {
    try {
      const res = await fetch('/api/admin/media-reports/logo-archive?scope=haber-platform', {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = await res.json();
      const manifest = Array.isArray(data.manifest) ? data.manifest : [];
      const used = Array.isArray(data.usedLogos) ? data.usedLogos : [];
      setLogoArchiveFiles(
        manifest
          .map((e: { path?: string; label?: string; sourceUrl?: string }) => ({
            path: String(e.path || ''),
            label: String(e.label || e.path || ''),
            sourceUrl: e.sourceUrl ? String(e.sourceUrl) : undefined,
          }))
          .filter((e: ArchiveFile) => Boolean(e.path))
      );
      setLogoArchiveDb(
        used
          .map((e: { url?: string; label?: string }) => ({
            url: String(e.url || ''),
            label: String(e.label || e.url || ''),
          }))
          .filter((e: UsedLogo) => Boolean(e.url))
      );
    } catch {
      /* yalnızca statik haber listesi kalır */
    }
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setDeleteMessage('');
    (async () => {
      await loadArchiveData();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  function pick(url: string) {
    onSelect(url);
    onClose();
  }

  async function deleteArchiveEntry(archivePath: string) {
    if (
      !window.confirm(
        'Bu kayit arsivden kaldirilacak. Kaynak URL haber-platform-logos bucket indaysa dosya Supabase uzerinden de silinir. Devam?'
      )
    ) {
      return;
    }
    const busyKey = `archive:${archivePath}`;
    setDeleteBusy(busyKey);
    setDeleteMessage('');
    try {
      const res = await fetch('/api/admin/haber-platform-logos/delete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'archive', path: archivePath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Silinemedi');
      await loadArchiveData();
      setDeleteMessage('Arsiv kaydi silindi.');
    } catch (e) {
      setDeleteMessage(e instanceof Error ? e.message : 'Silme hatasi');
    } finally {
      setDeleteBusy(null);
    }
  }

  async function deleteBucketObject(url: string, options?: { hideStaticPath?: string }) {
    if (!window.confirm('Bu logo Supabase haber-platform-logos bucket indan kalici olarak silinsin mi?')) {
      return;
    }
    const busyKey = `obj:${url}`;
    setDeleteBusy(busyKey);
    setDeleteMessage('');
    try {
      const res = await fetch('/api/admin/haber-platform-logos/delete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'object', url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Silinemedi');
      setLogoArchiveDb((prev) => prev.filter((x) => x.url !== url));
      if (options?.hideStaticPath) {
        const p = options.hideStaticPath;
        setHiddenPlatformPaths((prev) => {
          const next = new Set(prev);
          next.add(p);
          return next;
        });
      }
      setDeleteMessage('Supabase uzerindeki dosya silindi.');
    } catch (e) {
      setDeleteMessage(e instanceof Error ? e.message : 'Silme hatasi');
    } finally {
      setDeleteBusy(null);
    }
  }

  if (!open) return null;

  const visibleHaberLogos = HABER_PLATFORM_LOGOS.filter(
    (logo) => Boolean(logo.path) && !hiddenPlatformPaths.has(logo.path)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="haber-logo-gallery-title"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-600 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-700 px-4 py-3">
          <h2 id="haber-logo-gallery-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Kapat
          </button>
        </div>
        <ul className="mt-0 list-none space-y-2 px-4 pt-2 text-xs text-zinc-400">
          <li className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
              •
            </span>
            <p>
              Daha önce haber kayıtlarında kullanılan mecra logoları (yalnızca{' '}
              <code className="text-zinc-300">haber-platform-logos</code> veya sitedeki mecra dosyaları) ile aşağıdaki liste.
            </p>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
              •
            </span>
            <p>
              İstersen alttan <span className="font-semibold text-zinc-300">&quot;Bilgisayardan yükle&quot;</span> ile
              yükleyebilirsin.
            </p>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
              •
            </span>
            <p>
              Çöp kutusu yalnızca Supabase bucket&apos;taki (veya arşiv + kaynak URL eşleşen) dosyalar için geçerlidir.
            </p>
          </li>
        </ul>
        {deleteMessage ? (
          <p className="shrink-0 px-4 pt-1 text-xs text-amber-200/90">{deleteMessage}</p>
        ) : null}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-3">
          {logoArchiveFiles.length ? (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">
                Site arşivi (sub-brand-logos-archive)
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {logoArchiveFiles.map((logo) => (
                  <div
                    key={logo.path}
                    className="relative rounded-xl border border-zinc-600 bg-white p-2 shadow-sm"
                  >
                    <button
                      type="button"
                      aria-label="Arsiv logosunu sil"
                      disabled={deleteBusy !== null}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void deleteArchiveEntry(logo.path);
                      }}
                      className="absolute right-1 top-1 z-10 rounded-md bg-rose-700/95 p-1.5 text-white shadow hover:bg-rose-600 disabled:opacity-40"
                    >
                      <TrashIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => pick(logo.path)}
                      className="flex w-full flex-col items-center justify-center gap-1.5 pt-5 text-left transition hover:opacity-90"
                    >
                      <HaberPlatformGalleryThumb
                        src={logo.path.startsWith('http') ? logo.path : encodeURI(logo.path)}
                        label={logo.label}
                      />
                      <span className="line-clamp-2 w-full text-center text-[10px] font-medium leading-tight text-zinc-800">
                        {logo.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {logoArchiveDb.length ? (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">
                Daha önce kayıtlarda kullanılan logolar
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {logoArchiveDb.map((row) => (
                  <div key={row.url} className="relative rounded-xl border border-zinc-600 bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      aria-label="Logoyu Supabase'den sil"
                      disabled={deleteBusy !== null}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void deleteBucketObject(row.url);
                      }}
                      className="absolute right-1 top-1 z-10 rounded-md bg-rose-700/95 p-1.5 text-white shadow hover:bg-rose-600 disabled:opacity-40"
                    >
                      <TrashIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => pick(row.url)}
                      className="flex w-full flex-col items-center justify-center gap-1.5 pt-5 text-left transition hover:opacity-90"
                    >
                      <HaberPlatformGalleryThumb
                        src={row.url.startsWith('http') ? row.url : encodeURI(row.url)}
                        label={row.label}
                      />
                      <span className="line-clamp-2 w-full text-center text-[10px] font-medium leading-tight text-zinc-800">
                        {row.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">Haber platformları</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visibleHaberLogos.map((logo) => (
                <div key={logo.path} className="relative rounded-xl border border-zinc-600 bg-white p-2 shadow-sm">
                  <button
                    type="button"
                    aria-label="Logoyu Supabase'den sil"
                    disabled={deleteBusy !== null}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void deleteBucketObject(logo.path, { hideStaticPath: logo.path });
                    }}
                    className="absolute right-1 top-1 z-10 rounded-md bg-rose-700/95 p-1.5 text-white shadow hover:bg-rose-600 disabled:opacity-40"
                  >
                    <TrashIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => pick(logo.path)}
                    className="flex w-full flex-col items-center justify-center gap-1.5 pt-5 text-left transition hover:opacity-90"
                  >
                    <HaberPlatformGalleryThumb
                      src={logo.path.startsWith('http') ? logo.path : encodeURI(logo.path)}
                      label={logo.label}
                    />
                    <span className="line-clamp-2 w-full text-center text-[10px] font-medium leading-tight text-zinc-800">
                      {logo.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 border-t border-zinc-700 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onRequestUploadFromDisk();
            }}
            className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500"
          >
            Bilgisayardan yükle
          </button>
        </div>
      </div>
    </div>
  );
}
