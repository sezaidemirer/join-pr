'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const raw = await res.text();
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      const looksLikeHtml =
        ct.includes('text/html') || /^\s*<(!DOCTYPE|html)/i.test(raw.trimStart());

      if (looksLikeHtml) {
        throw new Error(
          'Statik hosting (out/ yuklemesi) uzerinde API yok; giris calismaz. Admin icin Next.js uygulamasini cPanel "Setup Node.js App" ile (veya baska Node sunucusu) calistirin; ana site statik kalabilir, panel ornek olarak admin alt alan adina kurulabilir.'
        );
      }

      let data: { error?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as { error?: string }) : {};
      } catch {
        throw new Error('Sunucu JSON yerine gecersiz cevap dondurdu.');
      }

      if (!res.ok) throw new Error(data.error || 'Giris basarisiz');
      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || 'Giris basarisiz');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
        >
          Geri Gel
        </button>
        <h1 className="mb-2 text-2xl font-semibold">Admin Giris</h1>
        <p className="mb-6 text-sm text-zinc-400">Proje paneline erismek icin giris yapin.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
            required
          />
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sifre"
            required
          />
          <button
            className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
      </div>
    </main>
  );
}

