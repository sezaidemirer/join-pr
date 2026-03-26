'use client';

import { Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { HaberDetayClient } from '@/components/news/HaberDetayClient';
import { haberSlugFromPathname } from '@/lib/news-href';

/** .htaccess ile /haber/foo sunulurken Next usePathname() bazen /haber/detay verir; gercek slug icin location kullan. */
function useResolvedNewsSlug(): string {
  const pathnameNext = usePathname() || '';
  const searchParams = useSearchParams();
  const [pathBrowser, setPathBrowser] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : ''
  );

  useLayoutEffect(() => {
    setPathBrowser(window.location.pathname);
  }, [pathnameNext, searchParams]);

  return useMemo(() => {
    const q = (searchParams.get('slug') || '').trim();
    if (q) return q;
    const fromLoc = haberSlugFromPathname(pathBrowser);
    if (fromLoc) return fromLoc;
    return haberSlugFromPathname(pathnameNext);
  }, [pathnameNext, pathBrowser, searchParams]);
}

function HaberDetayInner() {
  const slug = useResolvedNewsSlug();
  return <HaberDetayClient rawSlug={slug} />;
}

export default function HaberDetayQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-4 text-zinc-400">Yükleniyor…</div>
      }
    >
      <HaberDetayInner />
    </Suspense>
  );
}
