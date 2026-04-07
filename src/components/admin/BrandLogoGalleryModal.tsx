'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { BrandLogoGalleryPickCell } from '@/components/admin/BrandLogoGalleryPickCell';

export type BrandLogoGalleryModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Seçilen logo URL’si form alanına yazılır (`/marka-logolari/...` veya tam URL) */
  onSelect: (imageUrl: string, displayLabel?: string) => void;
  onRequestUploadFromDisk: () => void;
};

export function BrandLogoGalleryModal({
  open,
  onClose,
  title = 'Marka logosu seç',
  onSelect,
  onRequestUploadFromDisk,
}: BrandLogoGalleryModalProps) {
  const [files, setFiles] = useState<Array<{ path: string; label: string }>>([]);
  const [loadError, setLoadError] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const listInFlightRef = useRef<Promise<void> | null>(null);

  const loadMarkaLogoList = useCallback(async () => {
    if (listInFlightRef.current) {
      await listInFlightRef.current;
      return;
    }
    const run = (async () => {
      setLoadError('');
      setListLoading(true);
      try {
        const res = await fetch('/api/admin/marka-logolari-list', { credentials: 'include' });
        if (!res.ok) {
          setLoadError('Liste yüklenemedi.');
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data.files) ? data.files : [];
        setFiles(list);
      } catch {
        setLoadError('Liste yüklenemedi.');
      } finally {
        setListLoading(false);
      }
    })();
    listInFlightRef.current = run.then(() => undefined).finally(() => {
      listInFlightRef.current = null;
    });
    await listInFlightRef.current;
  }, []);

  /** Sayfa açılır açılmaz arka planda çek; modal açılınca da tazele (aynı anda tek istek). */
  useEffect(() => {
    void loadMarkaLogoList();
  }, [loadMarkaLogoList]);

  useEffect(() => {
    if (!open) return;
    void loadMarkaLogoList();
  }, [open, loadMarkaLogoList]);

  function pick(path: string, label: string) {
    onSelect(path, label);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-logo-gallery-title"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-600 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-700 px-4 py-3">
          <h2 id="brand-logo-gallery-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
          >
            Kapat
          </button>
        </div>
        <ul className="mt-0 list-none space-y-2 px-4 pt-2 text-sm leading-relaxed text-white">
          <li className="flex gap-2.5">
            <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
              •
            </span>
            <p>
              Aradığınız logo galeride yer almıyorsa{' '}
              <span className="font-semibold text-white">&quot;Yeni Logo yükle&quot;</span> seçeneğine tıklayarak bilgisayar veya
              telefonunuzdan yeni logo yüklemesi yapabilirsiniz.
            </p>
          </li>
        </ul>
        {loadError ? <p className="shrink-0 px-4 pt-1 text-xs text-amber-200">{loadError}</p> : null}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {listLoading && files.length === 0 && !loadError ? (
            <p className="text-sm text-zinc-400">Logolar yükleniyor…</p>
          ) : null}
          {files.length === 0 && !loadError && !listLoading ? (
            <p className="text-sm text-white">
              Bucket&apos;ta görsel yok veya env (SUPABASE_SERVICE_ROLE_KEY) ile liste alınamıyor.
            </p>
          ) : null}
          {files.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {files.map((item) => (
                <BrandLogoGalleryPickCell
                  key={item.path}
                  src={item.path}
                  label={item.label}
                  onPick={() => pick(item.path, item.label)}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 border-t border-zinc-700 px-4 py-3">
          <button
            type="button"
            onClick={onRequestUploadFromDisk}
            className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500"
          >
            Yeni Logo yükle
          </button>
        </div>
      </div>
    </div>
  );
}
