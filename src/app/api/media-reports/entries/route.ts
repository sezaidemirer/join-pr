import { NextRequest, NextResponse } from 'next/server';

import { getPublishedEntryById, getPublishedEntryBySlug, listPublishedEntriesBySlugs } from '@/lib/media-reports';
import { mediaCorsHeaders, mediaCorsOptions } from '@/lib/media-reports-cors';

export async function OPTIONS(req: NextRequest) {
  return mediaCorsOptions(req);
}

/**
 * GET /api/media-reports/entries/?brand=x&project=y              → tüm yayınlı entry listesi
 * GET /api/media-reports/entries/?brand=x&project=y&entry=slug   → slug ile tek entry
 * GET /api/media-reports/entries/?entryId=uuid                   → UUID ile tek entry (geriye dönük)
 */
export async function GET(req: NextRequest) {
  const cors = mediaCorsHeaders(req);
  try {
    const brand = req.nextUrl.searchParams.get('brand') || '';
    const project = req.nextUrl.searchParams.get('project') || '';
    const entrySlug = req.nextUrl.searchParams.get('entry') || '';
    const entryId = req.nextUrl.searchParams.get('entryId') || '';

    // UUID ile tek entry (geriye dönük uyumluluk)
    if (entryId) {
      const entry = await getPublishedEntryById(entryId);
      return NextResponse.json({ entry }, { headers: cors });
    }

    if (!brand || !project) {
      return NextResponse.json({ error: 'brand ve project zorunludur.' }, { status: 400, headers: cors });
    }

    // Slug ile tek entry
    if (entrySlug) {
      const entry = await getPublishedEntryBySlug(brand, project, entrySlug);
      return NextResponse.json({ entry }, { headers: cors });
    }

    // Tüm liste
    const entries = await listPublishedEntriesBySlugs(brand, project);
    return NextResponse.json({ entries }, { headers: cors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500, headers: cors });
  }
}
