import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_CORS_ORIGINS = [
  'https://joinpr.com.tr',
  'https://www.joinpr.com.tr',
  'https://proje.joinpr.com.tr',
  'http://localhost:3000',
];

export function mediaCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin');
  const extra = (process.env.MEDIA_REPORTS_API_CORS_ORIGINS || '')
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

export function mediaCorsOptions(req: NextRequest) {
  const cors = mediaCorsHeaders(req);
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...cors,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
