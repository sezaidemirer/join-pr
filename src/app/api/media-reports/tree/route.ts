import { NextResponse } from 'next/server';

import { listPublishedMediaReportTree } from '@/lib/media-reports';

export async function GET() {
  try {
    const brands = await listPublishedMediaReportTree();
    return NextResponse.json({ brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
