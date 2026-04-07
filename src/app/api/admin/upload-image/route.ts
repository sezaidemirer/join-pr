import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { BRAND_LOGO_BUCKET } from '@/lib/brand-logo-storage';
import { HABER_PLATFORM_LOGOS_BUCKET } from '@/lib/haber-logo-storage';
import { appendSubBrandLogoArchive } from '@/lib/sub-brand-logo-archive';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_BUCKETS = ['project-gallery', HABER_PLATFORM_LOGOS_BUCKET, BRAND_LOGO_BUCKET] as const;
type AllowedStorageBucket = (typeof ALLOWED_BUCKETS)[number];

/** FormData'daki `storageBucket` yalnızca bilinen bucket adlarıyla eşleşir; aksi halde proje galerisi. */
function resolveStorageBucket(raw: string): AllowedStorageBucket {
  const key = raw.trim();
  for (const bucket of ALLOWED_BUCKETS) {
    if (key === bucket) return bucket;
  }
  return 'project-gallery';
}

/** Uzantı ile gelen (iPhone HEIC vb.) veya tarayıcının image/* olarak bildirdiği dosyalar. */
const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'heic',
  'heif',
  'hif',
  'avif',
  'tif',
  'tiff',
  'bmp',
  'svg',
  'jxl',
  'ico',
  'dng',
  'cr2',
  'nef',
  'arw',
]);

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');
}

function extFromFilename(name: string): string | null {
  const s = sanitizeFilename(name || '');
  const parts = s.split('.');
  if (parts.length < 2) return null;
  const ext = parts.pop();
  return ext ? ext.toLowerCase() : null;
}

function isAllowedImageFile(file: File): boolean {
  const mime = (file.type || '').toLowerCase();
  if (mime.startsWith('image/')) return true;
  const ext = extFromFilename(file.name || '');
  return Boolean(ext && IMAGE_EXTENSIONS.has(ext));
}

function extFromMime(mime: string): string {
  const m = (mime || '').toLowerCase();
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/avif': 'avif',
    'image/tiff': 'tiff',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
    'image/x-icon': 'ico',
  };
  if (map[m]) return map[m];
  if (m.startsWith('image/')) {
    const sub = m.slice('image/'.length).split('+')[0].replace(/[^a-z0-9]/g, '');
    return sub || 'img';
  }
  return 'bin';
}

function contentTypeForUpload(file: File, ext: string): string {
  if (file.type && file.type.toLowerCase().startsWith('image/')) return file.type;
  const e = ext.toLowerCase();
  const byExt: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    heif: 'image/heif',
    hif: 'image/heif',
    avif: 'image/avif',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    jxl: 'image/jxl',
    ico: 'image/x-icon',
  };
  return byExt[e] || 'application/octet-stream';
}

function resolveExtension(file: File): string {
  const fromName = extFromFilename(file.name || '');
  if (fromName && IMAGE_EXTENSIONS.has(fromName)) return fromName === 'jpeg' ? 'jpg' : fromName;
  const fromMime = extFromMime(file.type || '');
  if (fromMime !== 'bin' && fromMime !== 'img') return fromMime === 'jpeg' ? 'jpg' : fromMime;
  return 'jpg';
}

type FileWithBuffer = { file: File; buf: Buffer };

/** Vercel / production: Supabase Storage (`project-gallery`, `haber-platform-logos`, `brand-logo`). */
async function uploadToSupabase(entries: FileWithBuffer[], bucket: AllowedStorageBucket) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    return {
      ok: false as const,
      error: 'Sunucu: NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik; gorsel yuklenemedi.',
    };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const uploadedUrls: string[] = [];
  const objectPaths: string[] = [];

  for (const { file, buf } of entries) {
    if (!isAllowedImageFile(file)) {
      return { ok: false as const, error: 'Desteklenen gorsel formati degil (JPEG, PNG, HEIC, WebP, GIF, TIFF, AVIF, vb.).' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false as const, error: `Bir dosya ${MAX_FILE_SIZE / 1024 / 1024}MB sinirini asti.` };
    }

    const ext = resolveExtension(file);
    const objectPath =
      bucket === HABER_PLATFORM_LOGOS_BUCKET || bucket === BRAND_LOGO_BUCKET
        ? `uploads/${year}/${month}/${randomUUID()}.${ext}`
        : `${year}/${month}/${randomUUID()}.${ext}`;
    const contentType = contentTypeForUpload(file, ext);

    const { error } = await supabase.storage.from(bucket).upload(objectPath, buf, {
      contentType,
      upsert: true,
    });

    if (error) {
      return {
        ok: false as const,
        error: error.message || 'Supabase storage yuklemesi basarisiz.',
      };
    }

    objectPaths.push(objectPath);
    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
  }

  return { ok: true as const, urls: uploadedUrls, objectPaths };
}

/** Yerel gelistirme: Supabase yoksa public/ altina yazar. */
async function uploadToLocalPublic(entries: FileWithBuffer[]) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const relativeDir = `/proje-galeri/${year}/${month}`;
  const uploadDir = path.join(process.cwd(), 'public', relativeDir);
  await mkdir(uploadDir, { recursive: true });

  const uploadedUrls: string[] = [];
  const objectPaths: string[] = [];

  for (const { file, buf } of entries) {
    if (!isAllowedImageFile(file)) {
      return { ok: false as const, error: 'Desteklenen gorsel formati degil (JPEG, PNG, HEIC, WebP, GIF, TIFF, AVIF, vb.).' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false as const, error: `Bir dosya ${MAX_FILE_SIZE / 1024 / 1024}MB sinirini asti.` };
    }

    const ext = resolveExtension(file);
    const filename = `${randomUUID()}.${ext}`;
    const target = path.join(uploadDir, filename);

    await writeFile(target, buf);
    const relFile = `${relativeDir}/${filename}`.replace(/^\//, '');
    objectPaths.push(relFile);
    uploadedUrls.push(`${relativeDir}/${filename}`);
  }

  return { ok: true as const, urls: uploadedUrls, objectPaths };
}

export async function POST(req: NextRequest) {
  if (!hasAdminCookieInRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files').filter(Boolean) as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'Dosya bulunamadi.' }, { status: 400 });
    }

    /** FormData File govdesi tek seferlik okunabiliyor; arşiv adımında tekrar arrayBuffer() 500 hatasina yol acabiliyor. */
    let entries: FileWithBuffer[];
    try {
      entries = await Promise.all(
        files.map(async (file) => ({
          file,
          buf: Buffer.from(await file.arrayBuffer()),
        }))
      );
    } catch (readErr: unknown) {
      const msg = readErr instanceof Error ? readErr.message : String(readErr);
      return NextResponse.json({ error: `Dosya okunamadi: ${msg}` }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const hasSupabaseUrl = Boolean(supabaseUrl);
    const hasServiceKey = Boolean(serviceKey);

    const storageBucket = resolveStorageBucket(String(formData.get('storageBucket') || ''));

    /**
     * Sadece public URL tanımlı, service role yoksa eskiden sessizce public/proje-galeri kullanılıyordu;
     * kullanıcı Supabase'de dosya göremiyordu.
     */
    if (hasSupabaseUrl && !hasServiceKey) {
      return NextResponse.json(
        {
          error:
            'Supabase proje URL\'i var ama SUPABASE_SERVICE_ROLE_KEY eksik. Görseller bucket\'a yüklenemez. Vercel / .env.local içine Supabase Dashboard → Settings → API → service_role anahtarını ekleyin.',
        },
        { status: 500 }
      );
    }

    if (
      (storageBucket === HABER_PLATFORM_LOGOS_BUCKET || storageBucket === BRAND_LOGO_BUCKET) &&
      (!hasSupabaseUrl || !hasServiceKey)
    ) {
      return NextResponse.json(
        {
          error:
            'Logo bucket icin Supabase gerekli: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY (haber-platform-logos veya brand-logo).',
        },
        { status: 500 }
      );
    }

    if (process.env.VERCEL && (!hasSupabaseUrl || !hasServiceKey)) {
      return NextResponse.json(
        {
          error:
            'Vercel ortaminda gorsel yukleme icin NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanimli olmali.',
        },
        { status: 500 }
      );
    }

    const useSupabase = hasSupabaseUrl && hasServiceKey;
    const result = useSupabase
      ? await uploadToSupabase(entries, storageBucket)
      : await uploadToLocalPublic(entries);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const uploadMeta = useSupabase
      ? { destination: 'supabase' as const, bucket: storageBucket }
      : { destination: 'local' as const, bucket: null as null };

    const archiveSubBrand = formData.get('archiveSubBrandLogo') === '1';
    const archived: Array<{ path: string; label: string; uploadedAt?: string }> = [];
    if (archiveSubBrand) {
      for (let i = 0; i < entries.length; i += 1) {
        const { file, buf } = entries[i];
        const ext = resolveExtension(file);
        const sourceUrl = result.urls[i];
        const entry = await appendSubBrandLogoArchive(buf, ext, file.name, sourceUrl);
        if (entry) {
          archived.push({ path: entry.path, label: entry.label, uploadedAt: entry.uploadedAt });
        }
      }
    }

    return NextResponse.json({ urls: result.urls, archived, uploadMeta });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Upload hatasi' }, { status: 500 });
  }
}
