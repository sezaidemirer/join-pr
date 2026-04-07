import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const stashDir = join(root, '.cpanel-build-stash');
const apiFrom = join(root, 'src', 'app', 'api');
const apiStashed = join(stashDir, 'api');
const adminFrom = join(root, 'src', 'app', 'admin');
const adminStashed = join(stashDir, 'admin');
const mwFrom = join(root, 'middleware.ts');
const mwStashed = join(stashDir, 'middleware.ts');
const robotsFrom = join(root, 'src', 'app', 'robots.ts');
const robotsStashed = join(stashDir, 'robots.ts');
const sitemapFrom = join(root, 'src', 'app', 'sitemap.ts');
const sitemapStashed = join(stashDir, 'sitemap.ts');
const distExportFrom = join(root, '.next-static-export');
const outDir = join(root, 'out');
const outBackupDir = join(root, `.out-backup-${Date.now()}`);
const projeGaleriFrom = join(root, 'public', 'proje-galeri');
const projeGaleriStashed = join(stashDir, 'proje-galeri');

function stash() {
  if (!existsSync(stashDir)) mkdirSync(stashDir, { recursive: true });
  if (existsSync(apiFrom)) {
    if (existsSync(apiStashed)) {
      console.error(
        '[build:cpanel] .cpanel-build-stash/api zaten var; onceki build yarım kalmis olabilir. Klasoru silip tekrar deneyin.'
      );
      process.exit(1);
    }
    renameSync(apiFrom, apiStashed);
  }
  if (existsSync(adminFrom)) {
    if (existsSync(adminStashed)) {
      console.error(
        '[build:cpanel] .cpanel-build-stash/admin zaten var; onceki build yarım kalmis olabilir. Klasoru silip tekrar deneyin.'
      );
      process.exit(1);
    }
    renameSync(adminFrom, adminStashed);
  }
  if (existsSync(mwFrom)) {
    if (existsSync(mwStashed)) {
      console.error('[build:cpanel] .cpanel-build-stash/middleware.ts zaten var.');
      process.exit(1);
    }
    renameSync(mwFrom, mwStashed);
  }
  if (existsSync(robotsFrom)) {
    if (existsSync(robotsStashed)) {
      console.error('[build:cpanel] .cpanel-build-stash/robots.ts zaten var.');
      process.exit(1);
    }
    renameSync(robotsFrom, robotsStashed);
  }
  if (existsSync(sitemapFrom)) {
    if (existsSync(sitemapStashed)) {
      console.error('[build:cpanel] .cpanel-build-stash/sitemap.ts zaten var.');
      process.exit(1);
    }
    renameSync(sitemapFrom, sitemapStashed);
  }
  if (existsSync(projeGaleriFrom)) {
    if (existsSync(projeGaleriStashed)) {
      console.error(
        '[build:cpanel] .cpanel-build-stash/proje-galeri zaten var; onceki build yarım kalmis olabilir.'
      );
      process.exit(1);
    }
    renameSync(projeGaleriFrom, projeGaleriStashed);
  }
}

function restore() {
  if (existsSync(apiStashed) && !existsSync(apiFrom)) {
    renameSync(apiStashed, apiFrom);
  }
  if (existsSync(adminStashed) && !existsSync(adminFrom)) {
    renameSync(adminStashed, adminFrom);
  }
  if (existsSync(mwStashed) && !existsSync(mwFrom)) {
    renameSync(mwStashed, mwFrom);
  }
  if (existsSync(robotsStashed) && !existsSync(robotsFrom)) {
    renameSync(robotsStashed, robotsFrom);
  }
  if (existsSync(sitemapStashed) && !existsSync(sitemapFrom)) {
    renameSync(sitemapStashed, sitemapFrom);
  }
  if (existsSync(projeGaleriStashed) && !existsSync(projeGaleriFrom)) {
    renameSync(projeGaleriStashed, projeGaleriFrom);
  }
}

/** cPanel statik site joinpr.com.tr; haber API Vercel'de. Bos birakilirsa asagidakiler kullanilir. */
const cpanelNewsApi =
  process.env.NEXT_PUBLIC_NEWS_API_ORIGIN?.trim() || 'https://proje.joinpr.com.tr';
const cpanelAssetOrigin =
  process.env.NEXT_PUBLIC_ASSET_ORIGIN?.trim() || 'https://joinpr.com.tr';

function resolveMediaTreeFromApi(base) {
  const root = String(base || '').replace(/\/$/, '');
  if (!root) return null;
  const url = `${root}/api/media-reports/tree/`;
  const res = spawnSync('curl', ['-sL', url], { encoding: 'utf8' });
  if ((res.status ?? 1) !== 0) return null;
  try {
    const json = JSON.parse(String(res.stdout || '{}'));
    const brands = Array.isArray(json?.brands) ? json.brands : [];
    const compact = brands
      .map((b) => ({
        slug: String(b?.slug || '').trim(),
        projects: Array.isArray(b?.projects)
          ? b.projects
              .map((p) => ({ slug: String(p?.slug || '').trim() }))
              .filter((p) => p.slug)
          : [],
      }))
      .filter((b) => b.slug);
    return compact.length ? compact : null;
  } catch {
    return null;
  }
}

stash();
let code = 1;
try {
  // Onceki yarim/static export ciktilari route modul uyumsuzluguna neden olabiliyor.
  if (existsSync(distExportFrom)) {
    rmSync(distExportFrom, { recursive: true, force: true });
  }
  console.log('[build:cpanel] NEXT_PUBLIC_NEWS_API_ORIGIN =', cpanelNewsApi);
  console.log('[build:cpanel] NEXT_PUBLIC_ASSET_ORIGIN =', cpanelAssetOrigin);
  const mediaTree = resolveMediaTreeFromApi(cpanelNewsApi);
  if (mediaTree?.length) {
    console.log(`[build:cpanel] Medya statik param kaynak sayisi: ${mediaTree.length}`);
  } else {
    console.log('[build:cpanel] Medya statik param API verisi alinamadi; fallback listeler kullanilacak.');
  }
  const res = spawnSync(process.execPath, [join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      STATIC_EXPORT: '1',
      NEXT_PUBLIC_NEWS_API_ORIGIN: cpanelNewsApi,
      NEXT_PUBLIC_ASSET_ORIGIN: cpanelAssetOrigin,
      CPANEL_MEDIA_TREE_JSON: mediaTree ? JSON.stringify(mediaTree) : '',
    },
  });
  code = res.status ?? 1;
} finally {
  restore();
}

if (code === 0) {
  // next.config'de distDir kullanildiginda static export bu klasore yazilir; cPanel icin tekrar out/ bekleniyor.
  if (existsSync(distExportFrom)) {
    if (existsSync(outDir)) {
      // Node 22'de rmSync bazen ENOTEMPTY rmdir hatasi verebiliyor.
      // Once mevcut out/ klasorunu yedek isimle tasiyip yeni ciktiyi yerine aliyoruz.
      renameSync(outDir, outBackupDir);
    }
    renameSync(distExportFrom, outDir);
    if (existsSync(outBackupDir)) {
      try {
        rmSync(outBackupDir, { recursive: true, force: true });
      } catch (err) {
        console.warn(
          `[build:cpanel] Uyari: eski out yedegi silinemedi (${outBackupDir}). Elle silebilirsiniz.`
        );
      }
    }
    const stamp = {
      kind: 'cpanel-static',
      builtAt: new Date().toISOString(),
      newsApiOrigin: cpanelNewsApi,
      assetOrigin: cpanelAssetOrigin,
      label: process.env.BUILD_STAMP_LABEL?.trim() || '',
    };
    writeFileSync(join(outDir, 'build-stamp.json'), `${JSON.stringify(stamp, null, 2)}\n`, 'utf8');
    console.log('[build:cpanel] build-stamp.json yazildi -> out/build-stamp.json (canli kontrol icin).');
  }
  console.log('\n[build:cpanel] Tamam. `out/` klasorunu public_html icine yukleyin (Node gerekmez).');
  console.log(
    '[build:cpanel] Not: /proje/... sayfalari build sirasinda Supabase (.env) ile listelenen teklifler kadar uretilir; DB bos/erisilemezse tek sahte path 404 olur, build yine biter.'
  );
  console.log('[build:cpanel] Admin ve tum /api/* bu statik pakette calismaz; iletisim formu vb. icin Node veya harici backend gerekir.');
  console.log('[build:cpanel] CMS haberleri /haber/{slug} icin `public/.htaccess` -> `out/.htaccess` yukleyin (mod_rewrite).');
}
process.exit(code);
