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
  const baseUrl = 'https://www.joinpr.com';
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

  // Özel slug kontrolü
  const blogContent: Record<string, { title: string; description?: string; image?: string; category?: string }> = {
    'genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlarini-kesfedin': {
      title: "Gençlik Mucizesi: Yüz ve Boyun Germe Ameliyatlarını Keşfedin!",
      description: "Yüz ve boyun germe ameliyatlarının son dönemde sıklıkla tercih edildiğini ve bütünsel genç bir görünüme zemin hazırladığını söyleyen Dr. Yücel Sarıaltın, \"Yüz ve boyun bölgesinin bir arada ele alınmasıyla bütünsel genç bir görünüm elde ediliyor. Geçiş bölgelerindeki sarkma ve gevşemeleri düzelterek daha harmonik bir görünüm elde edilebiliyor\" dedi.",
      image: '/genclik-mucizesi-yuz-ve-boyun-germe-ameliyatlari.jpg',
      category: 'Marka İletişimi'
    },
    'ucak-bileti-fiyatina-avrupa-turlari': {
      title: "Uçak Bileti Fiyatına Avrupa Turları",
      description: "Mevcut ekonomik koşullarda tatil yapılabilmesi için daha çok çalıştıklarını ve erken rezervasyon döneminde olduğu gibi uygun fiyatlı paket turların sayısını artırdıklarını ifade eden Prontotour Yönetim Kurulu Başkanı Ali Onaran, vizesiz tur alternatiflerini de artırdıklarını belirtti.",
      image: '/ucak-bileti-fiyatina-avrupa-turlari.jpg',
      category: 'Destinasyon PR'
    }
  };

  const currentSlug = slug || '';
  const specialContent = blogContent[currentSlug];
  const title = specialContent?.title || currentBlog?.title || 'Blog | Join PR Group';
  const description = specialContent?.description || currentBlog?.description || translations.homepage.blog.description;
  const blogImage = specialContent?.image || currentBlog?.image;
  const blogCategory = specialContent?.category || currentBlog?.category || '';

  // Eğer blog yazısı değilse, metadata'yı boş bırak (Next.js otomatik 404 döndürecek)
  if (!currentBlog && !specialContent) {
    return {
      title: 'Sayfa Bulunamadı | Join PR Group',
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
    title: `${title} | Join PR Group`,
    description,
    openGraph: {
      ...metadata.openGraph,
      title: `${title} | Join PR Group`,
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
      title: `${title} | Join PR Group`,
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

