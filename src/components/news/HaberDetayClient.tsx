'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { haberSlugFromPathname } from '@/lib/news-href';
import { getNewsApiUrl, resolveNewsImageSrc } from '@/lib/news-api';
import { normalizeSlugPart } from '@/lib/slug';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

const BASE_PATH = ''; // Root dizin - joinpr.com.tr

const slugify = (text: string) => normalizeSlugPart(text);

// Eski / farklı slug varyasyonları (URL aynı kalabilir, sadece içerik eşleştirme için).
const LEGACY_LOOKUP_ALIASES: Record<string, string> = {
  'turk-oyuncular-m-s-r-n-en-unlu-tatil-merkezinde-bulustu': 'turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu',
};

// Zorunlu canonical redirect (gerçekten bozuk/uygunsuz slug'ları tek bir adrese sabitlemek için).
const LEGACY_REDIRECT_ALIASES: Record<string, string> = {
  'turk-oyuncular-m-s-r-n-en-unlu-tatil-merkezinde-bulustu': 'turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu',
};

export function HaberDetayClient({ rawSlug }: { rawSlug: string }) {
  const [adminNews, setAdminNews] = useState<{
    title: string;
    title_en?: string | null;
    slug: string;
    category?: string | null;
    category_en?: string | null;
    description: string;
    description_en?: string | null;
    image?: string | null;
    platform_links?: Array<{ href: string; image: string; label: string }> | null;
    platform_links_en?: Array<{ href: string; image: string; label: string }> | null;
  } | null>(null);

  /** API cevabi gelmeden once (veya slug yokken) yanlislikla "bulunamadi" gostermemek icin. */
  const [adminFetchFinished, setAdminFetchFinished] = useState(false);

  const router = useRouter();
  const { translations, locale } = useLanguage();
  const normalizedSlug = useMemo(() => normalizeSlugPart(rawSlug), [rawSlug]);
  const lookupSlug = useMemo(() => LEGACY_LOOKUP_ALIASES[normalizedSlug] || normalizedSlug, [normalizedSlug]);
  const redirectSlug = useMemo(() => LEGACY_REDIRECT_ALIASES[normalizedSlug] || normalizedSlug, [normalizedSlug]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setAdminFetchFinished(false);
      let slugForApi = lookupSlug;
      if (!slugForApi && typeof window !== 'undefined') {
        const fromPath = normalizeSlugPart(haberSlugFromPathname(window.location.pathname));
        slugForApi = LEGACY_LOOKUP_ALIASES[fromPath] || fromPath;
      }
      if (!slugForApi) {
        if (alive) setAdminFetchFinished(true);
        return;
      }
      try {
        const url = getNewsApiUrl(`slug=${encodeURIComponent(slugForApi)}`);
        const res = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) return;
        if (alive) {
          const item = data.item || null;
          if (!item) {
            setAdminNews(null);
          } else {
            setAdminNews({
              ...item,
              title: locale === 'en' ? (item.title_en || item.title) : item.title,
              category: locale === 'en' ? (item.category_en || item.category) : item.category,
              description: locale === 'en' ? (item.description_en || item.description) : item.description,
            });
          }
        }
      } catch {
        // Sessiz fallback: locale json verisine don.
      } finally {
        if (alive) setAdminFetchFinished(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [lookupSlug, locale]);

  useEffect(() => {
    // URL’ye Türkçe karakterli slug geldiyse normalize et.
    // Not: bazı legacy varyasyonlarda (örn. misir-in) URL'yi bilerek aynen koruyoruz.
    if (rawSlug && redirectSlug && normalizeSlugPart(rawSlug) !== redirectSlug) {
      router.replace(`/haber/${redirectSlug}`);
    }
  }, [rawSlug, redirectSlug, router]);

  // Hem TR hem EN dosyalarından haberleri al
  const trCases = (tr.homepage?.cases?.cards || []) as Array<{ title: string; category: string; description: string; image?: string }>;
  const enCases = (en.homepage?.cases?.cards || []) as Array<{ title: string; category: string; description: string; image?: string }>;
  
  const cases = translations.homepage.cases;
  const caseItems = (cases?.cards || trCases) as Array<{ title: string; category: string; description: string; image?: string }>;

  // Slug eşleşmesi: Her zaman TR başlığından slug oluşturup eşleştir
  const trMatch = trCases.find((item) => slugify(item.title) === lookupSlug);
  
  let current: { title: string; category?: string; description: string; image?: string } | undefined;
  
  if (trMatch) {
    // TR'deki index'i bul
    const trIndex = trCases.indexOf(trMatch);
    // Mevcut dildeki aynı index'teki haberi al
    if (trIndex !== -1) {
      // Önce mevcut dildeki (translations) haberi kullan
      if (caseItems[trIndex]) {
        current = caseItems[trIndex];
      } else if (locale === 'en' && enCases[trIndex]) {
        // EN dilinde ve translations'da yoksa, EN dosyasından direkt al
        current = enCases[trIndex];
      } else {
        // Fallback: TR haberini göster
        current = trMatch;
      }
    } else {
      current = trMatch;
    }
  }
  if (adminNews) {
    current = {
      title: adminNews.title,
      category: adminNews.category || undefined,
      description: adminNews.description,
      image: adminNews.image || undefined,
    };
  }

  // External links kontrolü - slug'a göre direkt kontrol
  const externalLinks: Array<{ href: string; image: string; label: string }> = [];
  const currentSlug = lookupSlug || '';

  const localePlatformLinks =
    locale === 'en' ? (adminNews?.platform_links_en || []) : (adminNews?.platform_links || []);
  if (localePlatformLinks.length) {
    externalLinks.push(...localePlatformLinks);
  } else if (currentSlug === 'dunya-yildizlari-rixos-misir-da-bulustu-2026-ya-gorkemli-baslangic') {
    externalLinks.push(
      {
        href: 'https://www.cumhuriyet.com.tr/is-dunyasi/dunya-yildizlari-rixos-misir-da-bulustu-2026-ya-gorkemli-baslangic-2468638',
        image: '/cunhuriyet.webp',
        label: 'Cumhuriyet',
      },
      {
        href: 'https://www.dunya.com/sektorler/turizm/dunya-yildizlari-rixos-misirda-bulustu-2026ya-gorkemli-baslangic-haberi-810933',
        image: '/dunya.com.png',
        label: 'Dünya.com',
      },
      {
        href: 'https://www.turizmajansi.com/haber/rixos-misir-ceo-su-yildirim-misir-kis-doneminde-de-guclu-bir-alternatif-h71226',
        image: '/turizm_ajansi_logo.png',
        label: 'Turizm Ajansı',
      },
      {
        href: 'https://www.turizmaktuel.com/haber/rixos-dunya-yildizlarini-misir-da-bulusturdu-2026-ya-gorkemli-baslangic',
        image: '/turizm_aktuel.svg',
        label: 'Turizm Aktüel',
      },
      {
        href: 'https://www.tourismtoday.net/TR/2025/2895/Rixos-Misir-dunya-yildizlariyla-2026-ya-gorkemli-bir-baslangic-yapti',
        image: '/tourism-today.webp',
        label: 'Tourism Today',
      }
    );
  }
  if (!adminNews && currentSlug === 'lara-fabian-sevgililer-gunu-nde-rixos-radamis-sharm-el-sheikh-te-sahne-aliyor') {
    if (locale === 'en') {
      externalLinks.push(
        {
          href: 'https://apnews.com/press-release/ein-presswire-newsmatics/global-star-lara-fabian-set-to-headline-a-spectacular-valentines-concert-at-rixos-radamis-sharm-el-sheikh-e78544c2b19f4efaefbf1ceb950f45cb',
          image: '/ap-news.svg',
          label: 'AP News',
        },
        {
          href: 'https://www.augustachronicle.com/press-release/story/86409/global-star-lara-fabian-set-to-headline-a-spectacular-valentines-concert-at-rixos-radamis-sharm-el-sheikh/',
          image: '/agusta.svg',
          label: 'Augusta Chronicle',
        },
        {
          href: 'https://natlawreview.com/press-releases/global-star-lara-fabian-set-headline-spectacular-valentines-concert-rixos',
          image: '/national_law.webp',
          label: 'National Law Review',
        }
      );
    } else {
      externalLinks.push(
        {
          href: 'https://onedio.com/haber/lara-fabian-sevgililer-gunu-nde-rixos-radamis-sharm-el-sheikh-te-sahne-aliyor-1337005',
          image: '/sondakika.webp',
          label: 'Onedio',
        },
        {
          href: 'https://www.yenicaggazetesi.com/ask-sarkilari-kizildenizde-yankilanacak-lara-fabian-rixos-radamis-sahnesinde-992885h.htm',
          image: '/yenicag.webp',
          label: 'Yeniçağ',
        },
        {
          href: 'https://www.dha.com.tr/kultur-sanat/lara-fabian-sevgililer-gununde-sharm-el-sheikhte-sahne-alacak-2797400',
          image: '/demiroren-haber-ajansi.webp',
          label: 'DHA',
        },
        {
          href: 'https://www.karar.com/hayat-haberleri/ask-sarkilari-kizildenizde-yankilanacak-lara-fabian-rixos-radamis-2021250',
          image: '/karar-logo-1.webp',
          label: 'KARAR',
        },
        {
          href: 'https://www.tourismtoday.net/TR/2025/2939/Lara-Fabian-Sevgililer-Gunu-nde-Rixos-Radamis-Sharm-El-Sheikh-te-sahne-aliyor',
          image: '/tourism-today.webp',
          label: 'Tourism Today',
        }
      );
    }
  }
  if (!adminNews && currentSlug === 'rixos-misir-dan-destinasyon-yonetimi-gelistirilmesinde-yeni-hamle-sharm-el-sheikh-global-hint-dugunlerinin-yeni-adresi-oldu') {
    if (locale === 'en') {
      externalLinks.push(
        {
          href: 'https://www.tribuneindia.com/news/business/rixos-hotels-egypt-elevates-destination-management-for-indias-expanding-wedding-market/#google_vignette',
          image: '/tribun.webp',
          label: 'The Tribune',
        },
        {
          href: 'https://m.dailyhunt.in/news/india/english/newsvoir-epaper-newsvoir/rixos+hotels+egypt+elevates+destination+management+for+india+s+expanding+wedding+market-newsid-n693244366?listname=newspaperLanding&topic=business&index=11&topicIndex=0&mode=pwa',
          image: '/dailyhunt.svg',
          label: 'DailyHunt',
        },
        {
          href: 'https://www.aninews.in/news/business/rixos-hotels-egypt-elevates-destination-management-for-indias-expanding-wedding-market20251216131634/',
          image: '/ani_logo.png',
          label: 'ANI News',
        },
        {
          href: 'https://flipboard.com/topic/moneyindia/rixos-hotels-egypt-elevates-destination-management-for-india-s-expanding-wedding/a-tJztF0nOToiB-U_GVuXJnw:a:106586776-3292ff3c9f%2Findiatimes.com',
          image: '/flipboard-logo-png_seeklogo-302594.png',
          label: 'Flipboard',
        },
        {
          href: 'https://www.theweek.in/wire-updates/business/2025/12/16/dcm24-rixos-hotels-egypt.html',
          image: '/theweek.png',
          label: 'The Week',
        },
        {
          href: 'https://www.ptinews.com/press-release/rixos-hotels-egypt-elevates-destination-management-for-indias-expanding-wedding-market/3193466',
          image: '/ptinews.webp',
          label: 'PTI News',
        },
        {
          href: 'https://obnews.co/Index/flowNewsDetail/id/13079850.html?val=27f2d703df39c3844fe22df353f368c5',
          image: '/obnews.png',
          label: 'OB News',
        },
        {
          href: 'https://www.latestly.com/agency-news/business-news-rixos-hotels-egypt-elevates-destination-management-for-indias-expanding-wedding-market-7240432.html',
          image: '/latestly.png',
          label: 'LatestLY',
        }
      );
    } else {
      externalLinks.push(
        {
          href: 'https://www.yenicaggazetesi.com/rixos-misirdan-destinasyon-yonetimi-gelistirilmesinde-yeni-hamle-sharm-el-sheikh-global-hint-dugunlerinin-yeni-adresi-oldu-987028h.htm',
          image: '/yenicag.webp',
          label: 'Yeniçağ',
        },
        {
          href: 'https://www.karar.com/hayat-haberleri/sharm-el-sheikh-global-hint-dugunlerinin-yeni-adresi-oldu-2014409',
          image: '/karar-logo-1.webp',
          label: 'KARAR',
        },
        {
          href: 'https://www.dha.com.tr/kurumsal/sharm-el-sheikh-global-hint-dugunlerinin-yeni-adresi-oldu-2778149',
          image: '/demiroren-haber-ajansi.webp',
          label: 'DHA',
        },
        {
          href: 'https://www.gazetebirlik.com/ekonomi/rixos-misirdan-destinasyon-yonetimi-gelistirilmesinde-yeni-hamle/918517',
          image: '/yenicag.webp',
          label: 'Gazete Birlik',
        },
        {
          href: 'https://www.turizmajansi.com/haber/rixos-misir-dan-global-hint-dugunleri-icin-yeni-hamle-rixos-radamis-sharm-el-sheikh-h71031',
          image: '/turizm_ajansi_logo.png',
          label: 'Turizm Ajansı',
        },
        {
          href: 'https://www.turizmaktuel.com/haber/rixos-sharm-el-sheikh-i-hint-dugunlerinin-yeni-merkezi-yapti',
          image: '/turizm_aktuel.svg',
          label: 'Turizm Aktüel',
        },
        {
          href: 'https://www.tourismtoday.net/TR/2025/2598/Rixos-Misir-Sharm-El-Sheikh-i-hint-dugunlerinin-yeni-adresi-haline-getiriyor',
          image: '/tourism-today.webp',
          label: 'Tourism Today',
        }
      );
    }
  }
  if (!adminNews && currentSlug === 'ennismore-kahire-de-sehir-projesini-rixos-ile-hayata-geciriyor') {
    externalLinks.push(
      {
        href: 'https://www.haberler.com/guncel/kahire-de-rixos-oteli-ve-yasam-projesi-acilacak-19479281-haberi/',
        image: '/haberler.com_.webp',
        label: 'Haberler.com',
      },
      {
        href: 'https://www.sondakika.com/haber/haber-kahire-de-rixos-projesi-start-aliyor-19479340/',
        image: '/sondakika.webp',
        label: 'SonDakika.com',
      },
      {
        href: 'https://www.dha.com.tr/kurumsal/ennismore-kahirede-sehir-projesini-rixos-ile-hayata-geciriyor-2801596',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.turizmaktuel.com/haber/ennismore-kahire-de-ilk-sehir-projesini-rixos-ile-hayata-geciriyor',
        image: '/turizm_aktuel.svg',
        label: 'Turizm Aktüel',
      }
    );
  }
  if (!adminNews && (currentSlug === 'turk-oyuncular-karadaga-cikarma-yapti' || currentSlug === 'turk-oyuncular-karadag-a-c-karma-yapt')) {
    externalLinks.push({
      href: 'https://www.haberler.com/magazin/turk-oyuncular-karadag-039-a-cikarma-yapti-15058636-haberi/',
      image: '/haberler.com_.webp',
      label: 'Haberler.com',
    });
  }
  if (!adminNews && (currentSlug === 'urdun-destinasyon-tanitimi' || currentSlug === 'urdun-destinasyon-tan-t-m')) {
    externalLinks.push({
      href: 'https://www.dha.com.tr/kultur-sanat/turk-dizi-oyunculari-urdunde-2224858',
      image: '/demiroren-haber-ajansi.webp',
      label: 'DHA',
    });
  }
  if (!adminNews && (currentSlug === 'turk-oyuncular-urdun-e-hayran-kaldi' || currentSlug === 'turk-oyuncular-urdun-e-hayran-kald')) {
    externalLinks.push(
      {
        href: 'https://www.sozcu.com.tr/turk-dizi-oyunculari-urdunde-wp7628820',
        image: '/Sozculogo248x90.png',
        label: 'Sözcü',
      },
      {
        href: 'https://www.sabah.com.tr/magazin/turk-oyuncular-urdunde-6409508',
        image: '/sabah.webp',
        label: 'Sabah',
      },
      {
        href: 'https://www.haberler.com/turk-dizi-oyunculari-urdun-de-15713248-haberi/',
        image: '/haberler.com_.webp',
        label: 'Haberler.com',
      },
      {
        href: 'https://www.dha.com.tr/kultur-sanat/turk-dizi-oyunculari-urdunde-2224858',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      }
    );
  }
  if (!adminNews && currentSlug === 'turk-oyunculardan-bahreyn-cikarmasi') {
    externalLinks.push({
      href: 'https://www.aksam.com.tr/magazin/turk-oyunculardan-bahreyn-cikarmasi-etkinlikte-buyuk-ilgi/haber-1318272',
      image: '/aksam-logo.svg',
      label: 'Akşam',
    });
  }
  if (!adminNews && (currentSlug === 'turk-oyuncular-misirda' || currentSlug === 'turk-oyuncular-misir-da')) {
    externalLinks.push(
      {
        href: 'https://www.hurriyet.com.tr/yerel-haberler/istanbul/turk-oyuncular-misirda-42175720',
        image: '/hurriyet.webp',
        label: 'Hürriyet',
      },
      {
        href: 'https://www.milliyet.com.tr/yerel-haberler/istanbul/turk-oyuncular-misirda-6861774',
        image: '/milliyet.webp',
        label: 'Milliyet',
      },
      {
        href: 'https://www.dha.com.tr/kultur-sanat/turk-oyuncular-misirda-2166126',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.ntv.com.tr/galeri/n-life/magazin/cemre-baysel-gokhan-alkan-gizem-karaca-serkay-tutuncu-mehmet-aykac-ve-gulper-ozdemir-misirda,xVNEWEWkM0iOFF-4t6VxFA/1',
        image: '/NTV_logo.png',
        label: 'NTV',
      },
      {
        href: 'https://www.aksam.com.tr/magazin/aytac-sasmaz-ayriligini-unutmaya-calisiyor-cemre-baysel-misirda/haber-1321983',
        image: '/aksam-logo.svg',
        label: 'Akşam',
      }
    );
  }
  if (
    !adminNews &&
    (currentSlug === 'turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu' ||
      currentSlug === 'turk-oyuncular-misir-in-en-unlu-tatil-merkezinde-bulustu')
  ) {
    externalLinks.push({
      href: 'https://www.iha.com.tr/haber-turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu-1141810',
      image: '/ihlas-haber-ajansi-1.webp',
      label: 'İhlas Haber Ajansı',
    });
  }
  if (!adminNews && currentSlug === 'jennifer-lopez-sharm-el-sheikh-te') {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/kultur-sanat/jennifer-lopez-dunya-turnesi-kapsaminda-sharm-el-sheikhte-sahne-aldi-2692963',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.cumhuriyet.com.tr/is-dunyasi/rixos-misir-dan-tarihi-gece-jennifer-lopez-den-rixos-misafirlerine-ozel-konser-2423860',
        image: '/cunhuriyet.webp',
        label: 'Cumhuriyet',
      },
      {
        href: 'https://www.dunya.com/kultur-sanat/rixos-misirdan-tarihi-gece-jennifer-lopezden-rixos-misafirlerine-ozel-konser-haberi-788165',
        image: '/dunya.com.png',
        label: 'Dünya.com',
      },
      {
        href: 'https://haberglobal.com/magazin/jennifer-lopez-dunya-turnesi-kapsaminda-sharm-el-sheikhte-sahne-aldi-469494',
        image: '/haber_globa.png',
        label: 'Haber Global',
      },
      {
        href: 'https://www.haberler.com/magazin/jennifer-lopez-rixos-radamis-te-unutulmaz-bir-konser-verdii-18913811-haberi/',
        image: '/haberler.com_.webp',
        label: 'Haberler.com',
      }
    );
  }
  if (
    !adminNews &&
    currentSlug === 'rixos-radamis-sharm-el-sheikh-4-ay-boyunca-michelin-yildizli-sefleri-agirlayacak'
  ) {
    externalLinks.push(
      {
        href: 'https://www.cumhuriyet.com.tr/is-dunyasi/michelin-yildizli-sefler-ozgun-lezzetlerini-rixos-radamis-sharm-el-2238400',
        image: '/cunhuriyet.webp',
        label: 'Cumhuriyet',
      },
      {
        href: 'https://www.hurriyet.com.tr/yerel-haberler/istanbul/misirdaki-unlu-otel-4-ay-boyunca-michelin-yil-42505727?ust=1774947060000000&hl=tr',
        image: '/hurriyet.webp',
        label: 'Hürriyet',
      },
      {
        href: 'https://www.milliyet.com.tr/yerel-haberler/istanbul/misirdaki-unlu-otel-4-ay-boyunca-michelin-yil-7172555',
        image: '/milliyet.webp',
        label: 'Milliyet',
      },
      {
        href: 'https://www.cnnturk.com/yerel-haberler/istanbul/misirdaki-unlu-otel-4-ay-boyunca-michelin-yildizli-seflerini-agirlayacak-2141561',
        image: '/cnn-turk-logo-1.webp',
        label: 'CNN Türk',
      },
      {
        href: 'https://www.yenicaggazetesi.com/michelin-yildizli-sefler-ozgun-lezzetlerini-rixos-radamis-sharm-el-sheikhde-sunacak-831663h.htm',
        image: '/yenicag.webp',
        label: 'Yeniçağ',
      },
      {
        href: 'https://www.gazetevatan.com/yerel-haberler/istanbul/misirdaki-unlu-otel-4-ay-boyunca-michelin-yil-2163631',
        image: '/gazete-vatan.webp',
        label: 'Gazete Vatan',
      }
    );
  }
  if (
    !adminNews &&
    currentSlug === 'dr-yucel-sarialtin-yuz-ve-boyun-bolgesinde-sanat-eseri-yaratmak-icin-calisiyoruz'
  ) {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/saglik-yasam/yuz-ve-boyun-germe-islemleri-genc-gorunumu-mumkun-kiliyor-2314311',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.cumhuriyet.com.tr/yasam/uzmani-acikladi-estetik-sonrasinda-iyilesme-sureci-cilt-bakim-2179659',
        image: '/cunhuriyet.webp',
        label: 'Cumhuriyet',
      },
      {
        href: 'https://www.karar.com/hayat-haberleri/op-dr-estetik-cerrah-yucel-sarialtin-2-yillik-ar-ge-asamasinin-ardindan-1839643',
        image: '/karar-logo-1.webp',
        label: 'KARAR',
      }
    );
  }
  if (!adminNews && currentSlug === 'rixos-radamis-kongre-merkezi-acildi') {
    externalLinks.push(
      {
        href: 'https://www.turizmajansi.com/haber/rixos-radamis-kongre-merkezi-acildi-h70829',
        image: '/turizm_ajansi_logo.png',
        label: 'Turizm Ajansı',
      },
      {
        href: 'https://gmtourism.com/rixos-radamis-kongre-merkezi-acildi-sharm-el-sheikh-kongre-turizminin-yeni-ussu-oluyor',
        image: '/gm-dergi-logo.webp',
        label: 'GM Dergi',
      }
    );
  }
  if (!adminNews && currentSlug === 'hadise-sarm-el-seyh-te-4-bin-kisiye-konser-verdi') {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/kultur-sanat/hadise-2025-yilinin-ilk-konserini-sarm-el-seyhte-verecek-2543450',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.turizmdays.com/',
        image: '/turizmdays_logo kopya.webp',
        label: 'Turizm Days',
      },
      {
        href: 'https://www.gazetepencere.com/kultur-sanat/hadise-sarm-el-seyhte-sahne-aldi-3-bin-kisilik-dev-konser-646547h',
        image: '/gazete_pencere kopya.webp',
        label: 'Gazete Pencere',
      },
      {
        href: 'https://www.odatv.com/magazin/hadise-2025te-ilk-konserini-misir-sharm-el-seyhde-verecek-2024te-kac-konser-verdi-120074853',
        image: '/oda_tv_logo kopya.webp',
        label: 'Oda TV',
      },
      {
        href: 'https://www.yenicaggazetesi.com/rixos-premium-seagatete-hadise-ruzgari-esti-875944h.htm',
        image: '/yenicag.webp',
        label: 'Yeniçağ',
      },
      {
        href: 'https://www.cumhuriyet.com.tr/is-dunyasi/rixos-premium-seagatete-hadise-ruzgari-esti-2286995',
        image: '/cunhuriyet.webp',
        label: 'Cumhuriyet',
      }
    );
  }
  if (
    !adminNews &&
    currentSlug === 'rixos-radamis-sharm-el-sheikh-enrique-iglesias-in-muhtesem-performansina-ev-sahipligi-yapti'
  ) {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/kultur-sanat/enrique-iglesias-sharm-el-sheikhte-sahne-aldi-2634199',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.turizmdays.com/news/rixos-radamis-sharm-el-sheikhte-enrique-iglesias-firtinasi-esti-28349',
        image: '/turizmdays_logo kopya.webp',
        label: 'Turizm Days',
      },
      {
        href: 'https://www.cumhuriyet.com.tr/is-dunyasi/rixos-radamis-sharm-el-sheikhte-enrique-iglesias-firtinasi-esti-2336285',
        image: '/cunhuriyet.webp',
        label: 'Cumhuriyet',
      },
      {
        href: 'https://www.turizmaktuel.com/haber/rixos-radamis-sharm-el-sheikh-te-enrique-iglesias-firtinasi-esti',
        image: '/turizm_aktuel.svg',
        label: 'Turizm Aktüel',
      }
    );
  }
  if (
    !adminNews &&
    currentSlug === 'afrika-turizm-forumu-20-21-mayis-2024-de-sharm-el-sheikh-uluslararasi-kongre-merkezi-nde-gerceklesecek'
  ) {
    externalLinks.push(
      {
        href: 'https://www.hurriyet.com.tr/ekonomi/turk-turizmciler-afrikaya-aciliyor-42463014',
        image: '/hurriyet.webp',
        label: 'Hürriyet',
      },
      {
        href: 'https://www.turizmhaberci.com/afrika-turizm-fuari-misir-sharm-el-sheikh-te-gerceklestirilecek-h3198.html',
        image: '/turizm_haberci_logo.png',
        label: 'Turizm Haberci',
      },
      {
        href: 'https://www.turizmguncel.com/haber/afrika-turizm-forumu-20-mayista-misirda-baslayacak',
        image: '/turizm_guncel.png',
        label: 'Turizm Güncel',
      },
      {
        href: 'https://www.turizmciningazetesi.com/turk-turizmciler-afrika-turizm-forumunda/',
        image: '/turizmcinin_gazetesi.png',
        label: 'Turizmcinin Gazetesi',
      }
    );
  }
  if (
    !adminNews &&
    (currentSlug === 'misirda-col-safarisi' ||
      currentSlug === 'm-s-r-da-col-safarisi' ||
      currentSlug === 'misir-da-col-safarisi')
  ) {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/kultur-sanat/turk-oyuncular-misirda-col-safarisi-yapti-2229247',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.sabah.com.tr/kultur-sanat/2023/04/02/turk-oyuncularin-sarm-el-seyhte-safari-keyfi',
        image: '/sabah.webp',
        label: 'Sabah',
      },
      {
        href: 'https://www.turizmguncel.com/haber/turk-unluler-misiritanitti',
        image: '/turizm_guncel.png',
        label: 'Turizm Güncel',
      },
      {
        href: 'https://www.haberler.com/turk-oyuncular-misir-da-col-safarisi-yapti-15733501-haberi/',
        image: '/haberler.com_.webp',
        label: 'Haberler.com',
      },
      {
        href: 'https://www.gazetevatan.com/magazin/unluler-col-safarisinde-tam-bir-yildizlar-gecidi-2089623',
        image: '/gazete-vatan.webp',
        label: 'Gazete Vatan',
      }
    );
  }
  if (
    !adminNews &&
    (currentSlug === 'turk-oyuncular-kizildeniz-de-tatil-keyfi-yapti' ||
      currentSlug === 'turk-oyuncular-kizildenizde-tatil-keyfi-yapti')
  ) {
    externalLinks.push({
      href: 'https://www.iha.com.tr/haber-turk-oyuncular-kizildenizde-tatil-keyfi-yapti-1179129',
      image: '/ihlas-haber-ajansi-1.webp',
      label: 'İhlas Haber Ajansı',
    });
  }
  if (
    !adminNews &&
    (currentSlug === 'prontotour-un-2024-erken-rezervasyon-donemi-basladi' ||
      currentSlug === 'prontotour-un-2024-erken-rezervasyon-donemi-baslad')
  ) {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/ekonomi/prontotour-yuzde-50-indirimli-erken-rezervasyon-kampanyasi-baslatti-2326857',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.karar.com/hayat-haberleri/prontotourun-2024-erken-rezervasyon-donemi-unlu-oyuncular-ile-basladi-1795756',
        image: '/karar-logo-1.webp',
        label: 'KARAR',
      },
      {
        href: 'https://www.turizmajansi.com/haber/prontotour-un-2024-erken-rezervasyon-donemi-unlu-oyuncularla-basladi-h64351',
        image: '/turizm_ajansi_logo.png',
        label: 'Turizm Ajansı',
      }
    );
  }
  if (!adminNews && currentSlug === 'prontotour-unlu-oyuncu-ve-influencer-lara-yonelik-bir-dunya-turu-programi-baslatiyor') {
    externalLinks.push(
      {
        href: 'https://www.sondakika.com/turizm/haber-prontotour-unlu-oyuncu-ve-influencer-lara-yonelik-bir-dunya-turu-programi-baslatiyor-16376787/',
        image: '/sondakika.webp',
        label: 'SonDakika.com',
      },
      {
        href: 'https://www.karar.com/hayat-haberleri/tur-sirketi-kendi-gezgin-unlulerini-secti-1791266',
        image: '/karar-logo-1.webp',
        label: 'KARAR',
      },
      {
        href: 'https://www.dha.com.tr/gundem/unlu-oyuncular-ve-influencerlar-dunya-turuna-cikiyor-2319324',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.turizmajansi.com/haber/unlu-oyuncular-ve-influencer-lar-dunya-turuna-cikiyor-h63245',
        image: '/turizm_ajansi_logo.png',
        label: 'Turizm Ajansı',
      }
    );
  }
  if (!adminNews && currentSlug === 'prontotour-da-erken-rezervasyon-donemi-basladi-2025-icin-hedef-60-bin-turist') {
    externalLinks.push(
      {
        href: 'https://www.turizmaktuel.com/haber/prontotour-erken-rezervasyonu-yuzde-50-indirimle-baslatti#:~:text=2024%2012%3A43-,Prontotour%2C%20%E2%80%9CSak%C4%B1n%20ge%C3%A7%20kalma%20erken%20gel!%E2%80%9D',
        image: '/turizm_aktuel.svg',
        label: 'Turizm Aktüel',
      },
      {
        href: 'https://www.turizmajansi.com/haber/prontotour-erken-rezervasyonu-yuzde-50-indirimle-baslatti-h67114',
        image: '/turizm_ajansi_logo.png',
        label: 'Turizm Ajansı',
      },
      {
        href: 'https://www.gazetepencere.com/gezilecek-yerler/prontotour-erken-rezervasyonu-yuzde-50-indirimle-baslatti-634397h',
        image: '/gazete_pencere kopya.webp',
        label: 'Gazete Pencere',
      },
      {
        href: 'https://www.gazeteduvar.com.tr/prontotourdan-erken-rezervasyonda-yuzde-50-indirim-haber-1726422',
        image: '/gazete_duvar.png',
        label: 'Gazete Duvar',
      },
      {
        href: 'https://www.dha.com.tr/ekonomi/prontotour-erken-rezervasyonu-yuzde-50-indirimle-baslattigini-duyurdu-2517207',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      }
    );
  }
  if (!adminNews && currentSlug === 'leaders-cxo-14-bulusma-toplantisi') {
    externalLinks.push({
      href: 'https://www.oncevatan.com.tr/leaderscxo-14-bulusma-toplantisi',
      image: '/once-vatan.webp',
      label: 'Önce Vatan',
    });
  }
  if (!adminNews && currentSlug === 'prontotour-erken-rezervasyonun-ilk-donemini-70-artisla-tamamladi') {
    externalLinks.push(
      {
        href: 'https://www.yenicaggazetesi.com.tr/prontotourda-erken-rezervasyon-avantajlari-750430h.htm',
        image: '/yenicag.webp',
        label: 'Yeniçağ',
      },
      {
        href: 'https://www.karar.com/hayat-haberleri/prontotourda-erken-rezervasyon-avantajlari-1823271',
        image: '/karar-logo-1.webp',
        label: 'KARAR',
      },
      {
        href: 'https://www.dha.com.tr/ekonomi/prontotourdan-erken-rezervasyon-kampanyasi-2366814',
        image: '/demiroren-haber-ajansi.webp',
        label: 'DHA',
      },
      {
        href: 'https://www.gmdergi.com/aktuel/onaran-rezervasyonlarda-yuzde-70-artis-yakaladik/',
        image: '/gm-dergi-logo.webp',
        label: 'GM Dergi',
      }
    );
  }
  if (
    !adminNews &&
    (currentSlug === 'prontotour-30-yasini-marakes-te-kutladi' ||
      currentSlug === 'prontotour-30uncu-yasini-marakeste-kutladi')
  ) {
    externalLinks.push(
      {
        href: 'https://www.cnnturk.com/yerel-haberler/istanbul/prontotour-30uncu-yasini-marakeste-kutladi-2096703',
        image: '/cnn-turk-logo-1.webp',
        label: 'CNN Türk',
      },
      {
        href: 'https://www.hurriyet.com.tr/yerel-haberler/istanbul/prontotour-30uncu-yasini-marakeste-kutladi-42426806',
        image: '/hurriyet.webp',
        label: 'Hürriyet',
      },
      {
        href: 'https://www.posta.com.tr/yerel-haberler/istanbul/prontotour-30uncu-yasini-marakeste-kutladi-2703467',
        image: '/posta-logo.webp',
        label: 'Posta',
      },
      {
        href: 'https://www.yeniasir.com.tr/sarmasik/2024/03/21/prontotour-30-yasini-marakeste-kutladi',
        image: '/yeni-asir-logo.webp',
        label: 'Yeni Asır',
      }
    );
  }

  if (!current && !adminFetchFinished) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-zinc-400">
        {locale === 'tr' ? 'Haber yükleniyor…' : 'Loading article…'}
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold text-white">
          {locale === 'tr' ? 'Haber bulunamadı' : 'News not found'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
          >
            {locale === 'tr' ? 'Geri dön' : 'Go back'}
          </button>
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {locale === 'tr' ? 'Ana sayfa' : 'Home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl min-w-0 flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      {/* Baslik + giris: Prontotour vb. statik haber sayfalariyla ayni tipografi */}
      <header className="max-w-4xl space-y-4 md:space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl md:leading-tight">
          {current.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg md:leading-relaxed">
          {current.description}
        </p>
      </header>

      {current.image ? (
        <figure className="w-full min-w-0 shrink-0">
          {/* Klasik haber sayfalariyla ayni cerceve + 16:9; uzak URL icin img */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="relative aspect-[16/9] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveNewsImageSrc(current.image, BASE_PATH)}
                alt={current.title}
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </figure>
      ) : null}

      {externalLinks.length > 0 && (
        <div className="w-full min-w-0 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-200">
            {locale === 'tr' ? 'Yayınlanan platformlar' : 'Published Platforms'}
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex min-h-[2.5rem] w-full flex-1 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveNewsImageSrc(link.image, BASE_PATH)}
                    alt={link.label}
                    className={`w-auto max-w-full object-contain ${['Haberler.com', 'SonDakika.com', 'DHA', 'Turizm Aktüel', 'Turizm Ajansı', 'Dünya.com', 'Cumhuriyet', 'Tourism Today', 'Yeniçağ', 'KARAR', 'Gazete Birlik', 'Onedio', 'AP News', 'Augusta Chronicle', 'National Law Review', 'The Tribune', 'DailyHunt', 'ANI News', 'Flipboard', 'The Week', 'PTI News', 'OB News', 'LatestLY'].includes(link.label) ? 'max-h-20' : 'max-h-10'} ${link.label === 'Gazete Duvar' ? 'max-h-24 scale-110' : ''} ${currentSlug === 'turk-oyuncular-misir-da' && (link.label === 'Hürriyet' || link.label === 'Milliyet') ? 'scale-150' : ''} ${currentSlug === 'prontotour-un-2024-erken-rezervasyon-donemi-basladi' && link.label === 'TOURISM TODAY' ? 'max-h-none h-12 scale-[5] origin-center' : ''}`}
                  />
                </div>
                <span className="text-center text-xs leading-tight">
                  {locale === 'tr' ? 'Haberi İncele' : 'Read News'}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/kategori/haberler"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
        >
          {locale === 'tr' ? 'Haberlere dön' : 'Back to News'}
        </Link>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {locale === 'tr' ? 'Ana sayfa' : 'Home'}
        </Link>
      </div>
    </div>
  );
}

