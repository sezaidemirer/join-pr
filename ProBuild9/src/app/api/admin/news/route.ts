import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { hasAdminCookieInRequest } from '@/lib/admin-auth';
import { createNews, listAllNews } from '@/lib/news';

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
    const items = await listAllNews();
    return NextResponse.json({ items });
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
    const { title, slug, category, description, image, platformLinks, isPublished, noindex, publishedAt } = body ?? {};
    if (!title || !description) {
      return NextResponse.json({ error: 'title ve description zorunludur.' }, { status: 400 });
    }
    const item = await createNews({
      title,
      slug,
      category,
      description,
      image,
      platformLinks,
      isPublished,
      noindex,
      publishedAt,
    });
    revalidatePath('/kategori/haberler');
    revalidatePath(`/haber/${item.slug}`);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
