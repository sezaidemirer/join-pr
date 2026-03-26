import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Açık Rıza Metni',
  robots: { index: false, follow: false },
};

export default function AcikRizaMetniPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Join PR</p>
          <h1 className="text-2xl font-semibold">Açık Rıza Metni</h1>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="leading-7 text-zinc-200">
            Seyahat organizasyonu kapsamında tarafımdan paylaşılan kimlik veya pasaport bilgilerimin, iletişim
            bilgilerimin ve uçuş bilgilerimin uçak bileti rezervasyonunun yapılması, seyahat organizasyonunun
            planlanması ve ilgili hizmet sağlayıcılar ile rezervasyon işlemlerinin gerçekleştirilebilmesi
            amacıyla JOİN US İLETİŞİM REKLAM ORGANİZASYON VE TURİZM LİMİTED ŞİRKETİ tarafından işlenmesine ve
            gerekli durumlarda ilgili hizmet sağlayıcılar ile paylaşılmasına açık rıza verdiğimi kabul
            ederim.
          </p>
        </section>
      </div>
    </main>
  );
}

