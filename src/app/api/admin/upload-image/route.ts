import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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

/** Vercel / production: Supabase Storage `project-gallery` (bucket SQL: docs/crm_offer_pages.sql). */
async function uploadToSupabase(files: File[]) {
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

  for (const file of files) {
    if (!isAllowedImageFile(file)) {
      return { ok: false as const, error: 'Desteklenen gorsel formati degil (JPEG, PNG, HEIC, WebP, GIF, TIFF, AVIF, vb.).' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false as const, error: `Bir dosya ${MAX_FILE_SIZE / 1024 / 1024}MB sinirini asti.` };
    }

    const ext = resolveExtension(file);
    const objectPath = `${year}/${month}/${randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const contentType = contentTypeForUpload(file, ext);

    const { error } = await supabase.storage.from('project-gallery').upload(objectPath, buf, {
      contentType,
      upsert: true,
    });

    if (error) {
      return {
        ok: false as const,
        error: error.message || 'Supabase storage yuklemesi basarisiz.',
      };
    }

    const { data } = supabase.storage.from('project-gallery').getPublicUrl(objectPath);
    if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
  }

  return { ok: true as const, urls: uploadedUrls };
}

/** Yerel gelistirme: Supabase yoksa public/ altina yazar. */
async function uploadToLocalPublic(files: File[]) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const relativeDir = `/proje-galeri/${year}/${month}`;
  const uploadDir = path.join(process.cwd(), 'public', relativeDir);
  await mkdir(uploadDir, { recursive: true });

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!isAllowedImageFile(file)) {
      return { ok: false as const, error: 'Desteklenen gorsel formati degil (JPEG, PNG, HEIC, WebP, GIF, TIFF, AVIF, vb.).' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false as const, error: `Bir dosya ${MAX_FILE_SIZE / 1024 / 1024}MB sinirini asti.` };
    }

    const ext = resolveExtension(file);
    const filename = `${randomUUID()}.${ext}`;
    const target = path.join(uploadDir, filename);

    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(target, buf);
    uploadedUrls.push(`${relativeDir}/${filename}`);
  }

  return { ok: true as const, urls: uploadedUrls };
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (process.env.VERCEL && (!supabaseUrl || !serviceKey)) {
      return NextResponse.json(
        {
          error:
            'Vercel ortaminda gorsel yukleme icin NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanimli olmali (project-gallery bucket).',
        },
        { status: 500 }
      );
    }

    const result =
      supabaseUrl && serviceKey ? await uploadToSupabase(files) : await uploadToLocalPublic(files);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ urls: result.urls });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Upload hatasi' }, { status: 500 });
  }
}
