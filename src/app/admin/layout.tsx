'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();

  const projeActive =
    pathname.startsWith('/admin/proje') ||
    pathname.startsWith('/admin/proje-olustur') ||
    pathname.startsWith('/admin/teklifler');
  const haberActive = pathname.startsWith('/admin/haber');
  const blogActive = pathname.startsWith('/admin/blog');
  const medyaRaporuActive = pathname.startsWith('/admin/medya-yansima-raporlari');
  const hubOnly = pathname === '/admin';

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:gap-4">
            <Link
              href="/admin"
              className="shrink-0 text-sm font-semibold tracking-tight text-zinc-100 hover:text-white"
            >
              Panel
            </Link>
            <nav
              className="-mx-1 flex max-w-full flex-nowrap gap-0.5 overflow-x-auto overscroll-x-contain rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0.5 [&::-webkit-scrollbar]:hidden"
              aria-label="Panel bolumleri"
            >
              <Link
                href="/admin/proje"
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                  projeActive
                    ? 'bg-sky-600 text-white'
                    : hubOnly
                      ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                Proje
              </Link>
              <Link
                href="/admin/haber"
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                  haberActive
                    ? 'bg-emerald-600 text-white'
                    : hubOnly
                      ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                Haber
              </Link>
              <Link
                href="/admin/medya-yansima-raporlari"
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                  medyaRaporuActive
                    ? 'bg-violet-600 text-white'
                    : hubOnly
                      ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                <span className="sm:hidden">Medya raporu</span>
                <span className="hidden sm:inline">Medya Yansima Raporlari</span>
              </Link>
              <Link
                href="/admin/blog"
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                  blogActive
                    ? 'bg-amber-600 text-white'
                    : hubOnly
                      ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                Blog
              </Link>
              <a
                href="https://utm.joinpr.com.tr"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800/80 hover:text-zinc-200 sm:px-3 sm:text-sm"
              >
                Join UTM
              </a>
            </nav>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="shrink-0 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800 sm:self-center"
          >
            Cikis
          </button>
        </div>
      </header>
      {children}
    </>
  );
}
