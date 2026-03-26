import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { absolutizePublicAssetPath } from '@/lib/news-api';
import { normalizeSlugPart } from '@/lib/slug';

export type NewsPlatformLink = {
  href: string;
  image: string;
  label: string;
};

export type NewsRecord = {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  category: string | null;
  category_en: string | null;
  description: string;
  description_en: string | null;
  image: string | null;
  platform_links: NewsPlatformLink[] | null;
  platform_links_en: NewsPlatformLink[] | null;
  is_published: boolean;
  noindex: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/** Tabloda `noindex` yok, yerine `is_index` varsa Vercel .env: SUPABASE_JOIN_POSTS_USE_IS_INDEX=1 */
function joinPostsWritesIsIndexColumn(): boolean {
  const v = process.env.SUPABASE_JOIN_POSTS_USE_IS_INDEX;
  return v === '1' || v === 'true';
}

/** DB: is_index true = arama indeksine acik, noindex false ile ayni anlam. */
function deriveNoindex(row: NewsRecord & { is_index?: boolean | null }): boolean {
  if (typeof row.noindex === 'boolean') return row.noindex;
  if (typeof row.is_index === 'boolean') return !row.is_index;
  return false;
}

function indexFieldsForWrite(noindex: boolean): Record<string, boolean> {
  if (joinPostsWritesIsIndexColumn()) {
    return { is_index: !noindex };
  }
  return { noindex };
}

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function assertAdminClient() {
  const supabase = getAdminClient();
  if (supabase) return supabase;

  const missing: string[] = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  throw new Error(`Supabase admin client unavailable. Missing env: ${missing.join(', ')}`);
}

const FALLBACK_PLATFORM_LINK_IMAGE = '/join_pr_logo_offical2.png';

/** DB: href/url, label/title/name, image/img; gorsel yoksa tek link gosterimi icin fallback. */
function parsePlatformLinksFromDb(input: unknown): NewsPlatformLink[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const parsed = input
    .map((item) => {
      const rec = item as Record<string, unknown>;
      const href = String(rec.href || rec.url || '').trim();
      const label = String(rec.label || rec.title || rec.name || '').trim();
      const rawImg = rec.image || rec.img || rec.icon || rec.thumbnail || '';
      let image = absolutizePublicAssetPath(String(rawImg)).trim();
      if (!image && href && label) {
        image = FALLBACK_PLATFORM_LINK_IMAGE;
      }
      return { href, image, label };
    })
    .filter((x) => x.href && x.image && x.label);
  return parsed.length ? parsed : null;
}

function coerceNewsRow(row: NewsRecord & { is_index?: boolean | null }): NewsRecord {
  const { is_index: _drop, ...rest } = row as NewsRecord & { is_index?: boolean | null };
  return {
    ...(rest as NewsRecord),
    noindex: deriveNoindex(row),
    platform_links: parsePlatformLinksFromDb(row.platform_links),
    platform_links_en: parsePlatformLinksFromDb((row as any).platform_links_en),
  };
}

function normalizePlatformLinks(input: unknown): NewsPlatformLink[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const rec = item as Record<string, unknown>;
      const href = String(rec.href || rec.url || '').trim();
      const label = String(rec.label || rec.title || rec.name || '').trim();
      const rawImg = rec.image || rec.img || rec.icon || rec.thumbnail || '';
      let image = absolutizePublicAssetPath(String(rawImg)).trim();
      if (!image && href && label) {
        image = FALLBACK_PLATFORM_LINK_IMAGE;
      }
      return { href, image, label };
    })
    .filter((x) => x.href && x.image && x.label);
}

export async function listPublishedNews() {
  noStore();
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('join_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return ((data ?? []) as NewsRecord[]).map(coerceNewsRow);
}

export async function listAllNews() {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('join_posts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return ((data ?? []) as NewsRecord[]).map(coerceNewsRow);
}

export async function getPublishedNewsBySlug(slug: string) {
  noStore();
  const supabase = assertAdminClient();
  const normalized = normalizeSlugPart(slug);
  const { data, error } = await supabase
    .from('join_posts')
    .select('*')
    .eq('slug', normalized)
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  const row = (data ?? null) as NewsRecord | null;
  return row ? coerceNewsRow(row) : null;
}

export async function createNews(input: {
  title: string;
  titleEn?: string;
  slug?: string;
  category?: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  image?: string;
  platformLinks?: NewsPlatformLink[];
  platformLinksEn?: NewsPlatformLink[];
  isPublished?: boolean;
  noindex?: boolean;
  publishedAt?: string;
}) {
  const supabase = assertAdminClient();
  const title = input.title.trim();
  const slug = normalizeSlugPart((input.slug || input.title).trim());
  const noindexVal = input.noindex === true;
  const payload = {
    title,
    title_en: input.titleEn?.trim() || null,
    slug,
    category: input.category?.trim() || null,
    category_en: input.categoryEn?.trim() || null,
    description: input.description.trim(),
    description_en: input.descriptionEn?.trim() || null,
    image: (() => {
      const img = absolutizePublicAssetPath(input.image || '').trim();
      return img || null;
    })(),
    platform_links: normalizePlatformLinks(input.platformLinks),
    platform_links_en: normalizePlatformLinks(input.platformLinksEn),
    is_published: input.isPublished !== false,
    ...indexFieldsForWrite(noindexVal),
    published_at: input.publishedAt?.trim() || new Date().toISOString(),
  };

  const { data, error } = await supabase.from('join_posts').insert(payload).select('*').single();
  if (error) throw error;
  return coerceNewsRow(data as NewsRecord);
}

export async function updateNews(
  id: string,
  input: {
    title: string;
    titleEn?: string;
    slug?: string;
    category?: string;
    categoryEn?: string;
    description: string;
    descriptionEn?: string;
    image?: string;
    platformLinks?: NewsPlatformLink[];
    platformLinksEn?: NewsPlatformLink[];
    isPublished?: boolean;
    noindex?: boolean;
    publishedAt?: string;
  }
) {
  const supabase = assertAdminClient();
  const title = input.title.trim();
  const slug = normalizeSlugPart((input.slug || input.title).trim());
  const noindexVal = input.noindex === true;
  const payload = {
    title,
    title_en: input.titleEn?.trim() || null,
    slug,
    category: input.category?.trim() || null,
    category_en: input.categoryEn?.trim() || null,
    description: input.description.trim(),
    description_en: input.descriptionEn?.trim() || null,
    image: (() => {
      const img = absolutizePublicAssetPath(input.image || '').trim();
      return img || null;
    })(),
    platform_links: normalizePlatformLinks(input.platformLinks),
    platform_links_en: normalizePlatformLinks(input.platformLinksEn),
    is_published: input.isPublished !== false,
    ...indexFieldsForWrite(noindexVal),
    published_at: input.publishedAt?.trim() || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('join_posts')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return coerceNewsRow(data as NewsRecord);
}

export async function deleteNews(id: string) {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('join_posts')
    .delete()
    .eq('id', id)
    .select('slug')
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as { slug?: string } | null;
}
