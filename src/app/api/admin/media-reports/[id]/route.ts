import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { deleteMediaReportBrand, updateMediaReportBrand } from '@/lib/media-reports';

function isAuthorized(req: NextRequest) {
  if (hasAdminCookieInRequest(req)) return true;
  const expected = process.env.ADMIN_PANEL_KEY;
  const incoming = req.headers.get('x-admin-key');
  return Boolean(expected && incoming === expected);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const brand = await updateMediaReportBrand(params.id, {
      name: String(body?.name ?? ''),
      logoUrl: String(body?.logoUrl ?? ''),
      isPublished: body?.isPublished !== false,
    });
    return NextResponse.json({ brand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await deleteMediaReportBrand(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
