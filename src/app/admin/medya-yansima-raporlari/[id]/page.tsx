'use client';

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { BrandLogoGalleryPickCell } from '@/components/admin/BrandLogoGalleryPickCell';
import { fileNameFromUrl } from '@/lib/filename-from-url';
import { BRAND_LOGO_BUCKET } from '@/lib/brand-logo-storage';
import { isBlockedMediaReportLogo } from '@/lib/media-report-logo-blocklist';

const LOGO_UPLOAD_OK_LINE = 'Logo yükleme tamamlandı.';
const LOGO_GALLERY_OK_LINE = 'Logo galeriden seçildi.';

function shouldHideFromLogoGallery(value: string): boolean {
  return isBlockedMediaReportLogo(value);
}

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  uses_sub_brands?: boolean;
};

type SubBrand = {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  pdf_url: string;
  is_published: boolean;
};

type ReportEntry = {
  id: string;
  sub_brand_id: string;
  title: string;
  pdf_url: string;
  report_date: string | null;
  created_at: string;
};

type DeleteConfirmState =
  | { kind: 'subBrandRow'; id: string }
  | { kind: 'reportEntry'; subBrandId: string; entryId: string };

const defaultForm = {
  name: '',
  logoUrl: '',
  pdfUrl: '',
};

export default function AdminMediaReportBrandDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const brandId = params.id;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [items, setItems] = useState<SubBrand[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState('');
  const [logoFileUploadDoneLine, setLogoFileUploadDoneLine] = useState(false);
  const [logoGalleryPickDoneLine, setLogoGalleryPickDoneLine] = useState(false);
  const [logoUploadErrorLine, setLogoUploadErrorLine] = useState('');
  const [logoFileLabel, setLogoFileLabel] = useState('');
  const [logoGalleryOpen, setLogoGalleryOpen] = useState(false);

  // Raporlar (entries) state — alt marka bazlı
  const [entriesMap, setEntriesMap] = useState<Record<string, ReportEntry[]>>({});
  const [entriesOpenId, setEntriesOpenId] = useState<string | null>(null);
  const [entryForm, setEntryForm] = useState({ title: '', pdfUrl: '', reportDate: '' });
  const [entryPdfLabel, setEntryPdfLabel] = useState('');
  const [uploadingEntryPdf, setUploadingEntryPdf] = useState(false);
  const [entryMessage, setEntryMessage] = useState<Record<string, string>>({});
  const [savingEntry, setSavingEntry] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [logoArchiveFiles, setLogoArchiveFiles] = useState<Array<{ path: string; label: string }>>([]);
  const [logoArchiveDb, setLogoArchiveDb] = useState<Array<{ url: string; label: string }>>([]);
  const [markaLogolariFiles, setMarkaLogolariFiles] = useState<Array<{ path: string; label: string }>>([]);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  /** true: alt marka dilinde (Rixos); false: doğrudan marka altı rapor/bülten (AJet). */
  const modeSubBrand = brand?.uses_sub_brands !== false;

  const loadBrand = useCallback(async () => {
    const res = await fetch('/api/admin/media-reports/', { credentials: 'include' });
    const data = await res.json();
    if (res.status === 401) {
      router.push('/admin-login');
      return;
    }
    if (!res.ok) throw new Error(data.error || 'Marka alinamadi');
    const list = Array.isArray(data.brands) ? (data.brands as Brand[]) : [];
    setBrand(list.find((x) => x.id === brandId) || null);
  }, [brandId, router]);

  const loadSubBrands = useCallback(async () => {
    const res = await fetch(`/api/admin/media-reports/${brandId}/sub-brands/`, { credentials: 'include' });
    const data = await res.json();
    if (res.status === 401) {
      router.push('/admin-login');
      return;
    }
    if (!res.ok) throw new Error(data.error || 'Alt markalar alinamadi');
    setItems(Array.isArray(data.subBrands) ? data.subBrands : []);
  }, [brandId, router]);

  useEffect(() => {
    loadBrand().catch((e: any) => setMessage(e.message ?? 'Hata'));
    loadSubBrands().catch((e: any) => setMessage(e.message ?? 'Hata'));
  }, [loadBrand, loadSubBrands]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const endpoint = editId
        ? `/api/admin/media-reports/sub-brands/${editId}/`
        : `/api/admin/media-reports/${brandId}/sub-brands/`;
      const method = editId ? 'PUT' : 'POST';
      const logoUrlForApi = modeSubBrand
        ? (form.logoUrl || '').trim()
        : (brand?.logo_url || '').trim();
      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          logoUrl: logoUrlForApi,
          pdfUrl: form.pdfUrl,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Kaydetme hatasi');
      setMessage(
        editId
          ? modeSubBrand
            ? 'Alt marka guncellendi.'
            : 'Rapor guncellendi.'
          : modeSubBrand
            ? 'Alt marka olusturuldu.'
            : 'Rapor kaydedildi.'
      );
      setEditId(null);
      setForm(defaultForm);
      setLogoFileUploadDoneLine(false);
      setLogoGalleryPickDoneLine(false);
      setLogoUploadErrorLine('');
      setLogoFileLabel('');
      await loadSubBrands();
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  function fillForEdit(item: SubBrand) {
    setEditId(item.id);
    setForm({
      name: item.name || '',
      logoUrl: modeSubBrand ? item.logo_url || '' : '',
      pdfUrl: item.pdf_url || '',
    });
    setMessage('');
    setLogoFileUploadDoneLine(false);
    setLogoGalleryPickDoneLine(false);
    setLogoUploadErrorLine('');
    setLogoFileLabel(
      modeSubBrand && item.logo_url ? fileNameFromUrl(item.logo_url) : ''
    );
  }

  async function executeRemoveItem(id: string) {
    const res = await fetch(`/api/admin/media-reports/sub-brands/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (res.status === 401) {
      router.push('/admin-login');
      return;
    }
    if (!res.ok) {
      setMessage(data.error || 'Silinemedi');
      return;
    }
    setMessage(modeSubBrand ? 'Alt marka silindi.' : 'Rapor silindi.');
    await loadSubBrands();
  }

  async function loadEntriesForSubBrand(subBrandId: string) {
    try {
      const res = await fetch(`/api/admin/media-reports/sub-brands/${subBrandId}/reports/`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 401) { router.push('/admin-login'); return; }
      setEntriesMap((prev) => ({ ...prev, [subBrandId]: Array.isArray(data.entries) ? data.entries : [] }));
    } catch {
      setEntriesMap((prev) => ({ ...prev, [subBrandId]: [] }));
    }
  }

  async function toggleEntriesPanel(subBrandId: string) {
    if (entriesOpenId === subBrandId) {
      setEntriesOpenId(null);
    } else {
      setEntriesOpenId(subBrandId);
      setEntryForm({ title: '', pdfUrl: '', reportDate: '' });
      setEntryPdfLabel('');
      await loadEntriesForSubBrand(subBrandId);
    }
  }

  async function uploadEntryPdf(file: File | null, subBrandId: string) {
    if (!file) return;
    setUploadingEntryPdf(true);
    setEntryMessage((prev) => ({ ...prev, [subBrandId]: '' }));
    try {
      if (file.type !== 'application/pdf') throw new Error('Sadece PDF yukleyebilirsiniz.');
      const res = await fetch('/api/admin/upload-pdf/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ filename: file.name, size: file.size, contentType: file.type }),
      });
      const data = await res.json();
      if (res.status === 401) { router.push('/admin-login'); return; }
      if (!res.ok) throw new Error(data.error || 'PDF upload basarisiz');

      const { createClient: sbCreate } = await import('@supabase/supabase-js');
      const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      const sbAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
      if (!sbUrl || !sbAnon) throw new Error('Supabase ayarlari eksik.');
      const sb = sbCreate(sbUrl, sbAnon, { auth: { persistSession: false, autoRefreshToken: false } });
      const { error: upErr } = await sb.storage.from('project-pdf').uploadToSignedUrl(
        String(data.path || ''), String(data.token || ''), file, { contentType: 'application/pdf', upsert: true }
      );
      if (upErr) throw new Error(upErr.message || 'Depolama hatasi');
      const publicUrl = String(data.publicUrl || data.url || '');
      setEntryForm((prev) => ({ ...prev, pdfUrl: publicUrl }));
      setEntryPdfLabel(file.name);
      setEntryMessage((prev) => ({ ...prev, [subBrandId]: 'PDF yükleme tamamlandı.' }));
    } catch (e: any) {
      setEntryMessage((prev) => ({ ...prev, [subBrandId]: e.message ?? 'PDF yükleme başarısız.' }));
    } finally {
      setUploadingEntryPdf(false);
    }
  }

  async function saveEntry(subBrandId: string) {
    if (!entryForm.title.trim()) { setEntryMessage((prev) => ({ ...prev, [subBrandId]: 'Başlık zorunludur.' })); return; }
    if (!entryForm.pdfUrl.trim()) { setEntryMessage((prev) => ({ ...prev, [subBrandId]: 'Önce PDF yükleyin.' })); return; }
    setSavingEntry(true);
    try {
      const res = await fetch(`/api/admin/media-reports/sub-brands/${subBrandId}/reports/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: entryForm.title, pdfUrl: entryForm.pdfUrl, reportDate: entryForm.reportDate || null }),
      });
      const data = await res.json();
      if (res.status === 401) { router.push('/admin-login'); return; }
      if (!res.ok) throw new Error(data.error || 'Kaydetme hatasi');
      setEntryForm({ title: '', pdfUrl: '', reportDate: '' });
      setEntryPdfLabel('');
      setEntryMessage((prev) => ({ ...prev, [subBrandId]: 'Rapor eklendi.' }));
      await loadEntriesForSubBrand(subBrandId);
    } catch (e: any) {
      setEntryMessage((prev) => ({ ...prev, [subBrandId]: e.message ?? 'Hata' }));
    } finally {
      setSavingEntry(false);
    }
  }

  async function executeDeleteEntry(subBrandId: string, entryId: string) {
    try {
      const res = await fetch(`/api/admin/media-reports/sub-brands/${subBrandId}/reports/?entryId=${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 401) { router.push('/admin-login'); return; }
      if (!res.ok) throw new Error(data.error || 'Silinemedi');
      setEntryMessage((prev) => ({ ...prev, [subBrandId]: 'Rapor silindi.' }));
      await loadEntriesForSubBrand(subBrandId);
    } catch (e: any) {
      setEntryMessage((prev) => ({ ...prev, [subBrandId]: e.message ?? 'Hata' }));
    }
  }

  async function confirmPendingDelete() {
    if (!deleteConfirm) return;
    setDeleteBusy(true);
    try {
      if (deleteConfirm.kind === 'subBrandRow') {
        await executeRemoveItem(deleteConfirm.id);
      } else {
        await executeDeleteEntry(deleteConfirm.subBrandId, deleteConfirm.entryId);
      }
    } finally {
      setDeleteBusy(false);
      setDeleteConfirm(null);
    }
  }

  useEffect(() => {
    if (!deleteConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleteBusy) setDeleteConfirm(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteConfirm, deleteBusy]);

  async function uploadLogo(file: File | null) {
    if (!file) return;
    setUploadingLogo(true);
    setMessage('');
    setLogoFileUploadDoneLine(false);
    setLogoGalleryPickDoneLine(false);
    setLogoUploadErrorLine('');
    try {
      if (!file.type.startsWith('image/')) throw new Error('Sadece gorsel yukleyebilirsiniz.');
      const formData = new FormData();
      formData.append('files', file);
      formData.append('storageBucket', BRAND_LOGO_BUCKET);
      formData.append('archiveSubBrandLogo', '1');
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Logo yuklenemedi');
      const uploaded = Array.isArray(data.urls) ? data.urls[0] : '';
      if (!uploaded) throw new Error('Logo URL alinamadi.');
      setForm((prev) => ({ ...prev, logoUrl: uploaded }));
      setLogoFileLabel(file.name);
      const arch = Array.isArray(data.archived) ? data.archived : [];
      if (arch.length && arch[0]?.path) {
        const a = arch[0] as { path: string; label?: string };
        setLogoArchiveFiles((prev) => {
          const next = [{ path: a.path, label: a.label || file.name }, ...prev.filter((x) => x.path !== a.path)];
          return next.slice(0, 200);
        });
      }
      const meta = data.uploadMeta as { destination?: string; bucket?: string | null } | undefined;
      setLogoFileUploadDoneLine(true);
      if (meta?.destination === 'supabase' && meta.bucket) {
        setMessage(
          arch.length
            ? `Logo Supabase bucket "${meta.bucket}" yuklendi; yerel arsiv de guncellendi.`
            : `Logo Supabase bucket "${meta.bucket}" yuklendi.`
        );
      } else if (meta?.destination === 'local') {
        setMessage(
          'Logo yalnizca yerel public/proje-galeri altina yazildi (Supabase URL+service_role yok). Production icin env kontrol edin.'
        );
      } else {
        setMessage(
          arch.length
            ? modeSubBrand
              ? 'Alt marka logosu yuklendi; public/sub-brand-logos-archive arsivine de eklendi.'
              : 'Rapor logosu yuklendi; arsiv de guncellendi.'
            : modeSubBrand
              ? 'Alt marka logosu yuklendi.'
              : 'Rapor logosu yuklendi.'
        );
      }
    } catch (e: any) {
      const errText = e?.message ?? 'Logo upload hatasi';
      setLogoUploadErrorLine(errText);
      setMessage(errText);
    } finally {
      setUploadingLogo(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  }

  function selectLogoForForm(urlOrPath: string, displayLabel?: string) {
    setForm((prev) => ({ ...prev, logoUrl: urlOrPath }));
    setLogoFileLabel(displayLabel || fileNameFromUrl(urlOrPath));
    setLogoGalleryOpen(false);
  }

  useEffect(() => {
    if (!message) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMessage('');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [message]);

  useEffect(() => {
    if (!logoGalleryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLogoGalleryOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [logoGalleryOpen]);

  const loadLogoGalleryData = useCallback(async () => {
    try {
      const [archiveRes, markaRes] = await Promise.all([
        fetch('/api/admin/media-reports/logo-archive/', { credentials: 'include' }),
        fetch('/api/admin/marka-logolari-list/', { credentials: 'include' }),
      ]);
      if (markaRes.ok) {
        const markaData = await markaRes.json();
        const mf = Array.isArray(markaData.files) ? markaData.files : [];
        setMarkaLogolariFiles(
          mf.map((e: { path?: string; label?: string }) => ({
            path: String(e.path || ''),
            label: String(e.label || e.path || ''),
          }))
            .filter((e: { path: string; label: string }) => Boolean(e.path))
            .filter((e: { path: string; label: string }) => !shouldHideFromLogoGallery(`${e.label} ${e.path}`))
        );
      } else {
        setMarkaLogolariFiles([]);
      }
      if (!archiveRes.ok) {
        setLogoArchiveFiles([]);
        setLogoArchiveDb([]);
        return;
      }
      const data = await archiveRes.json();
      const manifest = Array.isArray(data.manifest) ? data.manifest : [];
      const used = Array.isArray(data.usedLogos) ? data.usedLogos : [];
      setLogoArchiveFiles(
        manifest.map((e: { path?: string; label?: string }) => ({
          path: String(e.path || ''),
          label: String(e.label || e.path || ''),
        }))
          .filter((e: { path: string; label: string }) => Boolean(e.path))
          .filter((e: { path: string; label: string }) => !shouldHideFromLogoGallery(`${e.label} ${e.path}`))
      );
      setLogoArchiveDb(
        used.map((e: { url?: string; label?: string }) => ({
          url: String(e.url || ''),
          label: String(e.label || e.url || ''),
        }))
          .filter((e: { url: string; label: string }) => Boolean(e.url))
          .filter((e: { url: string; label: string }) => !shouldHideFromLogoGallery(`${e.label} ${e.url}`))
      );
    } catch {
      /* galeri yuklenemezse kismi liste */
    }
  }, []);

  /** Alt marka modunda sayfa yüklenirken galeri verisini arka planda doldur — modal açılışı bekletmez. */
  useEffect(() => {
    if (!brand || !modeSubBrand) return;
    void loadLogoGalleryData();
  }, [brand?.id, modeSubBrand, loadLogoGalleryData]);

  useEffect(() => {
    if (!logoGalleryOpen || !modeSubBrand) return;
    void loadLogoGalleryData();
  }, [logoGalleryOpen, modeSubBrand, loadLogoGalleryData]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      {message ? (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="admin-toast-title"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4"
          onClick={() => setMessage('')}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-600 bg-zinc-900 px-6 py-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="admin-toast-title" className="text-center text-base text-zinc-100">
              {message}
            </p>
            <button
              type="button"
              onClick={() => setMessage('')}
              className="mt-5 w-full rounded-md bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-500"
            >
              Tamam
            </button>
          </div>
        </div>
      ) : null}

      {deleteConfirm ? (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          aria-describedby="delete-confirm-desc"
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 p-4"
          onClick={() => !deleteBusy && setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-600 bg-zinc-900 px-6 py-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-confirm-title" className="text-lg font-semibold text-zinc-100">
              Silme onayı
            </h2>
            <p id="delete-confirm-desc" className="mt-3 text-sm leading-relaxed text-zinc-300">
              {deleteConfirm.kind === 'reportEntry'
                ? 'Bu raporu silmek istiyor musunuz?'
                : modeSubBrand
                  ? 'Bu alt markayı silmek istiyor musunuz?'
                  : 'Bu raporu silmek istiyor musunuz?'}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleteBusy}
                onClick={() => setDeleteConfirm(null)}
                className="rounded-md border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={deleteBusy}
                onClick={() => void confirmPendingDelete()}
                className="rounded-md bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleteBusy ? 'Siliniyor…' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {logoGalleryOpen && modeSubBrand ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logo-gallery-title"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLogoGalleryOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-600 bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-700 px-4 py-3">
              <h2 id="logo-gallery-title" className="text-lg font-semibold text-white">
                {modeSubBrand ? 'Alt marka logosu seç' : 'Rapor logosu seç'}
              </h2>
              <button
                type="button"
                onClick={() => setLogoGalleryOpen(false)}
                className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
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
                  <span className="font-semibold text-white">&quot;Yeni Logo yükle&quot;</span> seçeneğine tıklayarak bilgisayar
                  veya telefonunuzdan yeni logo yüklemesi yapabilirsiniz.
                </p>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                  •
                </span>
                <p>Aşağıda ayrıca site arşivi ve kayıtlarda kullanılan logolar listelenir.</p>
              </li>
            </ul>
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-3">
              {markaLogolariFiles.length ? (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">
                    Supabase — brand-logo / uploads
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {markaLogolariFiles
                      .filter((logo) => !shouldHideFromLogoGallery(`${logo.label} ${logo.path}`))
                      .map((logo) => (
                      <BrandLogoGalleryPickCell
                        key={logo.path}
                        src={logo.path}
                        label={logo.label}
                        onPick={() => selectLogoForForm(logo.path, logo.label)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {logoArchiveFiles.length ? (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">
                    Site arşivi (sub-brand-logos-archive)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {logoArchiveFiles
                      .filter((logo) => !shouldHideFromLogoGallery(`${logo.label} ${logo.path}`))
                      .map((logo) => (
                      <BrandLogoGalleryPickCell
                        key={logo.path}
                        src={logo.path.startsWith('http') ? logo.path : encodeURI(logo.path)}
                        label={logo.label}
                        onPick={() => selectLogoForForm(logo.path, logo.label)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {logoArchiveDb.length ? (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-400">
                    Daha önce kayıtlarda kullanılan logolar
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {logoArchiveDb
                      .filter((row) => !shouldHideFromLogoGallery(`${row.label} ${row.url}`))
                      .map((row) => (
                      <BrandLogoGalleryPickCell
                        key={row.url}
                        src={row.url.startsWith('http') ? row.url : encodeURI(row.url)}
                        label={row.label}
                        onPick={() => selectLogoForForm(row.url, row.label)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="shrink-0 border-t border-zinc-700 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setLogoGalleryOpen(false);
                  requestAnimationFrame(() => logoFileInputRef.current?.click());
                }}
                className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-500"
              >
                Yeni Logo yükle
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {modeSubBrand ? 'Alt marka yönetimi' : 'Haber ve bülten raporları'}
            </h1>
            <div className="mt-1 text-sm text-zinc-400">
              <p>
                Marka: <span className="text-zinc-200">{brand?.name || 'Yukleniyor...'}</span>
              </p>
              {!modeSubBrand ? (
                <ul className="mt-2 list-none space-y-1.5 text-xs text-zinc-500">
                  <li className="flex gap-2">
                    <span className="shrink-0 text-teal-500" aria-hidden>
                      •
                    </span>
                    <span>Bu markada alt marka yok; her satır doğrudan bir medya / bülten raporudur.</span>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
          <Link
            href="/admin/medya-yansima-raporlari"
            className="inline-flex shrink-0 justify-center rounded border border-zinc-700 px-3 py-1.5 text-center text-xs hover:bg-zinc-800"
          >
            Markalara Don
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <h2 className="text-lg font-semibold">
              {editId
                ? modeSubBrand
                  ? 'Alt markayı düzenle'
                  : 'Raporu düzenle'
                : modeSubBrand
                  ? 'Alt marka ekle'
                  : 'Yeni rapor / bülten ekle'}
            </h2>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">
                {modeSubBrand ? 'Alt marka adı' : 'Rapor veya bülten adı'}
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder={modeSubBrand ? 'Örn: Rixos Radamis' : 'Örn: Şubat 2026 medya özeti'}
                required
              />
            </div>

            {modeSubBrand ? (
              <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                <label className="text-xs text-zinc-400" htmlFor="alt-marka-logo-galeri-btn">
                  Alt marka logosu
                </label>
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={uploadingLogo}
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    e.target.value = '';
                    void uploadLogo(f);
                  }}
                />
                <button
                  id="alt-marka-logo-galeri-btn"
                  type="button"
                  disabled={uploadingLogo}
                  onClick={() => setLogoGalleryOpen(true)}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploadingLogo ? 'Yükleniyor…' : 'Logo seç'}
                </button>
                {form.logoUrl ? (
                  <p className="text-xs text-zinc-300">
                    Dosya:{' '}
                    <span className="font-medium text-zinc-100">
                      {logoFileLabel || fileNameFromUrl(form.logoUrl)}
                    </span>
                  </p>
                ) : null}
                {form.logoUrl ? (
                  <div className="mt-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.logoUrl.startsWith('http') ? form.logoUrl : encodeURI(form.logoUrl)}
                      alt="Alt marka logosu"
                      className="max-h-full max-w-full origin-center scale-[2.02] object-contain"
                    />
                  </div>
                ) : null}
                {logoFileUploadDoneLine ? (
                  <p className="text-xs font-medium text-teal-400">{LOGO_UPLOAD_OK_LINE}</p>
                ) : null}
                {logoGalleryPickDoneLine ? (
                  <p className="text-xs font-medium text-teal-400">{LOGO_GALLERY_OK_LINE}</p>
                ) : null}
                {logoUploadErrorLine ? (
                  <p className="text-xs font-medium text-rose-400">{logoUploadErrorLine}</p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                <p className="text-xs text-zinc-300">
                  Rapor kartlarında{' '}
                  <span className="font-medium text-zinc-100">ana marka logosu</span> otomatik kullanılır; ayrıca rapor
                  logosu seçmenize gerek yok.
                </p>
                {brand?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logo_url.startsWith('http') ? brand.logo_url : encodeURI(brand.logo_url)}
                    alt="Marka logosu"
                    className="h-14 w-auto rounded bg-white p-2"
                  />
                ) : (
                  <p className="text-xs text-amber-200">
                    Ana markada logo tanımlı değil. Medya yansıma ana sayfasından markayı düzenleyerek logo ekleyin.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={loading || (modeSubBrand && uploadingLogo)}
                className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Kaydediliyor...' : editId ? 'Guncelle' : 'Kaydet'}
              </button>
              {editId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm(defaultForm);
                    setLogoFileUploadDoneLine(false);
                    setLogoGalleryPickDoneLine(false);
                    setLogoUploadErrorLine('');
                    setLogoFileLabel('');
                  }}
                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
                >
                  Iptal
                </button>
              ) : null}
            </div>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <h2 className="text-lg font-semibold">{modeSubBrand ? 'Kayıtlı alt markalar' : 'Kayıtlı raporlar'}</h2>
            <div className="mt-3 max-h-[36rem] space-y-3 overflow-auto pr-1">
              {items.map((item) => {
                const publicPath = `/medya-yansima-raporu/${brand?.slug || ''}/${item.slug}`;
                const listLogoUrl = modeSubBrand
                  ? item.logo_url
                  : item.logo_url || brand?.logo_url || null;
                return (
                  <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <p className="text-sm font-semibold text-zinc-100">{item.name}</p>
                    <a href={publicPath} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-teal-400 hover:underline">
                      {publicPath}
                    </a>
                    <p className="mt-1 text-xs text-zinc-400">
                      PDF:{' '}
                      <span className="text-zinc-200">{fileNameFromUrl(item.pdf_url) || '—'}</span>
                    </p>
                    {listLogoUrl ? (
                      <div className="mt-2 h-12 w-full max-w-[7.5rem] overflow-hidden rounded-lg bg-white p-1 sm:h-14 sm:max-w-[8.5rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={listLogoUrl.startsWith('http') ? listLogoUrl : encodeURI(listLogoUrl)}
                          alt={item.name}
                          className="h-full w-full origin-center scale-[2.405] object-contain object-center"
                        />
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => fillForEdit(item)} className="rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800">
                        Duzenle
                      </button>
                      {modeSubBrand ? (
                        <button
                          type="button"
                          onClick={() => void toggleEntriesPanel(item.id)}
                          className="rounded border border-teal-700 px-2 py-1 text-xs text-teal-300 hover:bg-teal-950/60"
                        >
                          {entriesOpenId === item.id ? 'Raporları Kapat' : `Raporlar${entriesMap[item.id] ? ` (${entriesMap[item.id].length})` : ''}`}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ kind: 'subBrandRow', id: item.id })}
                        className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:bg-rose-950/60"
                      >
                        Sil
                      </button>
                    </div>

                    {modeSubBrand && entriesOpenId === item.id ? (
                      <div className="mt-4 space-y-3 rounded-xl border border-teal-900/60 bg-teal-950/20 p-3">
                        <h3 className="text-sm font-semibold text-teal-300">Raporlar — {item.name}</h3>

                        {entryMessage[item.id] ? (
                          <p className="text-xs text-teal-400">{entryMessage[item.id]}</p>
                        ) : null}

                        <div className="space-y-2">
                          <input
                            value={entryForm.title}
                            onChange={(e) => setEntryForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="Rapor başlığı (örn: Nisan 2026 Yansıma Raporu)"
                            className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs"
                          />
                          <input
                            type="date"
                            value={entryForm.reportDate}
                            onChange={(e) => setEntryForm((p) => ({ ...p, reportDate: e.target.value }))}
                            className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300"
                          />
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700">
                              {uploadingEntryPdf ? 'Yükleniyor…' : 'PDF Seç'}
                              <input
                                type="file"
                                accept="application/pdf"
                                className="sr-only"
                                disabled={uploadingEntryPdf}
                                onChange={(e) => void uploadEntryPdf(e.target.files?.[0] || null, item.id)}
                              />
                            </label>
                            {entryPdfLabel ? <span className="text-xs text-zinc-300 truncate max-w-[160px]">{entryPdfLabel}</span> : null}
                          </div>
                          <button
                            type="button"
                            disabled={savingEntry || uploadingEntryPdf}
                            onClick={() => void saveEntry(item.id)}
                            className="rounded bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-500 disabled:opacity-60"
                          >
                            {savingEntry ? 'Kaydediliyor…' : 'Rapor Ekle'}
                          </button>
                        </div>

                        <div className="mt-2 space-y-2">
                          {(entriesMap[item.id] || []).length === 0 ? (
                            <p className="text-xs text-zinc-500">Henüz rapor eklenmedi.</p>
                          ) : (
                            (entriesMap[item.id] || []).map((entry) => (
                              <div key={entry.id} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-zinc-100">{entry.title}</p>
                                  {entry.report_date ? (
                                    <p className="text-xs text-zinc-500">{entry.report_date}</p>
                                  ) : null}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm({ kind: 'reportEntry', subBrandId: item.id, entryId: entry.id })}
                                  className="shrink-0 rounded border border-rose-800 px-2 py-0.5 text-xs text-rose-400 hover:bg-rose-950/60"
                                >
                                  Sil
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
              {!items.length ? (
                <p className="text-sm text-zinc-400">
                  {modeSubBrand ? 'Henüz alt marka yok.' : 'Henüz rapor eklenmedi.'}
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <section
          className="rounded-2xl border border-zinc-700/80 bg-zinc-900/40 p-4 text-sm font-bold text-zinc-300 sm:p-5 sm:text-[1.05rem]"
          aria-labelledby="alt-marka-bilgi-baslik"
        >
          <h2 id="alt-marka-bilgi-baslik" className="text-base font-bold text-zinc-100 sm:text-[1.2rem]">
            Bilgilendirme
          </h2>
          <ul className="mt-3 list-none space-y-3 leading-relaxed">
            {modeSubBrand ? (
              <>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                    •
                  </span>
                  <p>
                    <strong className="font-extrabold text-zinc-200">Sol panel</strong> yeni alt marka kaydı;{' '}
                    <strong className="font-extrabold text-zinc-200">sağ panel</strong> kayıtlı alt markaların bulunduğu
                    alan.
                  </p>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                    •
                  </span>
                  <p>
                    <strong className="font-extrabold text-zinc-200">Sol panelden</strong> alt marka adı ve logosu eklenir;{' '}
                    <span className="font-extrabold text-zinc-200">&quot;Kaydet&quot;</span> düğmesine basılır. Alt marka sağ
                    alanda oluşur. <span className="font-extrabold text-zinc-200">Düzenle</span> düğmesi, oluşturulan alt markanın
                    logosunu veya adını güncellemek için kullanılır.
                  </p>
                </li>
              </>
            ) : (
              <>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                    •
                  </span>
                  <p>
                    Bu markada <strong className="font-extrabold text-zinc-200">alt marka yok</strong>. Her kayıt doğrudan bir{' '}
                    <strong className="font-extrabold text-zinc-200">haber, bülten veya rapor</strong> girişidir (ör. AJet için
                    onlarca PDF).
                  </p>
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                    •
                  </span>
                  <p>
                    Sol panelde rapor adı ve PDF yükleyin; liste ve sitede görsel olarak{' '}
                    <strong className="font-extrabold text-zinc-200">ana marka logosu</strong> kullanılır. Sağ panelde tüm
                    raporlar listelenir.
                  </p>
                </li>
              </>
            )}
            {modeSubBrand ? (
              <li className="flex gap-2.5">
                <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                  •
                </span>
                <p>
                  Oluşturulan alt marka bünyesine rapor eklemek için sağ panelde yer alan ilgili alt markanın{' '}
                  <span className="font-extrabold text-zinc-200">Raporlar</span> düğmesine basın. Açılan pencerede rapor
                  başlığı ve tarih bilgilerini giriniz. Ardından <span className="font-extrabold text-zinc-200">&quot;PDF Seç&quot;</span>{' '}
                  düğmesine basarak PDF&apos;i ekledikten sonra{' '}
                  <span className="font-extrabold text-zinc-200">&quot;Rapor Ekle&quot;</span> düğmesine basın. Eklenen rapor
                  aşağıda listelenecektir.
                </p>
              </li>
            ) : (
              <li className="flex gap-2.5">
                <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                  •
                </span>
                <p>
                  PDF yüklemesi sonrası ortada bildirim çıkar;{' '}
                  <span className="font-extrabold text-zinc-200">&quot;Tamam&quot;</span> deyip{' '}
                  <span className="font-extrabold text-zinc-200">&quot;Kaydet&quot;</span> ile kaydı tamamlayın.
                </p>
              </li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
