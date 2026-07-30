'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-HG8VT73N46';
const GOOGLE_ADS_ID = 'AW-17641617179';

/**
 * Tek gtag.js yüklemesi + tek dataLayer/gtag tanımı.
 * (Önceden GA ve Ads için ayrı script’ler vardı; ikinci inline `function gtag` üstüne yazıyordu — yarış / sıra riski.)
 * Consent Mode bu projede tanımlı değil; conversion’ı engelleyecek gtag('consent', ...) yok.
 */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script
        id="google-tags-ga4-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
