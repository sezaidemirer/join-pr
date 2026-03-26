'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buildPublicProjectUrl } from '@/lib/project-url';

type Project = {
  id: string;
  brand_name: string;
  brand_slug: string;
  offer_date: string;
  date_slug: string;
  project_title: string;
  updated_at: string;
};

export default function ProjeKutuphanePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadProjects() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/projects', { credentials: 'include' });
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Projeler alinamadi');
      setProjects(data.offers || []);
    } catch (error: any) {
      setMessage(error.message ?? 'Hata');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

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
            <h1 className="text-2xl font-semibold">Proje Kutuphane</h1>
          </div>
          <Link
            href="/admin/proje/yeni-proje"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
          >
            Yeni Proje
          </Link>
        </div>

        {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        {loading ? <p className="text-sm text-zinc-400">Yukleniyor...</p> : null}

        <div className="space-y-3">
          {projects.map((item) => (
            <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="font-medium">{item.project_title}</p>
              <p className="text-sm text-zinc-400">
                {item.brand_name} - {item.offer_date}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {buildPublicProjectUrl(item.brand_slug, item.date_slug)}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={`/admin/proje/yeni-proje?id=${item.id}`}
                  className="rounded bg-zinc-700 px-3 py-1 text-xs hover:bg-zinc-600"
                >
                  Duzenle
                </Link>
                <a
                  href={buildPublicProjectUrl(item.brand_slug, item.date_slug)}
                  target="_blank"
                  className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
                  rel="noreferrer"
                >
                  Public Sayfa
                </a>
              </div>
            </div>
          ))}
          {!loading && projects.length === 0 ? (
            <p className="text-sm text-zinc-500">Henuz kayitli proje yok.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

