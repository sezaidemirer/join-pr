import { NextRequest, NextResponse } from 'next/server';

import { getPublishedMediaReportBySlugs } from '@/lib/media-reports';
import { mediaCorsHeaders, mediaCorsOptions } from '@/lib/media-reports-cors';

export async function OPTIONS(req: NextRequest) {
  return mediaCorsOptions(req);
}

export async function GET(req: NextRequest) {
  const cors = mediaCorsHeaders(req);
  try {
    const brand = req.nextUrl.searchParams.get('brand') || '';
    const project = req.nextUrl.searchParams.get('project') || '';
    if (!brand || !project) {
      return NextResponse.json({ error: 'brand ve project zorunludur.' }, { status: 400, headers: cors });
    }
    const item = await getPublishedMediaReportBySlugs(brand, project);
    return NextResponse.json({ item }, { headers: cors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500, headers: cors });
  }
}
