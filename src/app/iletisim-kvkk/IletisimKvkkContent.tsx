'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const TR_PARAGRAPHS = [
  'Join PR olarak, iletişim formu aracılığıyla paylaştığınız kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla işlemekteyiz.',
  'İletişim formu üzerinden paylaştığınız ad-soyad, telefon numarası, e-posta adresi, şirket bilgisi ve mesaj içeriği gibi kişisel verileriniz; talep ve mesajlarınızın alınması, değerlendirilmesi, sizinle iletişime geçilmesi, teklif ve bilgi taleplerinizin yanıtlanması, hizmet süreçlerinin yürütülmesi ve müşteri ilişkileri süreçlerinin takibi amaçlarıyla işlenebilecektir.',
  'Kişisel verileriniz, internet sitesi üzerindeki iletişim formu aracılığıyla elektronik ortamda otomatik yöntemlerle toplanmakta olup, ilgili başvurunun değerlendirilmesi, iletişim faaliyetlerinin yürütülmesi ve veri sorumlusunun meşru menfaatleri kapsamında işlenebilecektir.',
  'Kişisel verileriniz; yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarına, hukuki ve teknik süreçlerin yürütülmesi amacıyla danışmanlık alınan taraflara, barındırma, altyapı, CRM, e-posta ve yazılım hizmeti alınan tedarikçilere, yalnızca gerekli olduğu ölçüde aktarılabilecektir.',
  'KVKK’nın 11. maddesi kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme, silinmesini veya yok edilmesini isteme ve kanunda sayılan diğer haklara sahipsiniz. Bu haklarınıza ilişkin taleplerinizi aşağıdaki iletişim bilgileri üzerinden bize iletebilirsiniz.',
];

const EN_PARAGRAPHS = [
  'As Join PR, we process the personal data you share through the contact form in our capacity as the data controller within the scope of the Personal Data Protection Law No. 6698.',
  'The personal data you share through the contact form, such as your full name, phone number, email address, company information, and message content, may be processed for the purposes of receiving and evaluating your requests and messages, contacting you, responding to your requests for proposals and information, carrying out service processes, and managing customer relationship processes.',
  'Your personal data is collected electronically through the contact form on our website by automatic means and may be processed for the evaluation of the relevant application, the execution of communication activities, and the legitimate interests of the data controller.',
  'Your personal data may be transferred, only to the extent necessary, to authorized public institutions and organizations for the fulfillment of legal obligations, to parties from whom legal and technical consultancy services are received, and to suppliers providing hosting, infrastructure, CRM, email, and software services.',
  'Within the scope of Article 11 of the Law on the Protection of Personal Data, you have the right to learn whether your personal data is being processed, to request information if it has been processed, to learn the purpose of processing and whether it is used in accordance with that purpose, to know the third parties to whom it is transferred, to request correction if it is incomplete or incorrectly processed, to request deletion or destruction, and to exercise the other rights granted under the law. You may submit your requests regarding these rights to us through the contact details below.',
];

export function IletisimKvkkContent() {
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
        <h1 className="text-center text-2xl font-semibold">{isTr ? 'KVKK Aydınlatma Metni' : 'KVKK Clarification Text'}</h1>
        <p className="text-center text-sm text-zinc-300">
          {isTr
            ? 'İletişim Formu Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni'
            : 'Clarification Text on the Processing of Personal Data for the Contact Form'}
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="space-y-4 text-zinc-200">
          {(isTr ? TR_PARAGRAPHS : EN_PARAGRAPHS).map((paragraph) => (
            <p key={paragraph} className="leading-7">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 space-y-1 border-t border-zinc-800 pt-5 text-sm text-zinc-200">
          {isTr ? (
            <>
              <p>
                <span className="font-semibold text-zinc-100">Veri Sorumlusu:</span> Join PR
              </p>
              <p>
                <span className="font-semibold text-zinc-100">Adres:</span> Dikilitas Mah, Hakki Yekten Caddesi
                Selenium Plaza No:10/N Kat:6, 34351 Besiktas/Istanbul
              </p>
              <p>
                <span className="font-semibold text-zinc-100">E-posta:</span> info@joinpr.com.tr
              </p>
              <p>
                <span className="font-semibold text-zinc-100">Telefon:</span> 0 (212) 381 86 56
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold text-zinc-100">Data Controller:</span> Join PR
              </p>
              <p>
                <span className="font-semibold text-zinc-100">Address:</span> Dikilitas Mah, Hakki Yekten Caddesi
                Selenium Plaza No:10/N Floor:6, 34351 Besiktas/Istanbul
              </p>
              <p>
                <span className="font-semibold text-zinc-100">Email:</span> info@joinpr.com.tr
              </p>
              <p>
                <span className="font-semibold text-zinc-100">Phone:</span> +90 212 381 86 56
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
