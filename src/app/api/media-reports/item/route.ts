import { NextRequest, NextResponse } from 'next/server';

import { getPublishedMediaReportBySlugs } from '@/lib/media-reports';

export async function GET(req: NextRequest) {
  try {
    const brand = req.nextUrl.searchParams.get('brand') || '';
    const project = req.nextUrl.searchParams.get('project') || '';
    if (!brand || !project) {
      return NextResponse.json({ error: 'brand ve project zorunludur.' }, { status: 400 });
    }
    const item = await getPublishedMediaReportBySlugs(brand, project);
    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
