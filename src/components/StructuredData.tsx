'use client';

export function StructuredData() {
  const baseUrl = 'https://joinpr.com.tr';
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Join PR',
    alternateName: 'Join PR',
    url: baseUrl,
    logo: `${baseUrl}/join_pr_logo_offical2.png`,
    description: 'Join PR brings together strategic communication, creative production, social media, performance marketing, AI solutions and travel storytelling under one ecosystem.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dikilitaş Mah, Hakkı Yekten Caddesi Selenium Plaza No:10/N Kat:6',
      addressLocality: 'Beşiktaş',
      addressRegion: 'İstanbul',
      postalCode: '34351',
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-212-381-86-56',
      contactType: 'Customer Service',
      email: 'info@joinpr.com.tr',
      areaServed: ['TR', 'World'],
      availableLanguage: ['Turkish', 'English'],
    },
    sameAs: [
      'https://www.instagram.com/join.pr/',
      'https://www.linkedin.com/company/join-pr/',
      'https://www.facebook.com/joinproffical',
      'https://www.youtube.com/@JoinContentsTV',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Join PR',
    url: baseUrl,
    description: 'Join PR brings together strategic communication, creative production, social media, performance marketing, AI solutions and travel storytelling under one ecosystem.',
    publisher: {
      '@type': 'Organization',
      name: 'Join PR',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/kategori/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
