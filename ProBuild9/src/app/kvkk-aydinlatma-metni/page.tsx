import type { Metadata } from 'next';

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

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-base font-semibold text-zinc-100">Veri Sorumlusu</h2>
          <div className="mt-3 space-y-1 text-sm text-zinc-200">
            <p>JOİN US İLETİŞİM REKLAM ORGANİZASYON VE TURİZM LİMİTED ŞİRKETİ</p>
            <p>Adres: Harbiye Mahallesi Bostan Sokak No:15/5 Şişli İstanbul</p>
            <p>E-posta: info@joinpr.com.tr</p>
          </div>

          <div className="mt-6 space-y-4 text-zinc-200">
            <p className="leading-7">
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz, veri sorumlusu
              sıfatıyla JOİN US İLETİŞİM REKLAM ORGANİZASYON VE TURİZM LİMİTED ŞİRKETİ tarafından işlenmektedir.
              Şirketimiz tarafından gerçekleştirilen etkinlik, organizasyon veya kampanya faaliyetleri kapsamında
              seyahat planlamasının yapılabilmesi amacıyla tarafınızdan paylaşılan ad, soyad, T.C. kimlik numarası
              veya pasaport numarası, telefon numarası, e-posta adresi ve uçuş bilgileri gibi kişisel verileriniz;
              uçak bileti rezervasyonlarının yapılması, seyahat organizasyonlarının planlanması, konaklama ve
              transfer işlemlerinin yürütülmesi ve ilgili hizmet sağlayıcılar ile rezervasyon işlemlerinin
              gerçekleştirilmesi amacıyla işlenmektedir.
            </p>
            <p className="leading-7">
              Bu veriler, seyahat organizasyonunun gerçekleştirilebilmesi amacıyla havayolu şirketleri, seyahat
              acenteleri, konaklama sağlayıcıları ve organizasyon iş ortakları ile paylaşılabilmektedir. Kişisel
              verileriniz, KVKK’nın 5. maddesinde belirtilen sözleşmenin ifası ve veri sorumlusunun meşru menfaati
              hukuki sebeplerine dayanılarak işlenmektedir. Veri sahibi olarak KVKK’nın 11. maddesi kapsamında
              sahip olduğunuz haklara ilişkin taleplerinizi yukarıda belirtilen iletişim bilgileri üzerinden
              şirketimize iletebilirsiniz.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

