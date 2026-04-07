import type { Metadata } from 'next';
import KvkkAydinlatmaMetniContent from './KvkkAydinlatmaMetniContent';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  robots: { index: false, follow: false },
};

export default function KvkkAydinlatmaMetniPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Join PR</p>
          <h1 className="text-2xl font-semibold">KVKK Aydınlatma Metni</h1>
        </header>

        <KvkkAydinlatmaMetniContent />
      </div>
    </main>
  );
}

