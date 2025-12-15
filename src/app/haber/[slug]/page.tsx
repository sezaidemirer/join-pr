'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function NewsDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { translations } = useLanguage();

  const cases = translations.homepage.cases;
  const caseItems = cases.cards as Array<{ title: string; category: string; description: string; image?: string }>;

  // Sadece normalize edilmiş slug'ı kullan
  const current = caseItems.find((item) => slugify(item.title) === params.slug);
  
  // External links kontrolü - slug'a göre direkt kontrol
  const externalLinks: Array<{ href: string; image: string; label: string }> = [];
  const currentSlug = params.slug || '';
  
  if (currentSlug === 'turk-oyuncular-karadaga-cikarma-yapti' || currentSlug === 'turk-oyuncular-karadag-a-c-karma-yapt') {
    externalLinks.push({
      href: 'https://www.haberler.com/magazin/turk-oyuncular-karadag-039-a-cikarma-yapti-15058636-haberi/',
      image: '/haberler.com_.jpg',
      label: 'Haberler.com',
    });
  }
  if (currentSlug === 'urdun-destinasyon-tanitimi' || currentSlug === 'urdun-destinasyon-tan-t-m') {
    externalLinks.push({
      href: 'https://www.dha.com.tr/kultur-sanat/turk-dizi-oyunculari-urdunde-2224858',
      image: '/demiroren-haber-ajansi.jpg',
      label: 'DHA',
    });
  }
  if (currentSlug === 'turk-oyuncular-urdun-e-hayran-kaldi' || currentSlug === 'turk-oyuncular-urdun-e-hayran-kald') {
    externalLinks.push({
      href: 'https://joinpr.com.tr/turk-oyuncular-urdune-hayran-kaldi/',
      image: '/sondakika.jpg',
      label: 'SonDakika.com',
    });
  }
  if (currentSlug === 'turk-oyunculardan-bahreyn-cikarmasi') {
    externalLinks.push({
      href: 'https://www.aksam.com.tr/magazin/turk-oyunculardan-bahreyn-cikarmasi-etkinlikte-buyuk-ilgi/haber-1318272',
      image: '/aksam-logo.jpg',
      label: 'Akşam',
    });
  }
  if (
    currentSlug === 'turk-oyuncular-misirda' ||
    currentSlug === 'turk-oyuncular-misir-da'
  ) {
    externalLinks.push(
      {
        href: 'https://www.hurriyet.com.tr/yerel-haberler/istanbul/turk-oyuncular-misirda-42175720',
        image: '/hurriyet.jpg',
        label: 'Hürriyet',
      },
      {
        href: 'https://www.milliyet.com.tr/yerel-haberler/istanbul/turk-oyuncular-misirda-6861774',
        image: '/milliyet.jpg',
        label: 'Milliyet',
      },
      {
        href: 'https://www.albawaba.com/business/pr/turkish-celebrities-ventured-desert-safari-tour-sharm-el-sheikh-1514510',
        image: '/al-bawaba.jpg',
        label: 'Albawaba',
      },
      {
        href: 'https://menafn.com/1105953774/Turkish-Celebrities-Ventured-in-a-Desert-Safari-Tour-at-Sharm-El-Sheikh',
        image: '/menafn.jpg',
        label: 'MENAFN',
      }
    );
  }
  if (
    currentSlug === 'turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu' ||
    currentSlug === 'turk-oyuncular-misir-in-en-unlu-tatil-merkezinde-bulustu'
  ) {
    externalLinks.push({
      href: 'https://www.iha.com.tr/haber-turk-oyuncular-misirin-en-unlu-tatil-merkezinde-bulustu-1141810',
      image: '/ihlas-haber-ajansi-1.jpg',
      label: 'İhlas Haber Ajansı',
    });
  }
  if (currentSlug === 'jennifer-lopez-sharm-el-sheikh-te') {
    externalLinks.push(
      {
        href: 'https://www.sabah.com.tr/yasam/rixos-misirdan-tarihi-gece-jennifer-lopezden-rixos-misafirlerine-ozel-konser-7399527#:~:text=%C4%B0konik%20y%C4%B1ld%C4%B1z%20Jennifer%20Lopez%2C%202025,ya%C5%9Fanmam%C4%B1%C5%9F%20bir%20k%C3%BClt%C3%BCrel%20zirveye%20d%C3%B6n%C3%BC%C5%9Ft%C3%BC.',
        image: '/sabah.webp',
        label: 'Sabah',
      },
      {
        href: 'https://www.dha.com.tr/kultur-sanat/jennifer-lopez-dunya-turnesi-kapsaminda-sharm-el-sheikhte-sahne-aldi-2692963',
        image: '/demiroren-haber-ajansi.jpg',
        label: 'DHA',
      },
      {
        href: 'https://www.cumhuriyet.com.tr/is-dunyasi/jennifer-lopez-2025-dunya-turnesine-rixos-radamis-sharm-el-sheikhte-2333698',
        image: '/cunhuriyet.jpg',
        label: 'Cumhuriyet',
      }
    );
  }
  if (
    currentSlug === 'rixos-radamis-sharm-el-sheikh-4-ay-boyunca-michelin-yildizli-sefleri-agirlayacak'
  ) {
    externalLinks.push({
      href: 'https://www.cumhuriyet.com.tr/is-dunyasi/michelin-yildizli-sefler-ozgun-lezzetlerini-rixos-radamis-sharm-el-2238400',
      image: '/cunhuriyet.jpg',
      label: 'Cumhuriyet',
    });
  }
  if (
    currentSlug === 'dr-yucel-sarialtin-yuz-ve-boyun-bolgesinde-sanat-eseri-yaratmak-icin-calisiyoruz'
  ) {
    externalLinks.push({
      href: 'https://www.dha.com.tr/saglik-yasam/yuz-ve-boyun-germe-islemleri-genc-gorunumu-mumkun-kiliyor-2314311',
      image: '/demiroren-haber-ajansi.jpg',
      label: 'DHA',
    });
  }
  if (currentSlug === 'rixos-radamis-kongre-merkezi-acildi') {
    externalLinks.push(
      {
        href: 'https://www.turizmajansi.com/haber/rixos-radamis-kongre-merkezi-acildi-h70829',
        image: '/turizm_ajansi_logo.png',
        label: 'Turizm Ajansı',
      },
      {
        href: 'https://gmtourism.com/rixos-radamis-kongre-merkezi-acildi-sharm-el-sheikh-kongre-turizminin-yeni-ussu-oluyor',
        image: '/gm-dergi-logo.jpg',
        label: 'GM Dergi',
      }
    );
  }
  if (
    currentSlug === 'prontotour-da-erken-rezervasyon-donemi-basladi-2025-icin-hedef-60-bin-turist'
  ) {
    externalLinks.push({
      href: 'https://www.klassmagazin.com/prontotourda-erken-rezervasyon-donemi-basladi-2025-icin-hedef-60-bin-turist',
      image: '/klass-magazin-logo.png',
      label: 'KLASS Magazin',
    });
  }
  if (currentSlug === 'hadise-sarm-el-seyh-te-4-bin-kisiye-konser-verdi') {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/kultur-sanat/hadise-2025-yilinin-ilk-konserini-sarm-el-seyhte-verecek-2543450',
        image: '/demiroren-haber-ajansi.jpg',
        label: 'DHA',
      },
      {
        href: 'https://www.turizmdays.com/',
        image: '/turizmdays_logo kopya.jpg',
        label: 'Turizm Days',
      },
      {
        href: 'https://www.gazetepencere.com/kultur-sanat/hadise-sarm-el-seyhte-sahne-aldi-3-bin-kisilik-dev-konser-646547h',
        image: '/gazete_pencere kopya.jpg',
        label: 'Gazete Pencere',
      },
      {
        href: 'https://www.odatv.com/magazin/hadise-2025te-ilk-konserini-misir-sharm-el-seyhde-verecek-2024te-kac-konser-verdi-120074853',
        image: '/oda_tv_logo kopya.jpg',
        label: 'Oda TV',
      }
    );
  }
  if (
    currentSlug === 'rixos-radamis-sharm-el-sheikh-enrique-iglesias-in-muhtesem-performansina-ev-sahipligi-yapti'
  ) {
    externalLinks.push(
      {
        href: 'https://www.klassmagazin.com/rixos-radamis-sharm-el-sheikh-enrique-iglesiasin-muhtesem-performansina-ev-sahipligi-yapti',
        image: '/klass-magazin-logo.png',
        label: 'KLASS Magazin',
      },
      {
        href: 'https://www.dha.com.tr/kultur-sanat/enrique-iglesias-sharm-el-sheikhte-sahne-aldi-2634199',
        image: '/demiroren-haber-ajansi.jpg',
        label: 'DHA',
      },
      {
        href: 'https://www.turizmdays.com/news/rixos-radamis-sharm-el-sheikhte-enrique-iglesias-firtinasi-esti-28349',
        image: '/turizmdays_logo kopya.jpg',
        label: 'Turizm Days',
      }
    );
  }
  if (
    currentSlug === 'afrika-turizm-forumu-20-21-mayis-2024-de-sharm-el-sheikh-uluslararasi-kongre-merkezi-nde-gerceklesecek'
  ) {
    externalLinks.push(
      {
        href: 'https://www.hurriyet.com.tr/ekonomi/turk-turizmciler-afrikaya-aciliyor-42463014',
        image: '/hurriyet.jpg',
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
    currentSlug === 'misirda-col-safarisi' ||
    currentSlug === 'm-s-r-da-col-safarisi' ||
    currentSlug === 'misir-da-col-safarisi'
  ) {
    externalLinks.push({
      href: 'https://www.dha.com.tr/kultur-sanat/turk-oyuncular-misirda-col-safarisi-yapti-2229247',
      image: '/demiroren-haber-ajansi.jpg',
      label: 'DHA',
    });
  }
  if (
    currentSlug === 'turk-oyuncular-kizildeniz-de-tatil-keyfi-yapti' ||
    currentSlug === 'turk-oyuncular-kizildenizde-tatil-keyfi-yapti'
  ) {
    externalLinks.push({
      href: 'https://www.iha.com.tr/haber-turk-oyuncular-kizildenizde-tatil-keyfi-yapti-1179129',
      image: '/ihlas-haber-ajansi-1.jpg',
      label: 'İhlas Haber Ajansı',
    });
  }
  if (
    currentSlug === 'prontotour-un-2024-erken-rezervasyon-donemi-baslad' ||
    currentSlug === 'prontotour-un-2024-erken-rezervasyon-donemi-baslad'
  ) {
    externalLinks.push(
      {
        href: 'https://www.dha.com.tr/ekonomi/prontotour-yuzde-50-indirimli-erken-rezervasyon-kampanyasi-baslatti-2326857',
        image: '/demiroren-haber-ajansi.jpg',
        label: 'DHA',
      },
      {
        href: 'https://www.tourismtoday.net/kategoriler/acenta-haberleri/prontotour-2024-erken-rezervasyon-donemini-unlu-oyuncularla-acti/',
        image: '/tourism-today.jpg',
        label: 'TOURISM TODAY',
      },
      {
        href: 'https://www.karar.com/hayat-haberleri/prontotourun-2024-erken-rezervasyon-donemi-unlu-oyuncular-ile-basladi-1795756',
        image: '/karar-logo-1.jpg',
        label: 'KARAR',
      }
    );
  }
  if (currentSlug === 'prontotour-unlu-oyuncu-ve-influencer-lara-yonelik-bir-dunya-turu-programi-baslatiyor') {
    externalLinks.push({
      href: 'https://www.sondakika.com/turizm/haber-prontotour-unlu-oyuncu-ve-influencer-lara-yonelik-bir-dunya-turu-programi-baslatiyor-16376787/',
      image: '/sondakika.jpg',
      label: 'SonDakika.com',
    });
  }
  if (currentSlug === 'leaders-cxo-14-bulusma-toplantisi') {
    externalLinks.push({
      href: 'https://www.oncevatan.com.tr/leaderscxo-14-bulusma-toplantisi',
      image: '/once-vatan.jpg',
      label: 'Önce Vatan',
    });
  }
  if (currentSlug === 'prontotour-erken-rezervasyonun-ilk-donemini-70-artisla-tamamladi') {
    externalLinks.push(
      {
        href: 'https://www.yenicaggazetesi.com.tr/prontotourda-erken-rezervasyon-avantajlari-750430h.htm',
        image: '/yenicag.jpg',
        label: 'Yeniçağ',
      },
      {
        href: 'https://www.karar.com/hayat-haberleri/prontotourda-erken-rezervasyon-avantajlari-1823271',
        image: '/karar-logo-1.jpg',
        label: 'KARAR',
      },
      {
        href: 'https://www.dha.com.tr/ekonomi/prontotourdan-erken-rezervasyon-kampanyasi-2366814',
        image: '/demiroren-haber-ajansi.jpg',
        label: 'DHA',
      },
      {
        href: 'https://www.gmdergi.com/aktuel/onaran-rezervasyonlarda-yuzde-70-artis-yakaladik/',
        image: '/gm-dergi-logo.jpg',
        label: 'GM Dergi',
      }
    );
  }
  if (
    currentSlug === 'prontotour-30-yasini-marakes-te-kutladi' ||
    currentSlug === 'prontotour-30uncu-yasini-marakeste-kutladi'
  ) {
    externalLinks.push(
      {
        href: 'https://www.cnnturk.com/yerel-haberler/istanbul/prontotour-30uncu-yasini-marakeste-kutladi-2096703',
        image: '/cnn-turk-logo-1.jpg',
        label: 'CNN Türk',
      },
      {
        href: 'https://www.hurriyet.com.tr/yerel-haberler/istanbul/prontotour-30uncu-yasini-marakeste-kutladi-42426806',
        image: '/hurriyet.jpg',
        label: 'Hürriyet',
      },
      {
        href: 'https://www.posta.com.tr/yerel-haberler/istanbul/prontotour-30uncu-yasini-marakeste-kutladi-2703467',
        image: '/posta-logo.jpg',
        label: 'Posta',
      },
      {
        href: 'https://www.yeniasir.com.tr/sarmasik/2024/03/21/prontotour-30-yasini-marakeste-kutladi',
        image: '/yeni-asir-logo.jpg',
        label: 'Yeni Asır',
      }
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold text-white">Haber bulunamadı</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
          >
            Geri dön
          </button>
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-300">
          {current.category}
        </div>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">{current.title}</h1>
        <p className="max-w-3xl text-base text-zinc-300 md:text-lg">{current.description}</p>
      </div>

      {current.image && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={`${BASE_PATH}${current.image}`}
              alt={current.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}

      {externalLinks.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-200">Yayınlanan platformlar</p>
          <div className="flex flex-wrap gap-3">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <Image
                  src={`${BASE_PATH}${link.image}`}
                  alt={link.label}
                  width={120}
                  height={36}
                  className="h-9 w-auto object-contain"
                  unoptimized
                />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href="/kategori/haberler"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
        >
          Haberlere dön
        </Link>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}

