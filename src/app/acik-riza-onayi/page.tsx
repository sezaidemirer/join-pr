import type { Metadata } from 'next';
import { AcikRizaOnayiContent } from './AcikRizaOnayiContent';

export const metadata: Metadata = {
  title: 'Ticari Elektronik İleti Onayı',
  robots: { index: false, follow: false },
};

export default function AcikRizaOnayiPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <AcikRizaOnayiContent />
      </div>
    </main>
  );
}
