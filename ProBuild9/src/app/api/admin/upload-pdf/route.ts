import { randomUUID } from 'crypto';
import { mkdir, readdir, writeFile } from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';

const MAX_FILE_SIZE_LOCAL = 20 * 1024 * 1024; // 20MB (multipart / yerel disk)
const MAX_FILE_SIZE_JSON = 250 * 1024 * 1024; // 250MB (Supabase signed upload — panel ile aynı)

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');
}

/** Panel (Vercel): JSON + Supabase createSignedUploadUrl; istemci uploadToSignedUrl ile dosyayı yükler. */
async function handleJsonSignedUpload(req: NextRequest) {
  const body = await req.json();
  const filename = String(body?.filename ?? '').trim();
  const size = Number(body?.size);
  const contentType = String(body?.contentType ?? '');

  if (!filename) {
    return NextResponse.json({ error: 'filename zorunlu.' }, { status: 400 });
  }
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: 'Gecersiz dosya boyutu.' }, { status: 400 });
  }
  if (size > MAX_FILE_SIZE_JSON) {
    return NextResponse.json({ error: `PDF en fazla ${MAX_FILE_SIZE_JSON / 1024 / 1024}MB olabilir.` }, { status: 400 });
  }
  if (contentType && contentType !== 'application/pdf') {
    return NextResponse.json({ error: 'Sadece PDF dosyasi yukleyebilirsiniz.' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Sunucu: Supabase URL veya service role key eksik.' },
      { status: 500 }
    );
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const originalName = sanitizeFilename(filename || 'document.pdf');
  const baseName = originalName.endsWith('.pdf') ? originalName : `${originalName}.pdf`;
  const objectPath = `${year}/${month}/${randomUUID()}-${baseName}`;

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.storage.from('project-pdf').createSignedUploadUrl(objectPath, {
    upsert: true,
  });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Signed upload URL olusturulamadi.' },
      { status: 500 }
    );
  }

  const publicUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/project-pdf/${objectPath}`;

  return NextResponse.json({
    path: data.path,
    token: data.token,
    publicUrl,
    url: publicUrl,
  });
}

/** Yerel geliştirme: multipart + public/ klasörü + (isteğe bağlı) sayfa görselleri. */
async function handleMultipartLocal(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'PDF dosyasi bulunamadi.' }, { status: 400 });
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Sadece PDF dosyasi yukleyebilirsiniz.' }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE_LOCAL) {
    return NextResponse.json({ error: 'PDF dosyasi 20MB sinirini asti.' }, { status: 400 });
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const relativeDir = `/proje-pdf/${year}/${month}`;
  const uploadDir = path.join(process.cwd(), 'public', relativeDir);
  await mkdir(uploadDir, { recursive: true });

  const originalName = sanitizeFilename(file.name || 'document.pdf');
  const filename = `${randomUUID()}-${originalName.endsWith('.pdf') ? originalName : `${originalName}.pdf`}`;
  const target = path.join(uploadDir, filename);

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(target, buf);

  const slideDirToken = randomUUID();
  const relativeSlidesDir = `/proje-pdf-pages/${year}/${month}/${slideDirToken}`;
  const slidesDir = path.join(process.cwd(), 'public', relativeSlidesDir);
  await mkdir(slidesDir, { recursive: true });

  const pythonScript = `
import fitz, os, sys
pdf_path = sys.argv[1]
out_dir = sys.argv[2]
doc = fitz.open(pdf_path)
for i, page in enumerate(doc, start=1):
    pix = page.get_pixmap(matrix=fitz.Matrix(2,2), alpha=False)
    pix.save(os.path.join(out_dir, f"page-{i:02d}.jpg"))
print(len(doc))
`;

  const result = spawnSync('python3', ['-c', pythonScript, target, slidesDir], {
    encoding: 'utf-8',
    timeout: 180000,
  });

  if (result.status !== 0) {
    return NextResponse.json(
      { error: 'PDF sayfalari gorsellere donusturulemedi. Sunucuda python3/pymupdf gerekiyor.' },
      { status: 500 }
    );
  }

  const files = (await readdir(slidesDir))
    .filter((name) => /^page-\d+\.jpg$/i.test(name))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  const slideUrls = files.map((name) => `${relativeSlidesDir}/${name}`);

  return NextResponse.json({ url: `${relativeDir}/${filename}`, slideUrls });
}

export async function POST(req: NextRequest) {
  if (!hasAdminCookieInRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      return await handleJsonSignedUpload(req);
    }
    if (contentType.includes('multipart/form-data')) {
      return await handleMultipartLocal(req);
    }
    return NextResponse.json(
      {
        error:
          'Content-Type application/json (Supabase yukleme) veya multipart/form-data (yerel) bekleniyor.',
      },
      { status: 415 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'PDF upload hatasi' }, { status: 500 });
  }
}
