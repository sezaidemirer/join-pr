import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { listBrandLogoUploadsPublic } from '@/lib/brand-logo-bucket-list';

/** Galeri: yalnızca Supabase `brand-logo` → `uploads/` altındaki görseller. */
export type MarkaLogoListItem = {
  path: string;
  label: string;
};

export async function GET(req: NextRequest) {
  if (!hasAdminCookieInRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let files: MarkaLogoListItem[] = [];
  try {
    const remote = await listBrandLogoUploadsPublic();
    files = remote.map((r) => ({
      path: r.url,
      label: r.label,
    }));
  } catch {
    files = [];
  }

  return NextResponse.json({ files });
}
