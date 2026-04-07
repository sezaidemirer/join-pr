import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { listDistinctMediaReportLogosForAdmin } from '@/lib/media-reports';
import { listDistinctNewsHaberPlatformLogosForAdmin } from '@/lib/news';
import { readSubBrandLogoArchiveManifest } from '@/lib/sub-brand-logo-archive';

export async function GET(req: NextRequest) {
  if (!hasAdminCookieInRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const scope = req.nextUrl.searchParams.get('scope');
    if (scope === 'haber-platform') {
      const usedLogos = await listDistinctNewsHaberPlatformLogosForAdmin().catch(
        () => [] as Array<{ url: string; label: string }>
      );
      return NextResponse.json({ manifest: [], usedLogos });
    }
    const [manifest, usedLogos] = await Promise.all([
      readSubBrandLogoArchiveManifest(),
      listDistinctMediaReportLogosForAdmin().catch(() => [] as Array<{ url: string; label: string }>),
    ]);
    return NextResponse.json({ manifest, usedLogos });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
