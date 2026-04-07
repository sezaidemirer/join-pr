import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { createOffer, listOffers } from '@/lib/offers';
import { hasAdminCookieInRequest } from '@/lib/admin-auth';

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
    const offers = await listOffers();
    return NextResponse.json({ offers });
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
    const {
      quoteId,
      brandName,
      offerDate,
      projectTitle,
      projectType,
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

    const offer = await createOffer({
      quoteId,
      brandName,
      offerDate,
      projectTitle,
      projectType,
      summary,
      sampleContents: Array.isArray(sampleContents) ? sampleContents : [],
      photoGallery: Array.isArray(photoGallery) ? photoGallery : [],
      videoGallery: Array.isArray(videoGallery) ? videoGallery : [],
      notes,
      noindex: false,
    });

    const projePath = `/proje/${offer.brand_slug}/${offer.date_slug}`;
    revalidatePath(projePath);
    revalidatePath(`${projePath}/`);

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/projects failed:', error);
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

