import type { Metadata } from 'next';

import { getLocale, getMetadataForLocale, slugify } from '@/lib/metadata';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

interface BlogDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogItemsTr = tr.homepage.blog.cards as Array<{ title: string; category: string; description: string; image?: string; link?: string }>;
  const blogItemsEn = en.homepage.blog.cards as Array<{ title: string; category: string; description: string; image?: string; link?: string }>;
  
  // Tüm blog slug'larını oluştur (link'lerden veya title'lardan)
  const slugs = new Set<string>();
  
  // Özel blog slug'ları
  slugs.add('genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlarini-kesfedin');
  slugs.add('ucak-bileti-fiyatina-avrupa-turlari');

  // Landing page slug (generateStaticParams için gerekli)
  slugs.add('turizm-reklam-ajansi-performans-yonetimi');
  slugs.add('clinic-reklam-ajansi-performans-yonetimi');

  // Medya yansıma raporu (hem /medya-yansima-raporu hem /bana/medya-yansima-raporu)
  slugs.add('medya-yansima-raporu');
  
  // Link'lerden slug oluştur
  blogItemsTr.forEach((item) => {
    if (item.link) {
      const linkSlug = item.link.replace(/^\//, '');
      slugs.add(linkSlug);
    } else {
      slugs.add(slugify(item.title));
    }
  });
  
  blogItemsEn.forEach((item) => {
    if (item.link) {
      const linkSlug = item.link.replace(/^\//, '');
      slugs.add(linkSlug);
    } else {
      slugs.add(slugify(item.title));
    }
  });
  
  return Array.from(slugs).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogDetailLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const translations = locale === 'tr' ? tr : en;
  const baseUrl = 'https://joinpr.com.tr';
  const pagePath = `/${slug}`;

  const blogItems = translations.homepage.blog.cards as Array<{
    title: string;
    category: string;
    description: string;
    image?: string;
    link?: string;
  }>;
  // Blog yazısını link'e göre bul (link zaten slug formatında)
  const currentBlog = blogItems.find((item) => {
    if (item.link) {
      // Link'ten başındaki / işaretini kaldır
      const linkSlug = item.link.replace(/^\//, '');
      return linkSlug === slug;
    }
    // Link yoksa title'dan slug oluştur
    return slugify(item.title) === slug;
  });

  // Medya yansıma raporu metadata
  if (slug === 'medya-yansima-raporu') {
    const medyaTitle = (translations as any).pages?.medyaYansimaRaporu?.seo?.title || 'Medya Yansıma Raporu | Join PR';
    const medyaDesc = (translations as any).pages?.medyaYansimaRaporu?.seo?.description || 'Join PR medya yansıma ve basın takip raporları.';
    return {
      title: medyaTitle,
      description: medyaDesc,
      openGraph: {
        title: medyaTitle,
        description: medyaDesc,
        url: `${baseUrl}/medya-yansima-raporu`,
        siteName: 'Join PR',
        locale: 'tr_TR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: medyaTitle,
        description: medyaDesc,
      },
      robots: { index: true, follow: true },
    };
  }

  // Turizm landing page metadata - SEO
  if (slug === 'turizm-reklam-ajansi-performans-yonetimi') {
    const turizmTitle = 'Turizm Reklam Ajansı | Seyahat Acentaları için AI Destekli Performans Yönetimi | Join PR';
    const turizmDesc =
      'Turizm şirketleri ve seyahat acentaları için Google & Meta reklam yönetimi. Rakip analizi, destinasyon bazlı kampanya stratejisi ve ölçülebilir büyüme sistemi. Ücretsiz dijital konum analizi alın.';
    const turizmUrl = 'https://www.joinpr.com.tr/turizm-reklam-ajansi-performans-yonetimi';
    const turizmImage = 'https://www.joinpr.com.tr/og-image.webp';
    const turizmKeywords = [
      'turizm reklam ajansı',
      'seyahat acentası reklam',
      'tur operatörü dijital pazarlama',
      'Google Ads turizm',
      'Meta reklam seyahat',
      'rakip analizi turizm',
      'destinasyon bazlı reklam',
      'rezervasyon odaklı kampanya',
      'ROAS turizm',
      'AI rekabet analizi',
      'Join PR turizm',
    ];

    return {
      title: turizmTitle,
      description: turizmDesc,
      keywords: turizmKeywords,
      alternates: {
        canonical: turizmUrl,
      },
      openGraph: {
        title: 'Turizm Reklam Ajansı | AI Destekli Performans Yönetimi | Join PR',
        description: turizmDesc,
        url: turizmUrl,
        siteName: 'Join PR',
        locale: 'tr_TR',
        type: 'website',
        images: [
          {
            url: turizmImage,
            width: 1200,
            height: 630,
            alt: 'Turizm Reklam Ajansı - AI Destekli Performans Yönetimi',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Turizm Reklam Ajansı | AI Destekli Performans Yönetimi | Join PR',
        description: turizmDesc,
        images: [turizmImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  }

  // Klinik landing page metadata - SEO
  if (slug === 'clinic-reklam-ajansi-performans-yonetimi') {
    const clinicTitle = 'Klinik Reklam Ajansı | Estetik ve Sağlık Klinikleri için AI Destekli Performans Yönetimi | Join PR';
    const clinicDesc =
      'Estetik, saç ekimi ve sağlık klinikleri için Google & Meta reklam yönetimi. Rakip analizi, tedavi/hizmet bazlı kampanya stratejisi ve ölçülebilir randevu büyümesi. Ücretsiz dijital konum analizi alın.';
    const clinicUrl = 'https://www.joinpr.com.tr/clinic-reklam-ajansi-performans-yonetimi';
    const clinicImage = 'https://www.joinpr.com.tr/og-image.webp';
    const clinicKeywords = [
      'klinik reklam ajansı',
      'estetik klinik reklam',
      'saç ekimi dijital pazarlama',
      'Google Ads klinik',
      'Meta reklam estetik',
      'rakip analizi klinik',
      'randevu odaklı kampanya',
      'ROAS klinik',
      'AI rekabet analizi klinik',
      'Join PR klinik',
    ];

    return {
      title: clinicTitle,
      description: clinicDesc,
      keywords: clinicKeywords,
      alternates: {
        canonical: clinicUrl,
      },
      openGraph: {
        title: 'Klinik Reklam Ajansı | AI Destekli Performans Yönetimi | Join PR',
        description: clinicDesc,
        url: clinicUrl,
        siteName: 'Join PR',
        locale: 'tr_TR',
        type: 'website',
        images: [
          {
            url: clinicImage,
            width: 1200,
            height: 630,
            alt: 'Klinik Reklam Ajansı - AI Destekli Performans Yönetimi',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Klinik Reklam Ajansı | AI Destekli Performans Yönetimi | Join PR',
        description: clinicDesc,
        images: [clinicImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  }

  // Özel slug kontrolü
  const blogContent: Record<string, { title: string; description?: string; image?: string; category?: string }> = {
    'genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlarini-kesfedin': {
      title: "Gençlik Mucizesi: Yüz ve Boyun Germe Ameliyatlarını Keşfedin!",
      description: "Yüz ve boyun germe ameliyatlarının son dönemde sıklıkla tercih edildiğini ve bütünsel genç bir görünüme zemin hazırladığını söyleyen Dr. Yücel Sarıaltın, \"Yüz ve boyun bölgesinin bir arada ele alınmasıyla bütünsel genç bir görünüm elde ediliyor. Geçiş bölgelerindeki sarkma ve gevşemeleri düzelterek daha harmonik bir görünüm elde edilebiliyor\" dedi.",
      image: '/genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlari.webp',
      category: 'Marka İletişimi'
    },
    'ucak-bileti-fiyatina-avrupa-turlari': {
      title: "Uçak Bileti Fiyatına Avrupa Turları",
      description: "Mevcut ekonomik koşullarda tatil yapılabilmesi için daha çok çalıştıklarını ve erken rezervasyon döneminde olduğu gibi uygun fiyatlı paket turların sayısını artırdıklarını ifade eden Prontotour Yönetim Kurulu Başkanı Ali Onaran, vizesiz tur alternatiflerini de artırdıklarını belirtti.",
      image: '/ucak-bileti-fiyatina-avrupa-turlari.webp',
      category: 'Destinasyon PR'
    }
  };

  const currentSlug = slug || '';
  const specialContent = blogContent[currentSlug];
  // medya-yansima-raporu için currentBlog/specialContent yok ama sayfa var
  const isMedyaRaporu = currentSlug === 'medya-yansima-raporu';
  const title = isMedyaRaporu
    ? ((translations as any).pages?.medyaYansimaRaporu?.seo?.title || 'Medya Yansıma Raporu | Join PR')
    : (specialContent?.title || currentBlog?.title || 'Blog | Join PR');
  const description = isMedyaRaporu
    ? ((translations as any).pages?.medyaYansimaRaporu?.seo?.description || '')
    : (specialContent?.description || currentBlog?.description || translations.homepage.blog.description);
  const blogImage = specialContent?.image || currentBlog?.image;
  const blogCategory = specialContent?.category || currentBlog?.category || '';

  // Eğer blog yazısı değilse ve medya raporu da değilse, metadata'yı 404 yap
  if (!currentBlog && !specialContent && !isMedyaRaporu) {
    return {
      title: 'Sayfa Bulunamadı | Join PR',
      description: 'Aradığınız sayfa bulunamadı.',
    };
  }

  const keywords = [
    'blog',
    'PR blog',
    'marketing blog',
    'communication insights',
    'Join PR blog',
    blogCategory,
    title,
  ];

  const metadata = getMetadataForLocale(locale, pagePath, '', keywords);

  return {
    ...metadata,
    title: `${title} | Join PR`,
    description,
    openGraph: {
      ...metadata.openGraph,
      title: `${title} | Join PR`,
      description,
      images: blogImage
        ? [
            {
              url: `${baseUrl}${blogImage}`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : metadata.openGraph?.images,
    },
    twitter: {
      ...metadata.twitter,
      title: `${title} | Join PR`,
      description,
      images: blogImage
        ? [`${baseUrl}${blogImage}`]
        : metadata.twitter?.images,
    },
  };
}

export default function BlogDetailLayout({ children }: BlogDetailLayoutProps) {
  return <>{children}</>;
}

