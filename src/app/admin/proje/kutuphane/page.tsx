'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buildPublicProjectUrl } from '@/lib/project-url';
import {
  inferProjectTypeFromBrandSlug,
  PROJECT_TYPE_SHORT_LABEL_TR,
  type ProjectType,
} from '@/lib/project-type-from-slug';

function categoryBadgeStyles(type: ProjectType | null): string {
  if (type === 'production') return 'border-sky-600/50 bg-sky-950/40 text-sky-200';
  if (type === 'sponsorship') return 'border-emerald-600/50 bg-emerald-950/40 text-emerald-200';
  if (type === 'press') return 'border-violet-600/50 bg-violet-950/40 text-violet-200';
  return 'border-zinc-600 bg-zinc-800/80 text-zinc-400';
}

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function deleteProject(item: Project) {
    const ok = window.confirm(
      `"${item.project_title}" projesini kalici olarak silmek istediginize emin misiniz? Bu islem geri alinamaz.`
    );
    if (!ok) return;
    setDeletingId(item.id);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/projects/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/admin-login');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Proje silinemedi');
      setProjects((prev) => prev.filter((p) => p.id !== item.id));
      setMessage('Proje silindi.');
    } catch (error: any) {
      setMessage(error.message ?? 'Silme hatasi');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Geri Gel
            </button>
            <h1 className="text-xl font-semibold sm:text-2xl">Proje Kutuphane</h1>
          </div>
          <Link
            href="/admin/proje/yeni-proje"
            className="inline-flex justify-center rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium hover:bg-emerald-500 sm:shrink-0"
          >
            Yeni Proje
          </Link>
        </div>

        {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        {loading ? <p className="text-sm text-zinc-400">Yukleniyor...</p> : null}

        <div className="space-y-3">
          {projects.map((item) => {
            const projectType = inferProjectTypeFromBrandSlug(item.brand_slug);
            const typeLabel = projectType
              ? PROJECT_TYPE_SHORT_LABEL_TR[projectType]
              : 'Diger / eski format';
            return (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 sm:items-start"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.project_title}</p>
                <p className="text-sm text-zinc-400">
                  {item.brand_name} - {item.offer_date}
                </p>
                <p className="mt-1 break-all text-xs text-zinc-500">
                  {buildPublicProjectUrl(item.brand_slug, item.date_slug)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
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
              <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:items-end sm:pt-0.5">
                <span
                  className={`rounded-md border px-2.5 py-1 text-center text-xs font-semibold sm:min-w-[7.5rem] ${categoryBadgeStyles(projectType)}`}
                >
                  {typeLabel}
                </span>
                <button
                  type="button"
                  onClick={() => void deleteProject(item)}
                  disabled={deletingId === item.id || loading}
                  className="rounded border border-rose-800 bg-rose-950/40 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-950/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === item.id ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
            );
          })}
          {!loading && projects.length === 0 ? (
            <p className="text-sm text-zinc-500">Henuz kayitli proje yok.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

