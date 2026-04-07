/**
 * public/ altındaki seed mecra logolarını Supabase `haber-platform-logos` bucket köküne yükler.
 *
 * Önkoşul: docs/haber_platform_logos_bucket.sql çalıştırılmış olmalı.
 * Çalıştırma: npm run upload-haber-logos
 * Ortam: .env.local içinde NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { HABER_SEEDED_LOGO_FILES } from '../src/data/haber-platform-logos';
import { HABER_PLATFORM_LOGOS_BUCKET } from '../src/lib/haber-logo-storage';

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

  const publicDir = join(process.cwd(), 'public');
  let ok = 0;
  let skip = 0;
  let fail = 0;

  const names = Array.from(HABER_SEEDED_LOGO_FILES).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));

  for (const name of names) {
    const localPath = join(publicDir, name);
    if (!existsSync(localPath)) {
      console.warn('Dosya yok, atlanıyor:', name);
      skip += 1;
      continue;
    }
    try {
      const buf = await readFile(localPath);
      const contentType = guessContentType(name);
      const { error } = await supabase.storage.from(HABER_PLATFORM_LOGOS_BUCKET).upload(name, buf, {
        contentType,
        upsert: true,
      });
      if (error) {
        console.error('HATA', name, error.message);
        fail += 1;
      } else {
        console.log('OK', name);
        ok += 1;
      }
    } catch (e: unknown) {
      console.error('HATA', name, e);
      fail += 1;
    }
  }

  console.log(`\nÖzet: ${ok} yüklendi, ${skip} dosya yok, ${fail} hata. Bucket: ${HABER_PLATFORM_LOGOS_BUCKET}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
