import { MedyaYansimaRaporuEntryClient } from '../[brand]/[project]/[entry]/MedyaYansimaRaporuEntryClient';

/**
 * Kalıcı entry shell sayfası — cPanel statik build için.
 * /medya-yansima-raporu/[brand]/[project]/[entry]/ URL'leri
 * .htaccess tarafından bu sayfaya yönlendirilir.
 * MedyaYansimaRaporuEntryClient usePathname() ile gerçek URL'yi okur.
 */
export default function MedyaYansimaRaporuDetayPage() {
  return <MedyaYansimaRaporuEntryClient />;
}
