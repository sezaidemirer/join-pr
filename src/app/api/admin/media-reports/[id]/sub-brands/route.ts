import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { createMediaReportSubBrand, listMediaReportSubBrandsForAdmin } from '@/lib/media-reports';

function isAuthorized(req: NextRequest) {
  if (hasAdminCookieInRequest(req)) return true;
  const expected = process.env.ADMIN_PANEL_KEY;
  const incoming = req.headers.get('x-admin-key');
  return Boolean(expected && incoming === expected);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const subBrands = await listMediaReportSubBrandsForAdmin(params.id);
    return NextResponse.json({ subBrands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const subBrand = await createMediaReportSubBrand({
      brandId: params.id,
      name: String(body?.name ?? ''),
      logoUrl: String(body?.logoUrl ?? ''),
      pdfUrl: String(body?.pdfUrl ?? ''),
      isPublished: body?.isPublished !== false,
    });
    return NextResponse.json({ subBrand }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
