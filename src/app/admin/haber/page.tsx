'use client';

import Link from 'next/link';
import { hrefForNewsCard } from '@/lib/news-href';
import { resolveNewsImageSrc } from '@/lib/news-api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PlatformLink = { href: string; image: string; label: string };
type NewsItem = {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  category: string | null;
  category_en: string | null;
  description: string;
  description_en: string | null;
  image: string | null;
  platform_links: PlatformLink[] | null;
  platform_links_en: PlatformLink[] | null;
  is_published: boolean;
  noindex: boolean;
  published_at: string | null;
  updated_at: string;
};

type PlatformInput = { label: string; image: string; href: string };

const defaultForm = {
  title: '',
  titleEn: '',
  slug: '',
  category: 'Haber',
  categoryEn: '',
  description: '',
  descriptionEn: '',
  image: '',
  platformLinks: [{ label: '', image: '', href: '' }] as PlatformInput[],
  platformLinksEn: [{ label: '', image: '', href: '' }] as PlatformInput[],
  isPublished: true,
  noindex: false,
};

function normalizePlatformInputs(links: PlatformInput[]): PlatformLink[] {
  return links.map((x) => ({
    label: x.label.trim(),
    image: x.image.trim(),
    href: x.href.trim(),
  })).filter((x) => x.label && x.image && x.href);
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadNews() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/news', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Haberler alinamadi');
      setItems(data.items || []);
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  function fillForEdit(item: NewsItem) {
    setEditId(item.id);
    setForm({
      title: item.title || '',
      titleEn: item.title_en || '',
      slug: item.slug || '',
      category: item.category || 'Haber',
      categoryEn: item.category_en || '',
      description: item.description || '',
      descriptionEn: item.description_en || '',
      image: item.image || '',
      platformLinks:
        (item.platform_links || []).length > 0
          ? (item.platform_links || []).map((x) => ({ label: x.label || '', image: x.image || '', href: x.href || '' }))
          : [{ label: '', image: '', href: '' }],
      platformLinksEn:
        (item.platform_links_en || []).length > 0
          ? (item.platform_links_en || []).map((x) => ({ label: x.label || '', image: x.image || '', href: x.href || '' }))
          : [{ label: '', image: '', href: '' }],
      isPublished: item.is_published !== false,
      noindex: item.noindex === true,
    });
    setMessage('Duzenleme modu aktif.');
  }

  function resetForm() {
    setEditId(null);
    setForm(defaultForm);
  }

  async function uploadSingleImage(file: File) {
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
    return String(url);
  }

  function addPlatformRow(lang: 'tr' | 'en') {
    setForm((prev) => ({
      ...prev,
      [lang === 'tr' ? 'platformLinks' : 'platformLinksEn']: [
        ...(lang === 'tr' ? prev.platformLinks : prev.platformLinksEn),
        { label: '', image: '', href: '' },
      ],
    }));
  }

  function removePlatformRow(lang: 'tr' | 'en', index: number) {
    setForm((prev) => {
      const current = lang === 'tr' ? prev.platformLinks : prev.platformLinksEn;
      const next = current.filter((_, i) => i !== index);
      return {
        ...prev,
        [lang === 'tr' ? 'platformLinks' : 'platformLinksEn']: next.length ? next : [{ label: '', image: '', href: '' }],
      };
    });
  }

  function updatePlatformRow(lang: 'tr' | 'en', index: number, key: keyof PlatformInput, value: string) {
    setForm((prev) => ({
      ...prev,
      [lang === 'tr' ? 'platformLinks' : 'platformLinksEn']: (lang === 'tr' ? prev.platformLinks : prev.platformLinksEn).map(
        (row, i) => (i === index ? { ...row, [key]: value } : row)
      ),
    }));
  }

  async function handleFeaturedImageUpload(file: File) {
    try {
      setUploading(true);
      setMessage('One cikan gorsel yukleniyor...');
      const url = await uploadSingleImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      setMessage('One cikan gorsel yuklendi.');
    } catch (error: any) {
      setMessage(error.message ?? 'One cikan gorsel yuklenemedi.');
    } finally {
      setUploading(false);
    }
  }

  async function handlePlatformImageUpload(lang: 'tr' | 'en', index: number, file: File) {
    try {
      setUploading(true);
      setMessage(`Platform gorseli yukleniyor (${lang.toUpperCase()} #${index + 1})...`);
      const url = await uploadSingleImage(file);
      updatePlatformRow(lang, index, 'image', url);
      setMessage(`Platform gorseli yuklendi (${lang.toUpperCase()} #${index + 1}).`);
    } catch (error: any) {
      setMessage(error.message ?? 'Platform gorseli yuklenemedi.');
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
        image: form.image,
        platformLinks: normalizePlatformInputs(form.platformLinks),
        platformLinksEn: normalizePlatformInputs(form.platformLinksEn),
        isPublished: form.isPublished,
        noindex: form.noindex,
      };
      const endpoint = editId ? `/api/admin/news/${editId}` : '/api/admin/news';
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
      setMessage(editId ? 'Haber guncellendi.' : 'Haber olusturuldu.');
      resetForm();
      await loadNews();
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    const ok = window.confirm('Bu haberi silmek istedigine emin misin?');
    if (!ok) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Haber silinemedi');
      if (editId === id) resetForm();
      setItems((prev) => prev.filter((x) => x.id !== id));
      setMessage('Haber silindi.');
    } catch (error: any) {
      setMessage(error.message ?? 'Silme hatasi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Geri Gel
            </button>
            <h1 className="text-2xl font-semibold">Haber Yonetimi</h1>
          </div>
          <Link
            href="/kategori/haberler"
            target="_blank"
            className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
          >
            Kategori Sayfasi
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-sm text-zinc-300">
            Bu formdaki alanlar, `haber/[slug]` sayfasindaki baslik, aciklama, kapak gorseli ve platform kutularini birebir besler.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
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
                placeholder="lara-fabian-sevgililer-gunu-nde..."
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Kategori</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-400">Kategori (EN)</span>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                value={form.categoryEn}
                onChange={(e) => setForm((prev) => ({ ...prev, categoryEn: e.target.value }))}
                placeholder="News"
              />
            </label>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            <p className="mb-2 text-xs text-zinc-400">Kapak gorseli yukle (manuel)</p>
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
            <span className="text-xs text-zinc-400">Aciklama *</span>
            <textarea
              className="min-h-[120px] w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-zinc-400">Aciklama (EN)</span>
            <textarea
              className="min-h-[120px] w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
              value={form.descriptionEn}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              placeholder="Description in English"
            />
          </label>

          <div className="space-y-3">
            <span className="text-xs text-zinc-400">Yayinlanan platformlar (TR / EN)</span>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">TR platformlar</span>
                  <button
                    type="button"
                    onClick={() => addPlatformRow('tr')}
                    className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
                  >
                    TR Platform Ekle
                  </button>
                </div>
                {form.platformLinks.map((platform, index) => (
                  <div key={`tr-${index}`} className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                    <label className="space-y-1">
                      <span className="text-xs text-zinc-400">Platform Adi</span>
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        value={platform.label}
                        onChange={(e) => updatePlatformRow('tr', index, 'label', e.target.value)}
                        placeholder="DHA"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs text-zinc-400">Logo Gorsel URL</span>
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        value={platform.image}
                        onChange={(e) => updatePlatformRow('tr', index, 'image', e.target.value)}
                        placeholder="/demiroren-haber-ajansi.webp"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs text-zinc-400">Haber URL</span>
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        value={platform.href}
                        onChange={(e) => updatePlatformRow('tr', index, 'href', e.target.value)}
                        placeholder="https://..."
                      />
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,.heic,.heif,.avif,.tif,.tiff,.webp,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handlePlatformImageUpload('tr', index, file);
                          e.currentTarget.value = '';
                        }}
                        className="block w-full max-w-md text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:text-zinc-100 hover:file:bg-zinc-700"
                      />
                      {platform.image ? (
                        <img
                          src={resolveNewsImageSrc(platform.image)}
                          alt={`${platform.label || 'Platform'} logo onizleme`}
                          className="h-12 w-12 rounded border border-zinc-700 bg-white object-contain"
                        />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removePlatformRow('tr', index)}
                        className="rounded border border-rose-800 px-3 py-1 text-xs text-rose-300 hover:bg-rose-950/40"
                      >
                        Platformu Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">EN platformlar</span>
                  <button
                    type="button"
                    onClick={() => addPlatformRow('en')}
                    className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
                  >
                    EN Platform Ekle
                  </button>
                </div>
                {form.platformLinksEn.map((platform, index) => (
                  <div key={`en-${index}`} className="grid gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                    <label className="space-y-1">
                      <span className="text-xs text-zinc-400">Platform Name</span>
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        value={platform.label}
                        onChange={(e) => updatePlatformRow('en', index, 'label', e.target.value)}
                        placeholder="AP News"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs text-zinc-400">Logo Image URL</span>
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        value={platform.image}
                        onChange={(e) => updatePlatformRow('en', index, 'image', e.target.value)}
                        placeholder="/ap-news.svg"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs text-zinc-400">News URL</span>
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                        value={platform.href}
                        onChange={(e) => updatePlatformRow('en', index, 'href', e.target.value)}
                        placeholder="https://..."
                      />
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,.heic,.heif,.avif,.tif,.tiff,.webp,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handlePlatformImageUpload('en', index, file);
                          e.currentTarget.value = '';
                        }}
                        className="block w-full max-w-md text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:text-zinc-100 hover:file:bg-zinc-700"
                      />
                      {platform.image ? (
                        <img
                          src={resolveNewsImageSrc(platform.image)}
                          alt={`${platform.label || 'Platform'} logo preview`}
                          className="h-12 w-12 rounded border border-zinc-700 bg-white object-contain"
                        />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removePlatformRow('en', index)}
                        className="rounded border border-rose-800 px-3 py-1 text-xs text-rose-300 hover:bg-rose-950/40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
              />
              Yayinla
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(e) => setForm((prev) => ({ ...prev, noindex: e.target.checked }))}
              />
              Noindex
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-60"
            >
              {editId ? 'Haberi Guncelle' : 'Haberi Olustur'}
            </button>
            {editId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
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
            <div key={item.id} className="relative rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="absolute right-3 top-3 rounded border border-rose-800/80 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-950/40"
              >
                Sil
              </button>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-zinc-800 px-2 py-1">{item.is_published ? 'Yayinda' : 'Taslak'}</span>
                <span className="rounded bg-zinc-800 px-2 py-1">{item.noindex ? 'Noindex' : 'Index'}</span>
                <span className="text-zinc-500">Slug: {item.slug}</span>
              </div>
              <p className="mt-2 font-medium">{item.title}</p>
              <p className="text-sm text-zinc-400">{item.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fillForEdit(item)}
                  className="rounded bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600"
                >
                  Duzenle
                </button>
                <a
                  href={hrefForNewsCard('admin', item.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
                >
                  Detay Sayfasi
                </a>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 ? <p className="text-sm text-zinc-500">Henuz haber yok.</p> : null}
        </div>
      </div>
    </main>
  );
}
