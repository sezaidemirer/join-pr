import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Yonetim Paneli</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Proje veya Haber islemleri icin ustteki sekmeleri kullanin; asagidaki kartlarla da hizli gecebilirsiniz.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/proje"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-sky-500 hover:bg-zinc-900"
          >
            <p className="text-lg font-semibold">Proje</p>
            <p className="mt-2 text-sm text-zinc-400">Kutuphane ve yeni proje / teklif sayfalari</p>
          </Link>
          <Link
            href="/admin/haber"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-emerald-500 hover:bg-zinc-900"
          >
            <p className="text-lg font-semibold">Haber</p>
            <p className="mt-2 text-sm text-zinc-400">Haber listesi ve icerik formu</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
