/**
 * Haber / mecra logoları listesi.
 * Görüntü URL’leri yalnızca Supabase `haber-platform-logos` (veya NEXT_PUBLIC_HABER_LOGOS_STORAGE_BASE) üzerinden üretilir; `public/` yedeği yok.
 */
import { haberPlatformLogoPublicUrl } from '@/lib/haber-logo-storage';

export type HaberPlatformLogo = { path: string; label: string };

const PATHS: string[] = [
  '/NTV_logo.png',
  '/Sozculogo248x90.png',
  '/agusta.svg',
  '/aksam-logo.svg',
  '/al-bawaba.webp',
  '/ani_logo.png',
  '/ap-news.svg',
  '/cnn-turk-logo-1.webp',
  '/cunhuriyet.webp',
  '/dailyhunt.svg',
  '/demiroren-haber-ajansi.webp',
  '/dunya.com.png',
  '/flipboard-logo-png_seeklogo-302594.png',
  '/gazete-vatan.webp',
  '/gazete_duvar.png',
  '/gazete_pencere kopya.webp',
  '/gm-dergi-logo.webp',
  '/haber_globa.png',
  '/haberler.com_.webp',
  '/hurriyet.webp',
  '/ihlas-haber-ajansi-1.webp',
  '/karar-logo-1.webp',
  '/latestly.png',
  '/milliyet.webp',
  '/national_law.webp',
  '/obnews.png',
  '/oda_tv_logo kopya.webp',
  '/once-vatan.webp',
  '/posta-logo.webp',
  '/ptinews.webp',
  '/sabah.webp',
  '/sondakika.webp',
  '/theweek.png',
  '/tourism-today.webp',
  '/tribun.webp',
  '/turizm_ajansi_logo.png',
  '/turizm_aktuel.svg',
  '/turizm_guncel.png',
  '/turizm_haberci_logo.png',
  '/turizmcinin_gazetesi.png',
  '/turizmdays_logo kopya.webp',
  '/yeni-asir-logo.webp',
  '/yenicag.webp',
];

/** Bucket kökündeki dosya adları (çakışma kontrolü / seed seti). */
export const HABER_SEEDED_LOGO_FILES = new Set(PATHS.map((p) => p.replace(/^\//, '')));

function labelFromPath(path: string): string {
  const base = path.replace(/^\//, '').replace(/\.[^.]+$/, '');
  return base.replace(/[_-]+/g, ' ').trim() || path;
}

export const HABER_PLATFORM_LOGOS: HaberPlatformLogo[] = [...PATHS]
  .sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }))
  .map((p) => {
    const key = p.replace(/^\//, '');
    return { path: haberPlatformLogoPublicUrl(key), label: labelFromPath(p) };
  });

/** PDF / URL'den host: "Sondakika.com", "https://www.x.com/y" → "x.com" */
export function normalizeOutletToHost(raw: string): string {
  let s = (raw || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) {
    try {
      return new URL(s).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {
      s = s.replace(/^https?:\/\//i, '');
    }
  }
  const slash = s.indexOf('/');
  if (slash >= 0) s = s.slice(0, slash);
  return s.replace(/^www\./i, '').toLowerCase();
}

/** Dosya adı (uzantılı), bucket köküne göre */
const LOGO_BY_HOST: Record<string, string> = {
  'sondakika.com': 'sondakika.webp',
  'haberler.com': 'haberler.com_.webp',
  'yenicaggazetesi.com.tr': 'yenicag.webp',
  'yenicaggazetesi.com': 'yenicag.webp',
  'sabah.com.tr': 'sabah.webp',
  'cumhuriyet.com.tr': 'cunhuriyet.webp',
  'karar.com': 'karar-logo-1.webp',
  'haberglobal.com.tr': 'haber_globa.png',
  'cnnturk.com.tr': 'cnn-turk-logo-1.webp',
  'aksam.com.tr': 'aksam-logo.svg',
  'hurriyet.com.tr': 'hurriyet.webp',
  'milliyet.com.tr': 'milliyet.webp',
  'posta.com.tr': 'posta-logo.webp',
  'ntv.com.tr': 'NTV_logo.png',
  'ntvspor.net': 'NTV_logo.png',
  'sozcu.com.tr': 'Sozculogo248x90.png',
  'dunya.com': 'dunya.com.png',
  'iha.com.tr': 'ihlas-haber-ajansi-1.webp',
  'dha.com.tr': 'demiroren-haber-ajansi.webp',
  'apnews.com': 'ap-news.svg',
  'turizmajansi.com': 'turizm_ajansi_logo.png',
  'turizmaktuel.com': 'turizm_aktuel.svg',
  'tourismtoday.net': 'tourism-today.webp',
  'gazeteduvar.com': 'gazete_duvar.png',
  'onedio.com': 'sondakika.webp',
  'gazetebirlik.com': 'yenicag.webp',
  'tribuneindia.com': 'tribun.webp',
  'flipboard.com': 'flipboard-logo-png_seeklogo-302594.png',
  'theweek.in': 'theweek.png',
  'ptinews.com': 'ptinews.webp',
  'latestly.com': 'latestly.png',
  'aninews.in': 'ani_logo.png',
  'dailyhunt.in': 'dailyhunt.svg',
  'obnews.co': 'obnews.png',
  'natlawreview.com': 'national_law.webp',
  'augustachronicle.com': 'agusta.svg',
  'al-bawaba.com': 'al-bawaba.webp',
};

const LOGO_BY_STEM: Record<string, string> = {
  sondakika: 'sondakika.webp',
  haberler: 'haberler.com_.webp',
  yenicaggazetesi: 'yenicag.webp',
  yenicag: 'yenicag.webp',
  sabah: 'sabah.webp',
  cumhuriyet: 'cunhuriyet.webp',
  karar: 'karar-logo-1.webp',
  haberglobal: 'haber_globa.png',
  cnnturk: 'cnn-turk-logo-1.webp',
  aksam: 'aksam-logo.svg',
  hurriyet: 'hurriyet.webp',
  milliyet: 'milliyet.webp',
  posta: 'posta-logo.webp',
  ntv: 'NTV_logo.png',
  sozcu: 'Sozculogo248x90.png',
  dunya: 'dunya.com.png',
  iha: 'ihlas-haber-ajansi-1.webp',
  dha: 'demiroren-haber-ajansi.webp',
  apnews: 'ap-news.svg',
  turizmajansi: 'turizm_ajansi_logo.png',
  turizmaktuel: 'turizm_aktuel.svg',
  tourismtoday: 'tourism-today.webp',
  gazeteduvar: 'gazete_duvar.png',
  odatv: 'oda_tv_logo kopya.webp',
  flipboard: 'flipboard-logo-png_seeklogo-302594.png',
  theweek: 'theweek.png',
  ptinews: 'ptinews.webp',
  latestly: 'latestly.png',
  ani: 'ani_logo.png',
  aninews: 'ani_logo.png',
  dailyhunt: 'dailyhunt.svg',
  obnews: 'obnews.png',
  tribuneindia: 'tribun.webp',
  albawaba: 'al-bawaba.webp',
  turizmguncel: 'turizm_guncel.png',
  turizmhaberci: 'turizm_haberci_logo.png',
  turizmcinin: 'turizmcinin_gazetesi.png',
  turizmdays: 'turizmdays_logo kopya.webp',
  yeniasir: 'yeni-asir-logo.webp',
  oncevatan: 'once-vatan.webp',
};

/** Tam görüntüleme URL’si (Supabase public veya yerel /public yedeği). */
export function resolveLocalHaberLogoPath(outletOrUrl: string): string | null {
  const host = normalizeOutletToHost(outletOrUrl);
  if (!host || !host.includes('.')) return null;
  const direct = LOGO_BY_HOST[host];
  if (direct) return haberPlatformLogoPublicUrl(direct);
  const stem = host.split('.')[0];
  if (!stem) return null;
  const byStem = LOGO_BY_STEM[stem];
  if (byStem) return haberPlatformLogoPublicUrl(byStem);
  return null;
}
