'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BrandLogoGalleryModal } from '@/components/admin/BrandLogoGalleryModal';
import { fileNameFromUrl } from '@/lib/filename-from-url';
import { BRAND_LOGO_BUCKET } from '@/lib/brand-logo-storage';

type BrandItem = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_published: boolean;
  uses_sub_brands?: boolean;
  updated_at: string;
};

const defaultForm = {
  name: '',
  logoUrl: '',
  usesSubBrands: true,
};

const LOGO_UPLOAD_OK_LINE = 'Logo yükleme tamamlandı.';
const LOGO_GALLERY_OK_LINE = 'Logo galeriden seçildi.';

export default function AdminMediaReportsPage() {
  const router = useRouter();
  const [items, setItems] = useState<BrandItem[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [logoFileUploadDoneLine, setLogoFileUploadDoneLine] = useState(false);
  const [logoGalleryPickDoneLine, setLogoGalleryPickDoneLine] = useState(false);
  const [logoUploadErrorLine, setLogoUploadErrorLine] = useState('');
  const [logoFileLabel, setLogoFileLabel] = useState('');
  const [logoGalleryOpen, setLogoGalleryOpen] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    const res = await fetch('/api/admin/media-reports/', { credentials: 'include' });
    const data = await res.json();
    if (res.status === 401) {
      router.push('/admin-login');
      return;
    }
    if (!res.ok) throw new Error(data.error || 'Liste alinamadi');
    setItems(data.brands || []);
  }, [router]);

  useEffect(() => {
    loadItems().catch((error: any) => setMessage(error.message ?? 'Hata'));
  }, [loadItems]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const endpoint = editId ? `/api/admin/media-reports/${editId}` : '/api/admin/media-reports';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          logoUrl: form.logoUrl,
          usesSubBrands: form.usesSubBrands,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Kaydetme hatasi');
      setMessage(editId ? 'Marka guncellendi.' : 'Marka olusturuldu.');
      setForm(defaultForm);
      setEditId(null);
      setLogoFileLabel('');
      setLogoFileUploadDoneLine(false);
      setLogoGalleryPickDoneLine(false);
      setLogoUploadErrorLine('');
      await loadItems();
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  function fillForEdit(item: BrandItem) {
    setEditId(item.id);
    setForm({
      name: item.name || '',
      logoUrl: item.logo_url || '',
      usesSubBrands: item.uses_sub_brands !== false,
    });
    setMessage('');
    setLogoFileUploadDoneLine(false);
    setLogoGalleryPickDoneLine(false);
    setLogoUploadErrorLine('');
    setLogoFileLabel(item.logo_url ? fileNameFromUrl(item.logo_url) : '');
  }

  async function removeItem(id: string) {
    if (!window.confirm('Bu markayi silmek istiyor musunuz? Bagli tum alt marka / rapor kayitlari da silinir.')) return;
    setMessage('');
    const res = await fetch(`/api/admin/media-reports/${id}/`, {
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
    setMessage('Marka silindi.');
    await loadItems();
  }

  async function uploadLogo(file: File | null) {
    if (!file) return;
    const MAX_MB = 25;
    const maxBytes = MAX_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      const t = `Logo cok buyuk. Maksimum ${MAX_MB}MB yukleyebilirsiniz.`;
      setLogoUploadErrorLine(t);
      setLogoFileUploadDoneLine(false);
      setLogoGalleryPickDoneLine(false);
      setMessage(t);
      return;
    }
    setUploading(true);
    setMessage('');
    setLogoFileUploadDoneLine(false);
    setLogoGalleryPickDoneLine(false);
    setLogoUploadErrorLine('');
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece gorsel dosyasi yukleyebilirsiniz.');
      }

      const formData = new FormData();
      formData.append('files', file);
      formData.append('storageBucket', BRAND_LOGO_BUCKET);
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
      if (!res.ok) throw new Error(data.error || 'Logo upload basarisiz');
      const uploaded = Array.isArray(data.urls) ? data.urls[0] : '';
      if (!uploaded) throw new Error('Yuklenen logo URL alinamadi.');
      setForm((prev) => ({ ...prev, logoUrl: uploaded }));
      setLogoFileLabel(file.name);
      setLogoFileUploadDoneLine(true);
      setMessage('Logo yuklendi.');
    } catch (error: any) {
      const errText = error.message ?? 'Logo upload hatasi';
      setLogoUploadErrorLine(errText);
      setMessage(errText);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <BrandLogoGalleryModal
        open={logoGalleryOpen}
        onClose={() => setLogoGalleryOpen(false)}
        title="Marka logosu seç"
        onSelect={(url, label) => {
          setForm((prev) => ({ ...prev, logoUrl: url }));
          setLogoFileLabel(label || fileNameFromUrl(url));
          setLogoFileUploadDoneLine(false);
          setLogoUploadErrorLine('');
          setLogoGalleryPickDoneLine(true);
          setMessage(LOGO_GALLERY_OK_LINE);
        }}
        onRequestUploadFromDisk={() => {
          setLogoGalleryOpen(false);
          requestAnimationFrame(() => logoFileInputRef.current?.click());
        }}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold sm:text-2xl">Medya Yansima Raporlari</h1>
          </div>
          <Link
            href="/admin"
            className="inline-flex shrink-0 justify-center rounded border border-zinc-700 px-3 py-1.5 text-center text-xs hover:bg-zinc-800"
          >
            Panele Don
          </Link>
        </div>

        {message ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">{message}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <h2 className="text-lg font-semibold">{editId ? 'Markayi Duzenle' : 'Yeni Marka Ekle'}</h2>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Marka Ekle</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="Ornek: Rixos"
                required
              />
            </div>

            <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <label className="text-xs text-zinc-400" htmlFor="ana-marka-logo-galeri-btn">
                Marka Logosu
              </label>
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                disabled={uploading}
                className="sr-only"
                tabIndex={-1}
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  e.target.value = '';
                  void uploadLogo(f);
                }}
              />
              <button
                id="ana-marka-logo-galeri-btn"
                type="button"
                disabled={uploading}
                onClick={() => setLogoGalleryOpen(true)}
                className="rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? 'Yükleniyor…' : 'Logo seç (galeri veya yükle)'}
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
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logoUrl.startsWith('http') ? form.logoUrl : encodeURI(form.logoUrl)}
                  alt="Marka logosu"
                  className="h-14 w-auto rounded bg-white p-2"
                />
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

            <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.usesSubBrands}
                onChange={(e) => setForm((prev) => ({ ...prev, usesSubBrands: e.target.checked }))}
                className="mt-1 shrink-0"
              />
              <span>
                <span className="font-medium text-zinc-100">Bu markada alt marka kullan</span>
                <ul className="mt-1.5 list-none space-y-1.5 text-xs font-normal text-zinc-500">
                  <li className="flex gap-2">
                    <span className="shrink-0 text-teal-500" aria-hidden>
                      •
                    </span>
                    <span>Örn. Rixos → Radamis, Alamein.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0 text-teal-500" aria-hidden>
                      •
                    </span>
                    <span>
                      İşareti kaldırırsanız (ör. AJet) yalnızca ana marka altında onlarca haber / bülten raporu eklersiniz; alt
                      marka adı olmaz.
                    </span>
                  </li>
                </ul>
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={loading || uploading}
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
            <h2 className="text-lg font-semibold">Kayitli Markalar</h2>
            <div className="mt-3 max-h-[36rem] space-y-3 overflow-auto pr-1">
              {items.map((item) => {
                const publicPath = `/medya-yansima-raporu/${item.slug}`;
                return (
                  <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <p className="text-sm font-semibold text-zinc-100">{item.name}</p>
                    <a
                      href={publicPath}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-xs text-teal-400 hover:underline"
                    >
                      {publicPath}
                    </a>
                    {item.logo_url ? (
                      <div className="mt-2 h-12 w-full max-w-[7.5rem] overflow-hidden rounded-lg bg-white p-1 sm:h-14 sm:max-w-[8.5rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.logo_url.startsWith('http') ? item.logo_url : encodeURI(item.logo_url)}
                          alt={item.name}
                          className="h-full w-full origin-center scale-[2.405] object-contain object-center"
                        />
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/medya-yansima-raporlari/${item.id}`}
                        className="rounded border border-teal-700 px-2 py-1 text-xs text-teal-300 hover:bg-teal-950/40"
                      >
                        {item.uses_sub_brands !== false ? 'Alt marka yönet' : 'Rapor / bülten yönet'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => fillForEdit(item)}
                        className="rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800"
                      >
                        Duzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeItem(item.id)}
                        className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:bg-rose-950/60"
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                );
              })}
              {!items.length ? (
                <p className="text-sm text-zinc-400">Henuz marka kaydi yok.</p>
              ) : null}
            </div>
          </section>
        </div>

        <section
          className="rounded-2xl border border-zinc-700/80 bg-zinc-900/40 p-4 text-sm font-bold text-zinc-300 sm:p-5 sm:text-[1.05rem]"
          aria-labelledby="medya-rapor-bilgi-baslik"
        >
          <h2 id="medya-rapor-bilgi-baslik" className="text-base font-bold text-zinc-100 sm:text-[1.2rem]">
            Bilgilendirme
          </h2>
          <ul className="mt-3 list-none space-y-3 leading-relaxed">
            <li className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                •
              </span>
              <p>
                <strong className="font-extrabold text-zinc-200">Sol panelde</strong> ana marka adı ve logosunu ekliyoruz.
                Eklenen marka sağ panelde görünür.
              </p>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                •
              </span>
              <p>
                <span className="font-extrabold text-zinc-200">&quot;Alt marka kullan&quot;</span> işaretliyse örnek: Rixos
                Egypt Hotel ana markası altına Rixos Alamein, Rixos Radamis gibi alt markalar eklenir.
              </p>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                •
              </span>
              <p>
                AJet gibi yalnızca ana marka eklenecekse bu kutu <strong className="font-extrabold text-zinc-200">işaretlenmez</strong>.
              </p>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                •
              </span>
              <p>
                <span className="font-extrabold text-zinc-200">&quot;Bu markada alt marka kullan&quot;</span> seçeneğini
                işaretlediyseniz, sağ panelde <span className="font-extrabold text-zinc-200">&quot;Alt marka yönet&quot;</span>{' '}
                düğmesine tıklayın; o markaya ait alt markaları ekleyin.
              </p>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 shrink-0 text-teal-400" aria-hidden>
                •
              </span>
              <p>
                <span className="font-extrabold text-zinc-200">&quot;Bu markada alt marka kullan&quot;</span> işaretli değilse —
                yani tek ana marka üzerinden devam edecekseniz — sağ panelde ana markanın altındaki{' '}
                <span className="font-extrabold text-zinc-200">&quot;Rapor / bülten yönet&quot;</span> butonuna basın; o markaya
                ait raporları oluşturun.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
