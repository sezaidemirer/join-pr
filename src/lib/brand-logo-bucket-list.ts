import { createClient } from '@supabase/supabase-js';
import path from 'path';

import { BRAND_LOGO_BUCKET } from '@/lib/brand-logo-storage';

const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif']);

/** Storage list yanıtında gerçek dosya satırı (klasör satırlarında genelde metadata yok). */
function isStorageFileRow(item: { name: string; metadata?: Record<string, unknown> | null }): boolean {
  const m = item.metadata;
  if (!m || typeof m !== 'object') return false;
  const size = (m as { size?: unknown }).size;
  return typeof size === 'number';
}

/**
 * `brand-logo` bucket içinde `uploads/` altındaki görselleri özyinelemeli listeler.
 * Public URL + seçim etiketi (obje yolu) döner.
 */
export async function listBrandLogoUploadsPublic(): Promise<Array<{ url: string; label: string; objectPath: string }>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) return [];

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const objectPaths: string[] = [];

  /** Aynı seviyedeki alt klasörleri sırayla değil partiler halinde paralel tarar (galeri açılış gecikmesini azaltır). */
  const SUBDIR_LIST_CONCURRENCY = 12;

  async function walk(prefix: string): Promise<void> {
    let offset = 0;
    const limit = 1000;
    for (;;) {
      const { data, error } = await supabase.storage.from(BRAND_LOGO_BUCKET).list(prefix, {
        limit,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (error || !data?.length) break;

      const subdirs: string[] = [];
      for (const item of data) {
        if (item.name.startsWith('.')) continue;
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

        if (isStorageFileRow(item)) {
          const ext = path.extname(item.name).toLowerCase();
          if (ALLOWED_EXT.has(ext)) {
            objectPaths.push(fullPath);
          }
        } else {
          subdirs.push(fullPath);
        }
      }

      for (let i = 0; i < subdirs.length; i += SUBDIR_LIST_CONCURRENCY) {
        const chunk = subdirs.slice(i, i + SUBDIR_LIST_CONCURRENCY);
        await Promise.all(chunk.map((p) => walk(p)));
      }

      if (data.length < limit) break;
      offset += limit;
    }
  }

  try {
    await walk('uploads');
  } catch {
    return [];
  }

  const out: Array<{ url: string; label: string; objectPath: string }> = [];
  for (const objectPath of objectPaths.sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }))) {
    const { data } = supabase.storage.from(BRAND_LOGO_BUCKET).getPublicUrl(objectPath);
    const url = data?.publicUrl;
    if (!url) continue;
    out.push({
      objectPath,
      url,
      label: objectPath.replace(/^uploads\/?/, '') || objectPath,
    });
  }

  return out;
}
