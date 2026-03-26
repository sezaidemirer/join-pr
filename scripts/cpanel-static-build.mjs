import { spawnSync } from 'child_process';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const stashDir = join(root, '.cpanel-build-stash');
const apiFrom = join(root, 'src', 'app', 'api');
const apiStashed = join(stashDir, 'api');
const mwFrom = join(root, 'middleware.ts');
const mwStashed = join(stashDir, 'middleware.ts');

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
  if (existsSync(mwFrom)) {
    if (existsSync(mwStashed)) {
      console.error('[build:cpanel] .cpanel-build-stash/middleware.ts zaten var.');
      process.exit(1);
    }
    renameSync(mwFrom, mwStashed);
  }
}

function restore() {
  if (existsSync(apiStashed) && !existsSync(apiFrom)) {
    renameSync(apiStashed, apiFrom);
  }
  if (existsSync(mwStashed) && !existsSync(mwFrom)) {
    renameSync(mwStashed, mwFrom);
  }
}

/** cPanel statik site joinpr.com.tr; haber API Vercel'de. Bos birakilirsa asagidakiler kullanilir. */
const cpanelNewsApi =
  process.env.NEXT_PUBLIC_NEWS_API_ORIGIN?.trim() || 'https://proje.joinpr.com.tr';
const cpanelAssetOrigin =
  process.env.NEXT_PUBLIC_ASSET_ORIGIN?.trim() || 'https://joinpr.com.tr';

stash();
let code = 1;
try {
  console.log('[build:cpanel] NEXT_PUBLIC_NEWS_API_ORIGIN =', cpanelNewsApi);
  console.log('[build:cpanel] NEXT_PUBLIC_ASSET_ORIGIN =', cpanelAssetOrigin);
  const res = spawnSync(process.execPath, [join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      STATIC_EXPORT: '1',
      NEXT_PUBLIC_NEWS_API_ORIGIN: cpanelNewsApi,
      NEXT_PUBLIC_ASSET_ORIGIN: cpanelAssetOrigin,
    },
  });
  code = res.status ?? 1;
} finally {
  restore();
}

if (code === 0) {
  console.log('\n[build:cpanel] Tamam. `out/` klasorunu public_html icine yukleyin (Node gerekmez).');
  console.log(
    '[build:cpanel] Not: /proje/... sayfalari build sirasinda Supabase (.env) ile listelenen teklifler kadar uretilir; DB bos/erisilemezse tek sahte path 404 olur, build yine biter.'
  );
  console.log('[build:cpanel] Admin ve tum /api/* bu statik pakette calismaz; iletisim formu vb. icin Node veya harici backend gerekir.');
  console.log('[build:cpanel] CMS haberleri /haber/{slug} icin `public/.htaccess` -> `out/.htaccess` yukleyin (mod_rewrite).');
}
process.exit(code);
