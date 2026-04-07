'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const TR_PARAGRAPHS = [
  'Join PR tarafından tarafıma kampanya, tanıtım, duyuru, bülten, reklam, etkinlik, promosyon ve pazarlama içerikli ticari elektronik iletilerin; e-posta, SMS, telefon araması ve benzeri iletişim kanalları aracılığıyla gönderilmesini kabul ediyorum.',
  'Bu kapsamda paylaştığım iletişim bilgilerimin, tarafıma ticari elektronik ileti gönderilmesi amacıyla işlenmesine ve bu amaç doğrultusunda hizmet alınan iş ortakları ve tedarikçilerle paylaşılmasına onay veriyorum.',
  'Tarafıma gönderilecek ticari elektronik iletileri dilediğim zaman reddedebileceğimi, verdiğim onayı geri çekebileceğimi ve iletilerde yer alan çıkış/ret yöntemlerini kullanarak ileti almayı durdurabileceğimi biliyorum.',
];

const EN_PARAGRAPHS = [
  'I accept that Join PR may send me commercial electronic messages containing campaigns, promotions, announcements, newsletters, advertisements, events, promotional offers, and marketing content via email, SMS, phone calls, and similar communication channels.',
  'In this context, I consent to the processing of my contact information for the purpose of sending me commercial electronic messages and to its sharing with business partners and suppliers from whom services are received for this purpose.',
  'I acknowledge that I may withdraw my consent and refuse to receive commercial electronic messages at any time, and that I may stop receiving such messages by using the unsubscribe/opt-out methods provided in the messages.',
];

export function AcikRizaOnayiContent() {
  const { locale } = useLanguage();
  const isTr = locale === 'tr';

  return (
    <>
      <header className="space-y-3">
        <div className="flex items-center justify-center">
          <Image
            src="/join_pr_logo_offical2.png"
            alt="Join PR"
            width={180}
            height={56}
            className="h-11 w-auto object-contain sm:h-12"
            priority
          />
        </div>
        <h1 className="text-center text-2xl font-semibold">
          {isTr ? 'Ticari Elektronik İleti Onayı' : 'Explicit Consent / Commercial Electronic Message Approval Text'}
        </h1>
        {!isTr && <p className="text-center text-sm text-zinc-300">Commercial Electronic Message Approval</p>}
      </header>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="space-y-4 text-zinc-200">
          {(isTr ? TR_PARAGRAPHS : EN_PARAGRAPHS).map((paragraph) => (
            <p key={paragraph} className="leading-7">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
