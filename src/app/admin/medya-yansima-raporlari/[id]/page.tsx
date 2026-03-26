'use client';

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
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

const defaultForm = {
  name: '',
  logoUrl: '',
  pdfUrl: '',
  isPublished: true,
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
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState('');

  const loadBrand = useCallback(async () => {
    const res = await fetch('/api/admin/media-reports', { credentials: 'include' });
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
    const res = await fetch(`/api/admin/media-reports/${brandId}/sub-brands`, { credentials: 'include' });
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
      if (!form.pdfUrl.trim()) {
        throw new Error('Lutfen once PDF dosyasi yukleyin ya da PDF URL girin.');
      }
      const endpoint = editId
        ? `/api/admin/media-reports/sub-brands/${editId}`
        : `/api/admin/media-reports/${brandId}/sub-brands`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Kaydetme hatasi');
      setMessage(editId ? 'Alt marka guncellendi.' : 'Alt marka olusturuldu.');
      setEditId(null);
      setForm(defaultForm);
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
      logoUrl: item.logo_url || '',
      pdfUrl: item.pdf_url || '',
      isPublished: item.is_published !== false,
    });
    setMessage('');
  }

  async function removeItem(id: string) {
    if (!window.confirm('Bu alt markayi silmek istiyor musunuz?')) return;
    const res = await fetch(`/api/admin/media-reports/sub-brands/${id}`, {
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
    setMessage('Alt marka silindi.');
    await loadSubBrands();
  }

  async function uploadLogo(file: File | null) {
    if (!file) return;
    setUploadingLogo(true);
    setMessage('');
    try {
      if (!file.type.startsWith('image/')) throw new Error('Sadece gorsel yukleyebilirsiniz.');
      const formData = new FormData();
      formData.append('files', file);
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
      setMessage('Alt marka logosu yuklendi.');
    } catch (e: any) {
      setMessage(e.message ?? 'Logo upload hatasi');
    } finally {
      setUploadingLogo(false);
    }
  }

  async function uploadPdf(file: File | null) {
    if (!file) return;
    setUploadingPdf(true);
    setMessage('');
    try {
      if (file.type !== 'application/pdf') throw new Error('Sadece PDF yukleyebilirsiniz.');
      const res = await fetch('/api/admin/upload-pdf/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'PDF upload basarisiz');

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
      if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase ayarlari eksik.');

      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const uploadPath = String(data.path || '');
      const uploadToken = String(data.token || '');
      const publicUrl = String(data.publicUrl || data.url || '');
      if (!uploadPath || !uploadToken || !publicUrl) throw new Error('Signed upload bilgisi eksik.');
      const { error } = await supabase.storage.from('project-pdf').uploadToSignedUrl(uploadPath, uploadToken, file, {
        contentType: 'application/pdf',
        upsert: true,
      });
      if (error) throw new Error(`PDF upload basarisiz: ${error.message}`);
      setForm((prev) => ({ ...prev, pdfUrl: publicUrl }));
      setMessage('PDF yuklendi.');
    } catch (e: any) {
      setMessage(e.message ?? 'PDF upload hatasi');
    } finally {
      setUploadingPdf(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Alt Marka Yonetimi</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Marka: <span className="text-zinc-200">{brand?.name || 'Yukleniyor...'}</span>
            </p>
          </div>
          <Link href="/admin/medya-yansima-raporlari" className="rounded border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-800">
            Markalara Don
          </Link>
        </div>

        {message ? <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">{message}</div> : null}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="text-lg font-semibold">{editId ? 'Alt Markayi Duzenle' : 'Alt Marka Ekle'}</h2>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Alt Marka Adi</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="Ornek: Rixos Radamis"
                required
              />
            </div>

            <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <label className="text-xs text-zinc-400">Alt Marka Logosu</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingLogo}
                onChange={(e) => void uploadLogo(e.target.files?.[0] || null)}
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-100 hover:file:bg-zinc-600"
              />
              <input
                value={form.logoUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="https://...logo.png"
              />
            </div>

            <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <label className="text-xs text-zinc-400">PDF Yukle</label>
              <input
                type="file"
                accept="application/pdf"
                disabled={uploadingPdf}
                onChange={(e) => void uploadPdf(e.target.files?.[0] || null)}
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-100 hover:file:bg-zinc-600"
              />
              <input
                value={form.pdfUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, pdfUrl: e.target.value }))}
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="https://...pdf"
              />
              <p className="text-xs text-zinc-500">
                PDF yuklediginizde bu alan otomatik dolar. Istersen elle URL de girebilirsin.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
              />
              Yayinlansin
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={loading || uploadingLogo || uploadingPdf}
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
                  }}
                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
                >
                  Iptal
                </button>
              ) : null}
            </div>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="text-lg font-semibold">Kayitli Alt Markalar</h2>
            <div className="mt-3 max-h-[36rem] space-y-3 overflow-auto pr-1">
              {items.map((item) => {
                const publicPath = `/medya-yansima-raporu/${brand?.slug || ''}/${item.slug}`;
                return (
                  <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <p className="text-sm font-semibold text-zinc-100">{item.name}</p>
                    <a href={publicPath} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-teal-400 hover:underline">
                      {publicPath}
                    </a>
                    <p className="mt-1 break-all text-xs text-zinc-500">{item.pdf_url}</p>
                    {item.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.logo_url} alt={item.name} className="mt-2 h-12 w-auto rounded bg-white p-1.5" />
                    ) : null}
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => fillForEdit(item)} className="rounded border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800">
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
              {!items.length ? <p className="text-sm text-zinc-400">Henuz alt marka yok.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
