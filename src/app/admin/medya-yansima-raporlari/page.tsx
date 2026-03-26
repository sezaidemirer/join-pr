'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type BrandItem = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_published: boolean;
  updated_at: string;
};

const defaultForm = {
  name: '',
  logoUrl: '',
  isPublished: true,
};

export default function AdminMediaReportsPage() {
  const router = useRouter();
  const [items, setItems] = useState<BrandItem[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const loadItems = useCallback(async () => {
    const res = await fetch('/api/admin/media-reports', { credentials: 'include' });
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
        body: JSON.stringify(form),
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
      isPublished: item.is_published !== false,
    });
    setMessage('');
  }

  async function removeItem(id: string) {
    if (!window.confirm('Bu markayi silmek istiyor musunuz? Alt markalari da silinir.')) return;
    setMessage('');
    const res = await fetch(`/api/admin/media-reports/${id}`, {
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
      setMessage(`Logo cok buyuk. Maksimum ${MAX_MB}MB yukleyebilirsiniz.`);
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece gorsel dosyasi yukleyebilirsiniz.');
      }

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
      if (!res.ok) throw new Error(data.error || 'Logo upload basarisiz');
      const uploaded = Array.isArray(data.urls) ? data.urls[0] : '';
      if (!uploaded) throw new Error('Yuklenen logo URL alinamadi.');
      setForm((prev) => ({ ...prev, logoUrl: uploaded }));
      setMessage('Logo yuklendi.');
    } catch (error: any) {
      setMessage(error.message ?? 'Logo upload hatasi');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Medya Yansima Raporlari</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Once marka ekleyin, sonra markaya girip alt marka + PDF + logo ekleyin.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-800"
          >
            Panele Don
          </Link>
        </div>

        {message ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">{message}</div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
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
              <label className="text-xs text-zinc-400">Marka Logosu</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => void uploadLogo(e.target.files?.[0] || null)}
                className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-100 hover:file:bg-zinc-600"
              />
              <input
                value={form.logoUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="https://...logo.png"
              />
              {form.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logoUrl} alt="Marka logosu" className="h-14 w-auto rounded bg-white p-2" />
              ) : null}
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
                  }}
                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
                >
                  Iptal
                </button>
              ) : null}
            </div>
          </form>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.logo_url} alt={item.name} className="mt-2 h-12 w-auto rounded bg-white p-1.5" />
                    ) : null}
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/admin/medya-yansima-raporlari/${item.id}`}
                        className="rounded border border-teal-700 px-2 py-1 text-xs text-teal-300 hover:bg-teal-950/40"
                      >
                        Alt Marka Yonet
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
      </div>
    </main>
  );
}
