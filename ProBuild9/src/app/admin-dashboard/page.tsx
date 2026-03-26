'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin-login');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Geri Gel
            </button>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800"
            onClick={logout}
          >
            Cikis Yap
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/proje"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-sky-500 hover:bg-zinc-900"
          >
            <p className="text-lg font-semibold">Proje</p>
            <p className="mt-2 text-sm text-zinc-400">Proje kutuphane ve yeni proje olusturma</p>
          </Link>
          <Link
            href="/admin/haber"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-emerald-500 hover:bg-zinc-900"
          >
            <p className="text-lg font-semibold">Haber</p>
            <p className="mt-2 text-sm text-zinc-400">Kategori/haberler ve haber detay sayfasi icin icerik yonetimi</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

