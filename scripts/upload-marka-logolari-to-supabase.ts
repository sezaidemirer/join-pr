/**
 * public/marka-logolari/ içindeki marka logolarını Supabase Storage `brand-logo` bucket'ına yükler.
 * Obje yolu: uploads/marka-logolari/<dosya-adı> (bucket içinde uploads klasörü altında kalır).
 *
 * Önkoşul: Supabase'te `brand-logo` bucket'ı oluşturulmuş ve policy'ler uygun olmalı.
 * Çalıştırma: npm run upload-marka-logolari
 * Ortam: .env.local içinde NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
import { readFile, readdir } from 'fs/promises';
import { extname, join } from 'path';

import { BRAND_LOGO_BUCKET } from '../src/lib/brand-logo-storage';

const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif']);

function loadEnvFiles() {
  const root = join(process.cwd());
  for (const name of ['.env.local', '.env']) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, 'utf8');
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

function guessContentType(name: string): string {
  const n = name.toLowerCase();
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.webp')) return 'image/webp';
  if (n.endsWith('.svg')) return 'image/svg+xml';
  if (n.endsWith('.gif')) return 'image/gif';
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
  if (n.endsWith('.avif')) return 'image/avif';
  return 'application/octet-stream';
}

async function main() {
  loadEnvFiles();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) {
    console.error('Eksik: NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY (.env.local)');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const dir = join(process.cwd(), 'public', 'marka-logolari');
  if (!existsSync(dir)) {
    console.error('Klasör yok:', dir);
    process.exit(1);
  }

  const names = (await readdir(dir))
    .filter((n) => !n.startsWith('.') && ALLOWED_EXT.has(extname(n).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));

  let ok = 0;
  let fail = 0;

  for (const name of names) {
    const localPath = join(dir, name);
    const objectPath = `uploads/marka-logolari/${name}`;

    try {
      const buf = await readFile(localPath);
      const contentType = guessContentType(name);
      const { error } = await supabase.storage.from(BRAND_LOGO_BUCKET).upload(objectPath, buf, {
        contentType,
        upsert: true,
      });
      if (error) {
        console.error('HATA', objectPath, error.message);
        fail += 1;
      } else {
        const { data } = supabase.storage.from(BRAND_LOGO_BUCKET).getPublicUrl(objectPath);
        console.log('OK', objectPath, data?.publicUrl ? `→ ${data.publicUrl}` : '');
        ok += 1;
      }
    } catch (e: unknown) {
      console.error('HATA', name, e);
      fail += 1;
    }
  }

  console.log(`\nÖzet: ${ok} yüklendi, ${fail} hata. Bucket: ${BRAND_LOGO_BUCKET}, prefix: uploads/marka-logolari/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
