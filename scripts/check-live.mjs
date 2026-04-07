/**
 * Canli www (statik) + proje (Vercel) build bilgisini yan yana yazdirir.
 * Ornek: npm run check:live
 */
const WWW_STAMP =
  process.env.CHECK_WWW_STAMP_URL?.trim() || 'https://joinpr.com.tr/build-stamp.json';
const PROJE_INFO =
  process.env.CHECK_PROJE_INFO_URL?.trim() || 'https://proje.joinpr.com.tr/api/build-info';

async function fetchJson(url, label) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text.slice(0, 200) };
    }
    return { label, url, status: res.status, ok: res.ok, body: json };
  } catch (e) {
    return { label, url, error: String(e?.message || e) };
  }
}

async function main() {
  console.log('Canli kontrol (cache kapali fetch)...\n');
  const [www, proje] = await Promise.all([
    fetchJson(WWW_STAMP, 'www statik (build-stamp)'),
    fetchJson(PROJE_INFO, 'proje Vercel (build-info)'),
  ]);
  console.log(JSON.stringify({ www, proje }, null, 2));
  console.log(
    '\nwww builtAt / proje deployedAt ayni gun degilse veya proje gitSha bekledigin commit degilse: yanlis yere deploy veya eski build yuklu demektir.'
  );
}

main();
