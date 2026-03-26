import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { normalizeSlugPart } from '@/lib/slug';

export type NewsPlatformLink = {
  href: string;
  image: string;
  label: string;
};

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string;
  image: string | null;
  platform_links: NewsPlatformLink[] | null;
  is_published: boolean;
  noindex: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

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

function normalizePlatformLinks(input: unknown): NewsPlatformLink[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const rec = item as Partial<NewsPlatformLink>;
      return {
        href: (rec.href || '').trim(),
        image: (rec.image || '').trim(),
        label: (rec.label || '').trim(),
      };
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
  return (data ?? []) as NewsRecord[];
}

export async function listAllNews() {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('join_posts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as NewsRecord[];
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
  return (data ?? null) as NewsRecord | null;
}

export async function createNews(input: {
  title: string;
  slug?: string;
  category?: string;
  description: string;
  image?: string;
  platformLinks?: NewsPlatformLink[];
  isPublished?: boolean;
  noindex?: boolean;
  publishedAt?: string;
}) {
  const supabase = assertAdminClient();
  const title = input.title.trim();
  const slug = normalizeSlugPart((input.slug || input.title).trim());
  const payload = {
    title,
    slug,
    category: input.category?.trim() || null,
    description: input.description.trim(),
    image: input.image?.trim() || null,
    platform_links: normalizePlatformLinks(input.platformLinks),
    is_published: input.isPublished !== false,
    noindex: input.noindex === true,
    published_at: input.publishedAt?.trim() || new Date().toISOString(),
  };

  const { data, error } = await supabase.from('join_posts').insert(payload).select('*').single();
  if (error) throw error;
  return data as NewsRecord;
}

export async function updateNews(
  id: string,
  input: {
    title: string;
    slug?: string;
    category?: string;
    description: string;
    image?: string;
    platformLinks?: NewsPlatformLink[];
    isPublished?: boolean;
    noindex?: boolean;
    publishedAt?: string;
  }
) {
  const supabase = assertAdminClient();
  const title = input.title.trim();
  const slug = normalizeSlugPart((input.slug || input.title).trim());
  const payload = {
    title,
    slug,
    category: input.category?.trim() || null,
    description: input.description.trim(),
    image: input.image?.trim() || null,
    platform_links: normalizePlatformLinks(input.platformLinks),
    is_published: input.isPublished !== false,
    noindex: input.noindex === true,
    published_at: input.publishedAt?.trim() || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('join_posts')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as NewsRecord;
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
