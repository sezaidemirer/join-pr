'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function KvkkAydinlatmaMetniContent() {
  const { locale } = useLanguage();
  const isTr = locale === 'tr';

  if (isTr) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-base font-semibold text-zinc-100">Veri Sorumlusu</h2>
        <div className="mt-3 space-y-1 text-sm text-zinc-200">
          <p>JOİN US İLETİŞİM REKLAM ORGANİZASYON VE TURİZM LİMİTED ŞİRKETİ</p>
          <p>Adres: Harbiye Mahallesi Bostan Sokak No:15/5 Şişli İstanbul</p>
          <p>E-posta: info@joinpr.com.tr</p>
        </div>

        <div className="mt-6 space-y-4 text-zinc-200">
          <p className="leading-7">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla
            JOİN US İLETİŞİM REKLAM ORGANİZASYON VE TURİZM LİMİTED ŞİRKETİ tarafından işlenmektedir. Şirketimiz
            tarafından gerçekleştirilen etkinlik, organizasyon veya kampanya faaliyetleri kapsamında seyahat
            planlamasının yapılabilmesi amacıyla tarafınızdan paylaşılan ad, soyad, T.C. kimlik numarası veya
            pasaport numarası, telefon numarası, e-posta adresi ve uçuş bilgileri gibi kişisel verileriniz; uçak
            bileti rezervasyonlarının yapılması, seyahat organizasyonlarının planlanması, konaklama ve transfer
            işlemlerinin yürütülmesi ve ilgili hizmet sağlayıcılar ile rezervasyon işlemlerinin gerçekleştirilmesi
            amacıyla işlenmektedir.
          </p>
          <p className="leading-7">
            Bu veriler, seyahat organizasyonunun gerçekleştirilebilmesi amacıyla havayolu şirketleri, seyahat
            acenteleri, konaklama sağlayıcıları ve organizasyon iş ortakları ile paylaşılabilmektedir. Kişisel
            verileriniz, KVKK&apos;nın 5. maddesinde belirtilen sözleşmenin ifası ve veri sorumlusunun meşru menfaati
            hukuki sebeplerine dayanılarak işlenmektedir. Veri sahibi olarak KVKK&apos;nın 11. maddesi kapsamında sahip
            olduğunuz haklara ilişkin taleplerinizi yukarıda belirtilen iletişim bilgileri üzerinden şirketimize
            iletebilirsiniz.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-base font-semibold text-zinc-100">Data Controller</h2>
      <div className="mt-3 space-y-1 text-sm text-zinc-200">
        <p>JOIN US COMMUNICATION ADVERTISING ORGANIZATION AND TOURISM LIMITED COMPANY</p>
        <p>Address: Harbiye Mahallesi, Bostan Sokak, No:15/5, Sisli, Istanbul</p>
        <p>E-mail: info@joinpr.com.tr</p>
      </div>

      <div className="mt-6 space-y-4 text-zinc-200">
        <p className="leading-7">
          Within the scope of the Personal Data Protection Law No. 6698, your personal data is processed by JOIN US
          COMMUNICATION ADVERTISING ORGANIZATION AND TOURISM LIMITED COMPANY in its capacity as the data controller.
          Within the scope of the events, organizations, or campaign activities carried out by our company, the
          personal data you share for travel planning purposes, such as your name, surname, Turkish ID number or
          passport number, phone number, e-mail address, and flight details, is processed for the purposes of making
          flight ticket reservations, planning travel organizations, carrying out accommodation and transfer
          procedures, and completing reservation processes with the relevant service providers.
        </p>
        <p className="leading-7">
          Such data may be shared with airline companies, travel agencies, accommodation providers, and organization
          business partners for the purpose of carrying out the travel organization. Your personal data is processed
          based on the legal grounds of the performance of a contract and the legitimate interest of the data
          controller, as set forth in Article 5 of the Personal Data Protection Law. As a data subject, you may submit
          your requests regarding your rights under Article 11 of the Law to our company through the contact
          information provided above.
        </p>
      </div>
    </section>
  );
}
