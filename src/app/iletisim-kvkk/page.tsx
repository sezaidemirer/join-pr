import type { Metadata } from 'next';
import { IletisimKvkkContent } from './IletisimKvkkContent';

export const metadata: Metadata = {
  title: 'İletişim Formu KVKK Aydınlatma Metni',
  robots: { index: false, follow: false },
};

export default function IletisimKvkkPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <IletisimKvkkContent />
      </div>
    </main>
  );
}
