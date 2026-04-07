import { NextRequest, NextResponse } from 'next/server';

import { updateOffer } from '@/lib/offers';
import { hasAdminCookieInRequest } from '@/lib/admin-auth';

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
    const {
      brandName,
      offerDate,
      projectTitle,
      summary,
      sampleContents,
      photoGallery,
      videoGallery,
      notes,
    } = body ?? {};

    if (!brandName || !offerDate || !projectTitle) {
      return NextResponse.json(
        { error: 'brandName, offerDate, projectTitle zorunludur.' },
        { status: 400 }
      );
    }

    const offer = await updateOffer(params.id, {
      brandName,
      offerDate,
      projectTitle,
      summary,
      sampleContents: Array.isArray(sampleContents) ? sampleContents : [],
      photoGallery: Array.isArray(photoGallery) ? photoGallery : [],
      videoGallery: Array.isArray(videoGallery) ? videoGallery : [],
      notes,
      noindex: false,
    });

    return NextResponse.json({ offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

