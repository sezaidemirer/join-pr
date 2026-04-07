import { NextRequest, NextResponse } from 'next/server';

import { extractMediaReportFromPdfUrl } from '@/lib/media-report-extractor';
import { mediaCorsHeaders, mediaCorsOptions } from '@/lib/media-reports-cors';

export const dynamic = 'force-dynamic';
// Vercel Pro/Teams: 60s, Hobby: max 10s (bu deger plan limitini asan istekler icin de guclu timeout signalin olmasi)
export const maxDuration = 60;

export async function OPTIONS(req: NextRequest) {
  return mediaCorsOptions(req);
}

export async function GET(req: NextRequest) {
  const cors = mediaCorsHeaders(req);
  try {
    const pdfUrl = String(req.nextUrl.searchParams.get('pdfUrl') || '').trim();
    const fallbackTitle = String(req.nextUrl.searchParams.get('title') || '').trim();
    if (!pdfUrl) {
      return NextResponse.json({ error: 'pdfUrl zorunludur.' }, { status: 400, headers: cors });
    }
    const data = await extractMediaReportFromPdfUrl(pdfUrl, fallbackTitle || 'Medya Raporu');
    return NextResponse.json({ data }, { headers: cors });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'PDF cozumleme hatasi', data: null },
      { status: 500, headers: cors }
    );
  }
}
