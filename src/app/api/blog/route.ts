import { NextRequest, NextResponse } from 'next/server';

import { getPublishedBlogBySlug, listPublishedBlogPosts } from '@/lib/blog';

const DEFAULT_CORS_ORIGINS = [
  'https://joinpr.com.tr',
  'https://www.joinpr.com.tr',
  'https://proje.joinpr.com.tr',
  'http://localhost:3000',
];

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin');
  const extra = (process.env.NEWS_API_CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowed = new Set([...DEFAULT_CORS_ORIGINS, ...extra]);
  if (!origin || !allowed.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

export async function OPTIONS(req: NextRequest) {
  const cors = corsHeaders(req);
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...cors,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    const slug = req.nextUrl.searchParams.get('slug');
    if (slug) {
      const item = await getPublishedBlogBySlug(slug);
      return NextResponse.json({ item }, { headers: cors });
    }
    const items = await listPublishedBlogPosts();
    return NextResponse.json({ items }, { headers: cors });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? 'Unexpected error' },
      { status: 500, headers: cors }
    );
  }
}
