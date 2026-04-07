import { NextResponse } from 'next/server';

/** Canlıda hangi deploy'un calistigini gormek icin (cache yok). */
export const dynamic = 'force-dynamic';

export async function GET() {
  const body = {
    ok: true,
    target: 'vercel',
    deployedAt: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    gitRef: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    buildLabel: process.env.NEXT_PUBLIC_BUILD_LABEL?.trim() || '',
    nodeEnv: process.env.NODE_ENV,
    staticExport: process.env.STATIC_EXPORT === '1',
  };

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
