import { NextRequest, NextResponse } from 'next/server';

import { listPublishedMediaReportTree } from '@/lib/media-reports';
import { mediaCorsHeaders, mediaCorsOptions } from '@/lib/media-reports-cors';

export async function OPTIONS(req: NextRequest) {
  return mediaCorsOptions(req);
}

export async function GET(req: NextRequest) {
  const cors = mediaCorsHeaders(req);
  try {
    const brands = await listPublishedMediaReportTree();
    return NextResponse.json({ brands }, { headers: cors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500, headers: cors });
  }
}
