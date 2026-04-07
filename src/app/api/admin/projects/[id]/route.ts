import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { deleteOffer, updateOffer } from '@/lib/offers';
import { hasAdminCookieInRequest } from '@/lib/admin-auth';

export function generateStaticParams() { return []; }

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

    const offer = await updateOffer(params.id, {
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

    return NextResponse.json({ offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { brand_slug: brandSlug, date_slug: dateSlug } = await deleteOffer(params.id);
    const projePath = `/proje/${brandSlug}/${dateSlug}`;
    revalidatePath(projePath);
    revalidatePath(`${projePath}/`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}

