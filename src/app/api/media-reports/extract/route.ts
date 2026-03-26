import { NextRequest, NextResponse } from 'next/server';

import { extractMediaReportFromPdfUrl } from '@/lib/media-report-extractor';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const pdfUrl = String(req.nextUrl.searchParams.get('pdfUrl') || '').trim();
    const fallbackTitle = String(req.nextUrl.searchParams.get('title') || '').trim();
    if (!pdfUrl) {
      return NextResponse.json({ error: 'pdfUrl zorunludur.' }, { status: 400 });
    }
    const data = await extractMediaReportFromPdfUrl(pdfUrl, fallbackTitle || 'Medya Raporu');
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'PDF cozumleme hatasi', data: null },
      { status: 500 }
    );
  }
}
