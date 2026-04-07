'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GalleryPreviewImage } from '@/components/admin/GalleryPreviewImage';
import { ensureWebDisplayableImageFile } from '@/lib/ensure-web-displayable-image';
import { inferProjectTypeFromBrandSlug, type ProjectType } from '@/lib/project-type-from-slug';
import { buildPublicProjectUrl } from '@/lib/project-url';
import { fourVideoSlotsFromPayload, parseSponsorshipNotes } from '@/lib/sponsorship-notes';

type GalleryPhoto = { url: string; caption?: string };
type GalleryVideo = { url: string; title?: string; orientation?: 'horizontal' | 'vertical' };
type VideoInput = { url: string; title: string };

type Project = {
  id: string;
  crm_quote_id?: string | number | null;
  quote_id?: string | number | null;
  brand_name: string;
  offer_date: string;
  project_title: string;
  summary: string | null;
  sample_contents: string[] | null;
  photo_gallery: GalleryPhoto[] | null;
  video_gallery: GalleryVideo[] | null;
  notes: string | null;
  noindex: boolean;
  brand_slug: string;
  date_slug: string;
};

type QuoteOption = {
  id: string;
  label: string;
};

const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  production: 'Produksiyon Projesi',
  sponsorship: 'Sponsorluk Projesi',
  press: 'Basin Iletisim Projesi',
};

const defaultForm = {
  brandName: '',
  offerDate: '',
  projectTitle: '',
  summary: '',
  sampleContentsText: '',
  photoGalleryText: '',
  horizontalVideos: Array.from({ length: 4 }, () => ({ url: '', title: '' })),
  verticalVideos: Array.from({ length: 4 }, () => ({ url: '', title: '' })),
  notes: '',
};

function parsePhotoGallery(text: string): GalleryPhoto[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, caption] = line.split('|').map((x) => x.trim());
      return { url, caption: caption || undefined };
    })
    .filter((x) => x.url)
    .filter((x) => x.url.startsWith('/') || /^https?:\/\//i.test(x.url));
}

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

export default function YeniProjePage() {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<ProjectType>('production');

  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');
  const [savedPublicUrl, setSavedPublicUrl] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [quoteOptions, setQuoteOptions] = useState<QuoteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sponsorshipPdfUrl, setSponsorshipPdfUrl] = useState('');
  const [sponsorshipSlideUrls, setSponsorshipSlideUrls] = useState<string[]>([]);
  const [sponsorshipParticipantsUrl, setSponsorshipParticipantsUrl] = useState('');
  const [sponsorshipVideoUrls, setSponsorshipVideoUrls] = useState<string[]>(['', '', '', '']);
  const [sponsorshipPhotoUrls, setSponsorshipPhotoUrls] = useState<string[]>([]);

  const sampleContents = useMemo(
    () =>
      form.sampleContentsText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
    [form.sampleContentsText]
  );

  function toQuoteLabel(quote: any) {
    const brand = quote.brand_name || quote.company_name || quote.customer_name || quote.client_name || 'Teklif';
    const title = quote.title || quote.subject || quote.quote_title || '';
    const date = quote.created_at ? String(quote.created_at).slice(0, 10) : '';
    const num = quote.quote_no || quote.quote_number || quote.zoho_quote_id || quote.id;
    const amount =
      quote.grand_total != null
        ? `${Number(quote.grand_total).toLocaleString('tr-TR')} ${quote.currency_code || 'USD'}`
        : '';
    const validTill = quote.valid_till ? String(quote.valid_till).slice(0, 10) : '';
    const owner =
      quote.created_by_name ||
      quote.created_user_name ||
      quote.owner_name ||
      quote.sales_rep_name ||
      quote.account_manager_name ||
      quote.prepared_by ||
      quote.created_by ||
      '';
    return `${brand}${title ? ` - ${title}` : ''}${amount ? ` | ${amount}` : ''}${
      validTill ? ` | Son: ${validTill}` : ''
    }${owner ? ` | Olusturan: ${owner}` : ''}${date ? ` (${date})` : ''} [${num}]`;
  }

  async function loadQuotes() {
    try {
      const res = await fetch('/api/admin/quotes', { credentials: 'include' });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Teklifler alinamadi');
      const options = (data.quotes || []).map((q: any) => ({ id: q.id, label: toQuoteLabel(q) })) as QuoteOption[];
      setQuoteOptions(options);
    } catch (error: any) {
      setMessage(error.message ?? 'Teklif listesi alinamadi');
    }
  }

  async function loadProject(id: string) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/projects', { credentials: 'include' });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Projeler alinamadi');
      const offers = (data.offers || []) as Project[];
      const found = offers.find((x) => x.id === id);
      if (!found) throw new Error('Proje bulunamadi');

      const horizontalInputs: VideoInput[] = Array.from({ length: 4 }, () => ({ url: '', title: '' }));
      const verticalInputs: VideoInput[] = Array.from({ length: 4 }, () => ({ url: '', title: '' }));

      (found.video_gallery || [])
        .filter((x: GalleryVideo) => (x.orientation || 'horizontal') === 'horizontal')
        .slice(0, 4)
        .forEach((x: GalleryVideo, i: number) => {
          horizontalInputs[i] = { url: x.url || '', title: x.title || '' };
        });

      (found.video_gallery || [])
        .filter((x: GalleryVideo) => x.orientation === 'vertical')
        .slice(0, 4)
        .forEach((x: GalleryVideo, i: number) => {
          verticalInputs[i] = { url: x.url || '', title: x.title || '' };
        });

      const offerDateRaw = found.offer_date != null ? String(found.offer_date) : '';
      const offerDateNorm = offerDateRaw.slice(0, 10);

      setForm({
        brandName: found.brand_name,
        offerDate: offerDateNorm,
        projectTitle: found.project_title,
        summary: found.summary || '',
        sampleContentsText: (found.sample_contents || []).join('\n'),
        photoGalleryText: (found.photo_gallery || [])
          .map((x: GalleryPhoto) => `${x.url}${x.caption ? `|${x.caption}` : ''}`)
          .join('\n'),
        horizontalVideos: horizontalInputs,
        verticalVideos: verticalInputs,
        notes: found.notes || '',
      });
      setQuoteId(String(found.crm_quote_id ?? found.quote_id ?? ''));
      const inferred = inferProjectTypeFromBrandSlug(found.brand_slug);
      if (inferred) setProjectType(inferred);
      if (inferred === 'sponsorship') {
        const payload = parseSponsorshipNotes(found.notes);
        setSponsorshipPdfUrl(payload.pdfUrl || '');
        setSponsorshipSlideUrls(payload.slideUrls || []);
        setSponsorshipParticipantsUrl(payload.participantsUrl || '');
        setSponsorshipVideoUrls(fourVideoSlotsFromPayload(payload));
        setSponsorshipPhotoUrls((payload.photoUrls || []).slice(0, 4));
      } else {
        setSponsorshipPdfUrl('');
        setSponsorshipSlideUrls([]);
        setSponsorshipParticipantsUrl('');
        setSponsorshipVideoUrls(['', '', '', '']);
        setSponsorshipPhotoUrls([]);
      }
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEditId(params.get('id'));
    const type = params.get('type');
    if (type === 'production' || type === 'sponsorship' || type === 'press') {
      setProjectType(type);
    }
  }, []);

  useEffect(() => {
    if (editId) loadProject(editId);
  }, [editId]);

  useEffect(() => {
    loadQuotes();
  }, []);

  async function submit() {
    setLoading(true);
    setMessage('');
    try {
      if (!form.projectTitle.trim()) {
        throw new Error('Proje basligi zorunludur.');
      }
      if (!quoteId.trim() && !editId) {
        throw new Error('Lutfen CRM teklif seciniz.');
      }
      if (projectType !== 'sponsorship' && (!form.brandName.trim() || !form.offerDate.trim())) {
        throw new Error('Marka adi ve tarih zorunludur.');
      }
      if (projectType === 'sponsorship' && !sponsorshipPdfUrl.trim()) {
        throw new Error('Sponsorluk projesi icin PDF yuklemek zorunludur.');
      }

      const sponsorshipVideos = (sponsorshipVideoUrls || [])
        .map((u) => (u || '').trim())
        .filter(Boolean)
        .slice(0, 4);
      if (projectType === 'sponsorship') {
        const badSponsorVideo = sponsorshipVideos.find((u) => !isYouTubeUrl(u));
        if (badSponsorVideo) {
          throw new Error('Sponsorluk ornek videolari icin sadece YouTube linki girebilirsiniz.');
        }
      }

      const horizontalSource = Array.isArray(form.horizontalVideos) ? form.horizontalVideos : [];
      const verticalSource = Array.isArray(form.verticalVideos) ? form.verticalVideos : [];

      const horizontalVideos: GalleryVideo[] = horizontalSource
        .map((x: VideoInput) => ({
          url: (x?.url || '').trim(),
          title: (x?.title || '').trim(),
          orientation: 'horizontal' as const,
        }))
        .filter((x) => x.url);
      const verticalVideos: GalleryVideo[] = verticalSource
        .map((x: VideoInput) => ({
          url: (x?.url || '').trim(),
          title: (x?.title || '').trim(),
          orientation: 'vertical' as const,
        }))
        .filter((x) => x.url);

      const allVideos = [...horizontalVideos, ...verticalVideos];
      const linkInTitle = allVideos.find((x) => x.title && isYouTubeUrl(x.title));
      if (linkInTitle) {
        throw new Error(
          'Video URL alanina sadece link girin. Baslik alanina YouTube linki yapistirmayin; her link icin ayri URL kutusunu kullanin.'
        );
      }
      const invalidYoutube = allVideos.find((x) => !isYouTubeUrl(x.url));
      if (invalidYoutube) {
        throw new Error('Video galeride sadece YouTube linkleri kullanabilirsiniz.');
      }

      const sponsorshipOfferDate = editId
        ? (form.offerDate.trim().slice(0, 10) || new Date().toISOString().slice(0, 10))
        : new Date().toISOString().slice(0, 10);
      const offerDateForPayload =
        projectType === 'sponsorship' ? sponsorshipOfferDate : form.offerDate.trim();

      const payload = {
        quoteId: quoteId.trim() || null,
        brandName: projectType === 'sponsorship' ? form.projectTitle.trim() : form.brandName.trim(),
        offerDate: offerDateForPayload,
        projectTitle: form.projectTitle.trim(),
        projectType,
        summary: form.summary,
        sampleContents: projectType === 'sponsorship' ? [] : sampleContents,
        photoGallery: projectType === 'sponsorship' ? [] : parsePhotoGallery(form.photoGalleryText),
        videoGallery: projectType === 'sponsorship' ? [] : allVideos,
        notes:
          projectType === 'sponsorship'
            ? JSON.stringify({
                pdfUrl: sponsorshipPdfUrl.trim(),
                slideUrls: sponsorshipSlideUrls,
                participantsUrl: sponsorshipParticipantsUrl.trim(),
                videoUrls: sponsorshipVideos,
                videoUrl: sponsorshipVideos[0] || '',
                photoUrls: sponsorshipPhotoUrls.slice(0, 4),
              })
            : form.notes,
        noindex: false,
      };
      const endpoint = editId ? `/api/admin/projects/${editId}` : '/api/admin/projects';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Kaydetme hatasi');

      const saved = data.offer as Project;
      const publicUrl = buildPublicProjectUrl(saved.brand_slug, saved.date_slug);
      setSavedPublicUrl(publicUrl);
      setMessage(editId ? `Proje guncellendi: ${publicUrl}` : `Proje kaydedildi: ${publicUrl}`);
      if (!editId) {
        setForm(defaultForm);
        setSponsorshipPdfUrl('');
        setSponsorshipSlideUrls([]);
        setSponsorshipParticipantsUrl('');
        setSponsorshipVideoUrls(['', '', '', '']);
        setSponsorshipPhotoUrls([]);
      }
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  async function uploadSponsorshipPdf(file: File | null) {
    if (!file) return;
    const MAX_PDF_SIZE_MB = 250;
    const maxBytes = MAX_PDF_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      setMessage(`PDF cok buyuk. Maksimum ${MAX_PDF_SIZE_MB}MB yukleyebilirsiniz.`);
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Sadece PDF dosyasi yukleyebilirsiniz.');
      }

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
      const raw = await res.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { error: raw || `Request Error (${res.status})` };
      }
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'PDF upload basarisiz');

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase istemci ayarlari eksik.');
      }

      const uploadPath = String(data.path || '');
      const uploadToken = String(data.token || '');
      const publicUrl = String(data.publicUrl || data.url || '');
      if (!uploadPath || !uploadToken || !publicUrl) {
        throw new Error('Signed upload bilgisi eksik.');
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error: signedUploadError } = await supabase.storage
        .from('project-pdf')
        .uploadToSignedUrl(uploadPath, uploadToken, file, {
          contentType: 'application/pdf',
          upsert: true,
        });
      if (signedUploadError) {
        throw new Error(`PDF upload basarisiz: ${signedUploadError.message}`);
      }

      setSponsorshipPdfUrl(publicUrl);
      setSponsorshipSlideUrls([]);
      setMessage('PDF yuklendi.');
    } catch (error: any) {
      setMessage(error.message ?? 'PDF upload hatasi');
    } finally {
      setUploading(false);
    }
  }

  async function uploadSponsorshipPhotos(fileList: FileList | null, inputEl?: HTMLInputElement | null) {
    if (!fileList || !fileList.length) return;
    if (sponsorshipPhotoUrls.length >= 4) {
      setMessage('En fazla 4 foto ekleyebilirsiniz.');
      return;
    }
    const availableSlots = 4 - sponsorshipPhotoUrls.length;
    const files = Array.from(fileList).slice(0, availableSlots);

    setUploading(true);
    setMessage('');
    const collected: string[] = [];
    try {
      // Dosya basina ayri istek: Vercel/proxy tek POST govde limiti; picker'da 4 dosya tek seferde secilebilir.
      for (let i = 0; i < files.length; i += 1) {
        const formData = new FormData();
        const ready = await ensureWebDisplayableImageFile(files[i]);
        formData.append('files', ready);
        formData.append('storageBucket', 'project-gallery');
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
        if (!res.ok) throw new Error(data.error || `Foto ${i + 1} yuklenemedi`);
        const urls = Array.isArray(data.urls) ? data.urls : [];
        collected.push(...urls);
      }
      setSponsorshipPhotoUrls((prev) => [...prev, ...collected].slice(0, 4));
      setMessage(`${collected.length} foto yuklendi.`);
    } catch (error: any) {
      setMessage(error.message ?? 'Foto upload hatasi');
    } finally {
      if (inputEl) inputEl.value = '';
      setUploading(false);
    }
  }

  async function uploadPhotos(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    setUploading(true);
    setMessage('');
    try {
      const normalized = await Promise.all(
        Array.from(fileList).map((file) => ensureWebDisplayableImageFile(file))
      );
      const formData = new FormData();
      normalized.forEach((file) => formData.append('files', file));
      formData.append('storageBucket', 'project-gallery');

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
      if (!res.ok) throw new Error(data.error || 'Upload basarisiz');

      const urls = (data.urls || []) as string[];
      const appendText = urls.join('\n');
      setForm((s) => ({
        ...s,
        photoGalleryText: s.photoGalleryText ? `${s.photoGalleryText}\n${appendText}` : appendText,
      }));
      setMessage(`${urls.length} gorsel yüklendi ve foto galeriye eklendi.`);
    } catch (error: any) {
      setMessage(error.message ?? 'Upload hatasi');
    } finally {
      setUploading(false);
    }
  }

  function updateVideoField(
    orientation: 'horizontalVideos' | 'verticalVideos',
    index: number,
    field: 'url' | 'title',
    value: string
  ) {
    setForm((s) => {
      const next = [...s[orientation]];
      next[index] = { ...next[index], [field]: value };
      return { ...s, [orientation]: next };
    });
  }

  const photoGalleryPreview = useMemo(() => parsePhotoGallery(form.photoGalleryText), [form.photoGalleryText]);

  function removePhotoFromGalleryLine(urlToRemove: string) {
    const target = urlToRemove.trim();
    setForm((s) => {
      const lines = s.photoGalleryText.split('\n').filter((line) => {
        const u = line.split('|')[0]?.trim() || '';
        return u !== target;
      });
      return { ...s, photoGalleryText: lines.join('\n').trim() };
    });
  }

  async function copySavedLink() {
    if (!savedPublicUrl) return;
    try {
      await navigator.clipboard.writeText(savedPublicUrl);
      setMessage('Proje linki kopyalandi.');
    } catch {
      setMessage('Link kopyalanamadi. Tarayici izinlerini kontrol edin.');
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Link
              href="/admin/proje"
              className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Geri Gel
            </Link>
            <h1 className="text-xl font-semibold sm:text-2xl">
              {editId ? 'Projeyi Duzenle' : 'Yeni Proje'}
            </h1>
          </div>
          <Link
            href="/admin/proje/kutuphane"
            className="inline-flex justify-center rounded border border-zinc-700 px-4 py-2 text-center text-sm hover:bg-zinc-800 sm:shrink-0"
          >
            Projeler
          </Link>
        </div>
        <div className="rounded-lg border border-sky-700/50 bg-sky-900/20 px-4 py-3 text-sm text-sky-200">
          Proje Turu: <span className="font-semibold">{PROJECT_TYPE_LABEL[projectType]}</span>
          {editId ? (
            <span className="mt-1 block text-xs text-sky-300/90">
              Duzenleme modu: alanlari guncelleyip &quot;Projeyi Guncelle&quot; ile kaydedin. Kutuphaneden acildiysaniz bu proje zaten secilidir.
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-500">
              CRM teklif{' '}
              {!editId ? (
                <span className="text-amber-400">(yeni proje icin zorunlu)</span>
              ) : (
                <span className="text-zinc-400">(duzenlemede bos birakilabilir)</span>
              )}
            </label>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
              value={quoteId}
              onChange={(e) => setQuoteId(e.target.value)}
            >
              <option value="">CRM teklif seciniz</option>
              {quoteOptions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>
          {projectType !== 'sponsorship' ? (
            <>
          <input
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Marka Adi (or. AJet)"
            value={form.brandName}
            onChange={(e) => setForm((s) => ({ ...s, brandName: e.target.value }))}
          />
          <input
            type="date"
            className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={form.offerDate}
            onChange={(e) => setForm((s) => ({ ...s, offerDate: e.target.value }))}
          />
            </>
          ) : null}
          <input
            className="md:col-span-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Proje Basligi"
            value={form.projectTitle}
            onChange={(e) => setForm((s) => ({ ...s, projectTitle: e.target.value }))}
          />
          <textarea
            className="md:col-span-2 min-h-20 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder={projectType === 'sponsorship' ? 'Alt metni' : 'Kisa ozet'}
            value={form.summary}
            onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
          />
          {projectType === 'sponsorship' ? (
            <>
              <div className="md:col-span-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                <label className="mb-2 block text-sm text-zinc-300">PDF yukle</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => uploadSponsorshipPdf(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-700 file:px-3 file:py-2 file:text-white hover:file:bg-sky-600"
                  disabled={uploading}
                />
                {sponsorshipPdfUrl ? (
                  <p className="mt-2 break-all text-xs text-emerald-300">Yuklenen PDF: {sponsorshipPdfUrl}</p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">Henüz PDF yuklenmedi.</p>
                )}
                {sponsorshipSlideUrls.length > 0 ? (
                  <p className="mt-1 text-xs text-zinc-400">Slide sayisi: {sponsorshipSlideUrls.length}</p>
                ) : null}
              </div>

              <input
                className="md:col-span-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                placeholder="Katilimcilar buton linki"
                value={sponsorshipParticipantsUrl}
                onChange={(e) => setSponsorshipParticipantsUrl(e.target.value)}
              />

              <div className="md:col-span-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                <p className="mb-3 text-sm text-zinc-300">Ornek videolar (maks 4, sadece YouTube)</p>
                <div className="space-y-2">
                  {sponsorshipVideoUrls.map((url, i) => (
                    <input
                      key={`sponsor-v-${i}`}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                      placeholder={`YouTube linki ${i + 1}`}
                      value={url}
                      onChange={(e) =>
                        setSponsorshipVideoUrls((prev) => {
                          const next = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                <label className="mb-2 block text-sm text-zinc-300">Foto yukle (max 4, Supabase)</label>
                <input
                  type="file"
                  accept="image/*,image/heic,image/heif,.heic,.heif"
                  multiple
                  onChange={(e) => uploadSponsorshipPhotos(e.target.files, e.currentTarget)}
                  className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-700 file:px-3 file:py-2 file:text-white hover:file:bg-sky-600"
                  disabled={uploading || sponsorshipPhotoUrls.length >= 4}
                />
                <p className="mt-2 text-xs text-zinc-500">Yuklenen foto sayisi: {sponsorshipPhotoUrls.length}/4</p>
                {sponsorshipPhotoUrls.length > 0 ? (
                  <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
                    {sponsorshipPhotoUrls.map((src) => (
                      <div key={src} className="relative overflow-hidden rounded border border-zinc-800">
                        <div className="aspect-square w-full bg-zinc-950">
                          <GalleryPreviewImage
                            src={src}
                            alt="Onizleme"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSponsorshipPhotoUrls((prev) => prev.filter((u) => u !== src))}
                          className="absolute right-0.5 top-0.5 rounded bg-rose-700 px-1 py-0.5 text-[10px] font-medium text-white hover:bg-rose-600"
                        >
                          Kaldir
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
          <div className="md:col-span-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
            <label className="mb-2 block text-sm text-zinc-300">PC&apos;den foto yukle</label>
            <input
              type="file"
              accept="image/*,image/heic,image/heif,.heic,.heif"
              multiple
              onChange={(e) => uploadPhotos(e.target.files)}
              className="block w-full text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-700 file:px-3 file:py-2 file:text-white hover:file:bg-sky-600"
              disabled={uploading}
            />
            {photoGalleryPreview.length > 0 ? (
              <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
                {photoGalleryPreview.map(({ url }, i) => (
                  <div key={`${url}-${i}`} className="relative overflow-hidden rounded border border-zinc-800">
                    <div className="aspect-square w-full bg-zinc-950">
                      <GalleryPreviewImage
                        src={url}
                        alt="Onizleme"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhotoFromGalleryLine(url)}
                      className="absolute right-0.5 top-0.5 rounded bg-rose-700 px-1 py-0.5 text-[10px] font-medium text-white hover:bg-rose-600"
                    >
                      Kaldir
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="md:col-span-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="mb-3 text-sm text-zinc-300">Yatay videolar (maks 4, sadece YouTube)</p>
            <div className="space-y-2">
              {form.horizontalVideos.map((item: VideoInput, i: number) => (
                <div key={`h-${i}`} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                  <input
                    className="md:col-span-3 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                    placeholder={`Yatay video ${i + 1} URL`}
                    value={item.url}
                    onChange={(e) => updateVideoField('horizontalVideos', i, 'url', e.target.value)}
                  />
                  <input
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                    placeholder="Baslik (opsiyonel)"
                    value={item.title}
                    onChange={(e) => updateVideoField('horizontalVideos', i, 'title', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="mb-3 text-sm text-zinc-300">Dikey videolar (maks 4, sadece YouTube)</p>
            <div className="space-y-2">
              {form.verticalVideos.map((item: VideoInput, i: number) => (
                <div key={`v-${i}`} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                  <input
                    className="md:col-span-3 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                    placeholder={`Dikey video ${i + 1} URL`}
                    value={item.url}
                    onChange={(e) => updateVideoField('verticalVideos', i, 'url', e.target.value)}
                  />
                  <input
                    className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                    placeholder="Baslik (opsiyonel)"
                    value={item.title}
                    onChange={(e) => updateVideoField('verticalVideos', i, 'title', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <textarea
            className="md:col-span-2 min-h-20 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Notlar"
            value={form.notes}
            onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
          />
            </>
          )}
          <button
            type="button"
            className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium hover:bg-emerald-500 sm:w-auto sm:py-2"
            onClick={submit}
            disabled={loading || uploading}
          >
            {editId ? 'Projeyi Guncelle' : 'Yeni Proje Olustur'}
          </button>
        </div>

        {message ? <p className="text-sm text-amber-300">{message}</p> : null}
        {savedPublicUrl ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <a
              href={savedPublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              Projeye Git
            </a>
            <button
              type="button"
              onClick={copySavedLink}
              className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              Proje Linki Kopyala
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

