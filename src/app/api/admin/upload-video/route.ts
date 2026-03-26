import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function sanitizeFilename(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.\-_]/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: NextRequest) {
  if (!hasAdminCookieInRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Video dosyasi bulunamadi.' }, { status: 400 });
    }
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Sadece video dosyasi yukleyebilirsiniz.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Video dosyasi 100MB sinirini asti.' }, { status: 400 });
    }

    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const relativeDir = `/proje-video/${year}/${month}`;
    const uploadDir = path.join(process.cwd(), 'public', relativeDir);
    await mkdir(uploadDir, { recursive: true });

    const originalName = sanitizeFilename(file.name || 'video.mp4');
    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'mp4';
    const filename = `${randomUUID()}.${ext}`;
    const target = path.join(uploadDir, filename);

    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(target, buf);

    return NextResponse.json({ url: `${relativeDir}/${filename}` });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Video upload hatasi' }, { status: 500 });
  }
}

