import { NextRequest, NextResponse } from 'next/server';

import { getPublishedNewsBySlug, listPublishedNews } from '@/lib/news';

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');
    if (slug) {
      const item = await getPublishedNewsBySlug(slug);
      return NextResponse.json({ item });
    }
    const items = await listPublishedNews();
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unexpected error' }, { status: 500 });
  }
}
