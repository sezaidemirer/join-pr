import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import {
  parseHaberPlatformLogoObjectPathFromUrl,
  resolveHaberPlatformLogoObjectKey,
} from '@/lib/haber-logo-object-path';
import { HABER_PLATFORM_LOGOS_BUCKET } from '@/lib/haber-logo-storage';
import { readSubBrandLogoArchiveManifest, removeSubBrandLogoArchiveEntry } from '@/lib/sub-brand-logo-archive';

type Body =
  | { kind: 'object'; url: string }
  | { kind: 'archive'; path: string };

async function deleteFromHaberBucket(objectKey: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    return { ok: false, message: 'Supabase URL veya service role anahtari eksik.' };
  }
  if (!objectKey || objectKey.includes('..')) {
    return { ok: false, message: 'Gecersiz nesne yolu.' };
  }
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.storage.from(HABER_PLATFORM_LOGOS_BUCKET).remove([objectKey]);
  if (error) {
    return { ok: false, message: error.message || 'Storage silinemedi.' };
  }
  return { ok: true };
}

export async function POST(req: NextRequest) {
  if (!hasAdminCookieInRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Gecersiz JSON.' }, { status: 400 });
  }

  if (body.kind === 'archive') {
    const archivePath = String(body.path || '').trim();
    if (!archivePath) {
      return NextResponse.json({ error: 'path gerekli.' }, { status: 400 });
    }
    const list = await readSubBrandLogoArchiveManifest();
    const norm = archivePath.replace(/\\/g, '/');
    const normalized = norm.startsWith('/') ? norm : `/${norm}`;
    const entry = list.find((e) => e.path === normalized || e.path === norm);
    if (!entry) {
      return NextResponse.json({ error: 'Arsiv kaydi bulunamadi.' }, { status: 404 });
    }

    const source = (entry.sourceUrl || '').trim();
    if (source) {
      const key =
        parseHaberPlatformLogoObjectPathFromUrl(source) || resolveHaberPlatformLogoObjectKey(source);
      if (key) {
        const del = await deleteFromHaberBucket(key);
        if (!del.ok) {
          return NextResponse.json({ error: del.message }, { status: 500 });
        }
      }
    }

    const rm = await removeSubBrandLogoArchiveEntry(entry.path);
    if (!rm.ok) {
      return NextResponse.json({ error: rm.error || 'Arsiv guncellenemedi.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.kind === 'object') {
    const url = String(body.url || '').trim();
    if (!url) {
      return NextResponse.json({ error: 'url gerekli.' }, { status: 400 });
    }
    const key = parseHaberPlatformLogoObjectPathFromUrl(url) || resolveHaberPlatformLogoObjectKey(url);
    if (!key) {
      return NextResponse.json(
        {
          error:
            'Bu adres haber-platform-logos bucket nesnesi olarak cozumlenemedi. Yalnizca bu bucket icin silme desteklenir.',
        },
        { status: 400 }
      );
    }
    const del = await deleteFromHaberBucket(key);
    if (!del.ok) {
      return NextResponse.json({ error: del.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'kind: object | archive gerekli.' }, { status: 400 });
}
