'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AcikRizaMetniContent() {
  const { locale } = useLanguage();
  const isTr = locale === 'tr';

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      {isTr ? (
        <p className="leading-7 text-zinc-200">
          Seyahat organizasyonu kapsamında tarafımdan paylaşılan kimlik veya pasaport bilgilerimin, iletişim
          bilgilerimin ve uçuş bilgilerimin uçak bileti rezervasyonunun yapılması, seyahat organizasyonunun
          planlanması ve ilgili hizmet sağlayıcılar ile rezervasyon işlemlerinin gerçekleştirilebilmesi amacıyla JOİN
          US İLETİŞİM REKLAM ORGANİZASYON VE TURİZM LİMİTED ŞİRKETİ tarafından işlenmesine ve gerekli durumlarda
          ilgili hizmet sağlayıcılar ile paylaşılmasına açık rıza verdiğimi kabul ederim.
        </p>
      ) : (
        <p className="leading-7 text-zinc-200">
          I hereby acknowledge and expressly consent to the processing by JOIN US COMMUNICATION ADVERTISING
          ORGANIZATION AND TOURISM LIMITED COMPANY of my identity/passport information, contact information, and
          flight details that I have shared within the scope of the travel organization, for the purposes of making
          flight ticket reservations, planning the travel organization, and carrying out reservation procedures with
          the relevant service providers, and to the sharing of such data with the relevant service providers where
          necessary.
        </p>
      )}
    </section>
  );
}
