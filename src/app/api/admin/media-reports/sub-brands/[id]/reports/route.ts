import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import {
  createMediaReportEntry,
  deleteMediaReportEntry,
  listEntriesForSubBrand,
} from '@/lib/media-reports';

export function generateStaticParams() { return []; }

function isAuthorized(req: NextRequest) {
  if (hasAdminCookieInRequest(req)) return true;
  const expected = process.env.ADMIN_PANEL_KEY;
  const incoming = req.headers.get('x-admin-key');
  return Boolean(expected && incoming === expected);
}

/** GET /api/admin/media-reports/sub-brands/[id]/reports → alt markaya ait tüm rapor listesi */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const entries = await listEntriesForSubBrand(params.id);
    return NextResponse.json({ entries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

/** POST /api/admin/media-reports/sub-brands/[id]/reports → yeni rapor ekle */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const entry = await createMediaReportEntry({
      subBrandId: params.id,
      title: String(body?.title ?? ''),
      pdfUrl: String(body?.pdfUrl ?? ''),
      reportDate: body?.reportDate ? String(body.reportDate) : null,
    });
    return NextResponse.json({ entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

/** DELETE /api/admin/media-reports/sub-brands/[id]/reports?entryId=uuid → rapor sil */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const entryId = req.nextUrl.searchParams.get('entryId') || '';
    if (!entryId) return NextResponse.json({ error: 'entryId zorunludur.' }, { status: 400 });
    await deleteMediaReportEntry(entryId);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
