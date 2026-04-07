'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminProjeHomePage() {
  const [showTypes, setShowTypes] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/admin"
          className="inline-block rounded border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
        >
          Panele Don
        </Link>
        <h1 className="text-2xl font-semibold">Proje Yonetimi</h1>
        <p className="text-sm text-zinc-400">
          Asagidaki kutulardan proje kutuphanesi veya yeni proje olusturma ekranina gecebilirsiniz.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/admin/proje/kutuphane"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-sky-500 hover:bg-zinc-900"
          >
            <p className="text-lg font-semibold">Projeler</p>
            <p className="mt-2 text-sm text-zinc-400">Kayitli proje sayfalarini listele ve duzenle</p>
          </Link>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-emerald-500 hover:bg-zinc-900">
            <p className="text-lg font-semibold">Yeni Proje</p>
            <p className="mt-2 text-sm text-zinc-400">Proje tipini secerek yeni sayfa olustur</p>
            {!showTypes ? (
              <button
                type="button"
                onClick={() => setShowTypes(true)}
                className="mt-4 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
              >
                Yeni Proje Tipi Sec
              </button>
            ) : (
              <div className="mt-4 grid gap-2">
                <Link
                  href="/admin/proje/yeni-proje?type=production"
                  className="rounded border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
                >
                  Produksiyon Projesi
                </Link>
                <Link
                  href="/admin/proje/yeni-proje?type=sponsorship"
                  className="rounded border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
                >
                  Sponsorluk Projesi
                </Link>
                <Link
                  href="/admin/proje/yeni-proje?type=press"
                  className="rounded border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
                >
                  Basin Iletisim Projesi
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

