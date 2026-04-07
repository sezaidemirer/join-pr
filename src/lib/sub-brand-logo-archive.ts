import { randomUUID } from 'crypto';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import path from 'path';

export type SubBrandLogoArchiveEntry = {
  path: string;
  label: string;
  uploadedAt: string;
  /** Supabase veya geçici public URL (varsa) */
  sourceUrl?: string;
};

const MANIFEST = 'manifest.json';
const ARCHIVE_ROOT = 'sub-brand-logos-archive';
const MAX_ENTRIES = 400;

function manifestAbsolutePath() {
  return path.join(process.cwd(), 'public', ARCHIVE_ROOT, MANIFEST);
}

async function appendManifest(entry: SubBrandLogoArchiveEntry) {
  const manifestPath = manifestAbsolutePath();
  let list: SubBrandLogoArchiveEntry[] = [];
  try {
    const raw = await readFile(manifestPath, 'utf8');
    const p = JSON.parse(raw) as unknown;
    if (Array.isArray(p)) list = p as SubBrandLogoArchiveEntry[];
  } catch {
    list = [];
  }
  const next = [entry, ...list.filter((e) => e && e.path !== entry.path)].slice(0, MAX_ENTRIES);
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(next, null, 2), 'utf8');
}

/**
 * `public/sub-brand-logos-archive/` altına kopyalar ve manifest.json'a ekler.
 * Salt okunur dosya sistemi (ör. Vercel) üzerinde başarısız olursa null döner.
 */
export async function appendSubBrandLogoArchive(
  buf: Buffer,
  ext: string,
  originalFilename: string,
  sourceUrl?: string
): Promise<SubBrandLogoArchiveEntry | null> {
  try {
    const safeExt = (ext || 'img').replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'img';
    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const relDir = `${ARCHIVE_ROOT}/${year}/${month}`;
    const file = `${randomUUID()}.${safeExt}`;
    const relPath = `/${relDir}/${file}`.replace(/\\/g, '/');
    const dirAbs = path.join(process.cwd(), 'public', relDir);
    await mkdir(dirAbs, { recursive: true });
    await writeFile(path.join(dirAbs, file), buf);

    const entry: SubBrandLogoArchiveEntry = {
      path: relPath,
      label: (originalFilename || file).slice(0, 200),
      uploadedAt: now.toISOString(),
      sourceUrl,
    };
    await appendManifest(entry);
    return entry;
  } catch {
    return null;
  }
}

export async function readSubBrandLogoArchiveManifest(): Promise<SubBrandLogoArchiveEntry[]> {
  try {
    const raw = await readFile(manifestAbsolutePath(), 'utf8');
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? (p as SubBrandLogoArchiveEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Manifestten kaydı çıkarır ve varsa `public/` altındaki dosyayı siler.
 * Supabase silme işlemi API katmanında `sourceUrl` ile yapılmalı.
 */
export async function removeSubBrandLogoArchiveEntry(archivePublicPath: string): Promise<{
  ok: boolean;
  error?: string;
  removed?: SubBrandLogoArchiveEntry;
}> {
  const norm = archivePublicPath.replace(/\\/g, '/').trim();
  const normalized = norm.startsWith('/') ? norm : `/${norm}`;
  const manifestPath = manifestAbsolutePath();
  let list = await readSubBrandLogoArchiveManifest();
  const idx = list.findIndex((e) => e.path === normalized || e.path === norm);
  if (idx < 0) {
    return { ok: false, error: 'Arsiv kaydi bulunamadi.' };
  }
  const [removed] = list.splice(idx, 1);
  const relFile = normalized.replace(/^\//, '');
  const fileAbs = path.join(process.cwd(), 'public', relFile);
  try {
    await unlink(fileAbs);
  } catch {
    /* yoksa sorun degil */
  }
  try {
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(manifestPath, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Manifest guncellenemedi.' };
  }
  return { ok: true, removed };
}
