import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { absolutizePublicAssetPath } from '@/lib/news-api';
import { normalizeSlugPart } from '@/lib/slug';

export type BlogRecord = {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  category: string | null;
  category_en: string | null;
  description: string;
  description_en: string | null;
  content: string;
  content_en: string | null;
  image: string | null;
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

function coerceBlogRow(row: BlogRecord): BlogRecord {
  return {
    ...row,
    image: absolutizePublicAssetPath(row.image) || null,
  };
}

export type BlogInput = {
  title: string;
  titleEn?: string;
  slug?: string;
  category?: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  content: string;
  contentEn?: string;
  image?: string;
  isPublished?: boolean;
  noindex?: boolean;
  publishedAt?: string;
};

function buildPayload(input: BlogInput) {
  return {
    title: input.title.trim(),
    title_en: input.titleEn?.trim() || null,
    slug: normalizeSlugPart((input.slug || input.title).trim()),
    category: input.category?.trim() || null,
    category_en: input.categoryEn?.trim() || null,
    description: input.description.trim(),
    description_en: input.descriptionEn?.trim() || null,
    content: input.content.trim(),
    content_en: input.contentEn?.trim() || null,
    image: (() => {
      const img = absolutizePublicAssetPath(input.image || '').trim();
      return img || null;
    })(),
    is_published: input.isPublished !== false,
    noindex: input.noindex === true,
    published_at: input.publishedAt?.trim() || new Date().toISOString(),
  };
}

export async function listPublishedBlogPosts() {
  noStore();
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return ((data ?? []) as BlogRecord[]).map(coerceBlogRow);
}

export async function listAllBlogPosts() {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return ((data ?? []) as BlogRecord[]).map(coerceBlogRow);
}

export async function getPublishedBlogBySlug(slug: string) {
  noStore();
  const supabase = assertAdminClient();
  const normalized = normalizeSlugPart(slug);
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', normalized)
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  const row = (data ?? null) as BlogRecord | null;
  return row ? coerceBlogRow(row) : null;
}

export async function createBlogPost(input: BlogInput) {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(buildPayload(input))
    .select('*')
    .single();
  if (error) throw error;
  return coerceBlogRow(data as BlogRecord);
}

export async function updateBlogPost(id: string, input: BlogInput) {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .update(buildPayload(input))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return coerceBlogRow(data as BlogRecord);
}

export async function deleteBlogPost(id: string) {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
    .select('slug')
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as { slug?: string } | null;
}
