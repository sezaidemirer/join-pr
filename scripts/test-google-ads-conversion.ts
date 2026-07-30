/**
 * Terminalden mantık doğrulaması: gerçek tarayıcı/Zoho yok.
 * Çalıştır: npx tsx scripts/test-google-ads-conversion.ts
 */
import {
  explainZohoMessageForConversion,
  isGoogleAdsLandingConversionPath,
  isZohoFormSuccessfulSubmitMessage,
} from '../src/lib/google-ads-landing-conversion';

function mockEvent(origin: string, data: unknown): MessageEvent {
  return { origin, data } as MessageEvent;
}

console.log('--- isGoogleAdsLandingConversionPath ---');
for (const p of [
  '/reklam/pr-gorunurluk/',
  '/reklam/pr-gorunurluk',
  '/iletisim/',
  '/clinic-reklam-ajansi-performans-yonetimi',
]) {
  console.log(`  ${p} → ${isGoogleAdsLandingConversionPath(p)}`);
}

console.log('\n--- Zoho postMessage eşleşmeleri (mock) ---');

const cases: { name: string; ev: MessageEvent }[] = [
  {
    name: 'Başarılı gönderim (beklenen)',
    ev: mockEvent('https://forms.joinpr.com.tr', {
      zf_category: 'Zoho Forms',
      event: 'zf_submitform',
    }),
  },
  {
    name: 'Yanlış origin',
    ev: mockEvent('https://evil.example', {
      zf_category: 'Zoho Forms',
      event: 'zf_submitform',
    }),
  },
  {
    name: 'Yükseklik mesajı (pipe)',
    ev: mockEvent('https://forms.joinpr.com.tr', 'I50RnMGr5e2CLfOswetbEV7jdQ_N9gkidjRZUcvnfl0|1200'),
  },
  {
    name: 'zohopublic.com origin',
    ev: mockEvent('https://forms.zohopublic.com', {
      zf_category: 'Zoho Forms',
      event: 'zf_submitform',
    }),
  },
];

for (const { name, ev } of cases) {
  const match = isZohoFormSuccessfulSubmitMessage(ev);
  const ex = explainZohoMessageForConversion(ev);
  console.log(`\n${name}`);
  console.log('  isZohoFormSuccessfulSubmitMessage:', match);
  console.log('  explain:', ex.reason);
}

console.log('\nBitti. Tarayıcıda gerçek test: reklam landing + ?joinpr_ads_debug=1 ve Console.');
