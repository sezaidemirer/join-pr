'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { resolveNewsImageSrc } from '@/lib/news-api';

type BlogItem = {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  category: string | null;
  category_en: string | null;
  description: string;
  description_en: string | null;
  content: string;
  content_en: string | null;
  image: string | null;
  is_published: boolean;
  noindex: boolean;
  published_at: string | null;
  updated_at: string;
};

const defaultForm = {
  title: '',
  titleEn: '',
  slug: '',
  category: '',
  categoryEn: '',
  description: '',
  descriptionEn: '',
  content: '',
  contentEn: '',
  image: '',
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [items, setItems] = useState<BlogItem[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadBlog() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/blog', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yazilar alinamadi');
      setItems(data.items || []);
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  function fillForEdit(item: BlogItem) {
    setEditId(item.id);
    setForm({
      title: item.title || '',
      titleEn: item.title_en || '',
      slug: item.slug || '',
      category: item.category || '',
      categoryEn: item.category_en || '',
      description: item.description || '',
      descriptionEn: item.description_en || '',
      content: item.content || '',
      contentEn: item.content_en || '',
      image: item.image || '',
    });
    setMessage('Duzenleme modu aktif.');
  }

  function resetForm() {
    setEditId(null);
    setForm(defaultForm);
  }

  async function handleFeaturedImageUpload(file: File) {
    try {
      setUploading(true);
      setMessage('Kapak gorseli yukleniyor...');
      const fd = new FormData();
      fd.append('files', file);
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        throw new Error('Oturum suresi doldu, yeniden giris yapin.');
      }
      if (!res.ok) throw new Error(data.error || 'Gorsel yuklenemedi');
      const url = (data.urls || [])[0];
      if (!url) throw new Error('Yuklenen gorsel URL uretemedi');
      setForm((prev) => ({ ...prev, image: String(url) }));
      setMessage('Kapak gorseli yuklendi.');
    } catch (error: any) {
      setMessage(error.message ?? 'Kapak gorseli yuklenemedi.');
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        title: form.title,
        titleEn: form.titleEn,
        slug: form.slug,
        category: form.category,
        categoryEn: form.categoryEn,
        description: form.description,
        descriptionEn: form.descriptionEn,
        content: form.content,
        contentEn: form.contentEn,
        image: form.image,
      };
      const endpoint = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Kayit basarisiz');
      setMessage(editId ? 'Yazi guncellendi.' : 'Yazi olusturuldu.');
      resetForm();
      await loadBlog();
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    const ok = window.confirm('Bu yaziyi silmek istedigine emin misin?');
    if (!ok) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Yazi silinemedi');
      if (editId === id) resetForm();
      setItems((prev) => prev.filter((x) => x.id !== id));
      setMessage('Yazi silindi.');
    } catch (error: any) {
      setMessage(error.message ?? 'Silme hatasi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlog();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Geri Gel
            </button>
            <h1 className="text-xl font-semibold sm:text-2xl">Blog Yonetimi</h1>
          </div>
          <Link
            href="/kategori/blog"
            target="_blank"
            className="inline-flex justify-center rounded border border-zinc-700 px-3 py-1.5 text-center text-xs hover:bg-zinc-800 sm:shrink-0"
          >
            Blog Sayfasi
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Baslik *</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Baslik (EN)</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.titleEn}
                onChange={(e) => setForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                placeholder="Title in English"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Slug (bos birakirsan basliktan uretilir)</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="dijital-pazarlamada-yeni-trendler"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Kategori</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Pazarlama"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Kategori (EN)</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.categoryEn}
                onChange={(e) => setForm((prev) => ({ ...prev, categoryEn: e.target.value }))}
                placeholder="Marketing"
              />
            </label>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            <p className="mb-2 text-xs text-zinc-400">Kapak gorseli yukle</p>
            <input
              type="file"
              accept="image/*,.heic,.heif,.avif,.tif,.tiff,.webp,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFeaturedImageUpload(file);
                e.currentTarget.value = '';
              }}
              className="block w-full text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:text-zinc-100 hover:file:bg-zinc-700"
            />
            {form.image ? (
              <div className="mt-3">
                <p className="mb-2 text-[11px] text-zinc-500">Kapak gorsel onizleme</p>
                <img
                  src={resolveNewsImageSrc(form.image)}
                  alt="Kapak gorsel onizleme"
                  className="h-24 w-24 rounded-md border border-zinc-700 object-cover"
                />
              </div>
            ) : null}
          </div>

          <label className="block space-y-1">
            <span className="text-xs text-zinc-400">Kisa aciklama (ozet) *</span>
            <textarea
              className="min-h-[80px] w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-zinc-400">Kisa aciklama (EN)</span>
            <textarea
              className="min-h-[80px] w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={form.descriptionEn}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              placeholder="Short description in English"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-zinc-400">Yazi icerigi (tam metin) *</span>
            <textarea
              className="min-h-[280px] w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-zinc-400">Yazi icerigi (EN)</span>
            <textarea
              className="min-h-[280px] w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={form.contentEn}
              onChange={(e) => setForm((prev) => ({ ...prev, contentEn: e.target.value }))}
              placeholder="Full article content in English"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full rounded bg-emerald-600 px-4 py-2.5 text-sm font-medium hover:bg-emerald-500 disabled:opacity-60 sm:w-auto sm:py-2"
            >
              {editId ? 'Yaziyi Guncelle' : 'Yaziyi Olustur'}
            </button>
            {editId ? (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded border border-zinc-700 px-4 py-2.5 text-sm hover:bg-zinc-800 sm:w-auto sm:py-2"
              >
                Duzenlemeyi Iptal Et
              </button>
            ) : null}
          </div>
        </form>

        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
        {loading || uploading ? <p className="text-sm text-zinc-500">Yukleniyor...</p> : null}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="relative rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 pr-14 sm:pr-4">
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="absolute right-3 top-3 rounded border border-rose-800/80 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-950/40"
              >
                Sil
              </button>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-zinc-500">Slug: {item.slug}</span>
              </div>
              <p className="mt-2 font-medium">{item.title}</p>
              <p className="text-sm text-zinc-400">{item.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fillForEdit(item)}
                  className="rounded bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600"
                >
                  Duzenle
                </button>
                <a
                  href={`/blog/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
                >
                  Detay Sayfasi
                </a>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 ? <p className="text-sm text-zinc-500">Henuz yazi yok.</p> : null}
        </div>
      </div>
    </main>
  );
}
