import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { createMediaReportBrand, listMediaReportBrandsForAdmin } from '@/lib/media-reports';

function isAuthorized(req: NextRequest) {
  if (hasAdminCookieInRequest(req)) return true;
  const expected = process.env.ADMIN_PANEL_KEY;
  const incoming = req.headers.get('x-admin-key');
  return Boolean(expected && incoming === expected);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const brands = await listMediaReportBrandsForAdmin();
    return NextResponse.json({ brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const brand = await createMediaReportBrand({
      name: String(body?.name ?? ''),
      logoUrl: String(body?.logoUrl ?? ''),
      isPublished: body?.isPublished !== false,
    });
    return NextResponse.json({ brand }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
