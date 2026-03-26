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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/admin" className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-white">
              Panel
            </Link>
            <nav
              className="flex rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5"
              aria-label="Panel bolumleri"
            >
              <Link
                href="/admin/proje"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
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
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
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
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  medyaRaporuActive
                    ? 'bg-violet-600 text-white'
                    : hubOnly
                      ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                Medya Yansima Raporlari
              </Link>
            </nav>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Cikis
          </button>
        </div>
      </header>
      {children}
    </>
  );
}
