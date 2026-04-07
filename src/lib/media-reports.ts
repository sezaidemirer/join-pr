import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { normalizeSlugPart } from '@/lib/slug';

export type MediaReportBrandRecord = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_published: boolean;
  /** false: alt marka yok; `media_report_sub_brands` satırları doğrudan marka altı rapor/bülten olarak kullanılır. */
  uses_sub_brands?: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaReportSubBrandRecord = {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  pdf_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaReportProject = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  pdfUrl: string;
  updatedAt: string;
};

export type MediaReportBrand = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  projects: MediaReportProject[];
};

/** Tek bir alt markaya (Rixos Radamis gibi) ait birden fazla rapor girişi. */
export type MediaReportEntryRecord = {
  id: string;
  sub_brand_id: string;
  title: string;
  slug: string;
  pdf_url: string;
  report_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const BRANDS_TABLE = 'media_report_brands';
const SUB_BRANDS_TABLE = 'media_report_sub_brands';
const ENTRIES_TABLE = 'media_report_entries';

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

export async function listMediaReportBrandsForAdmin() {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from(BRANDS_TABLE)
    .select('*')
    .order('name', { ascending: true })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as MediaReportBrandRecord[];
}

export async function createMediaReportBrand(input: {
  name: string;
  logoUrl?: string;
  isPublished?: boolean;
  /** Varsayılan true. false ise marka altında yalnızca rapor/bülten (alt marka adı yok). */
  usesSubBrands?: boolean;
}) {
  const supabase = assertAdminClient();
  const name = input.name.trim();
  if (!name) throw new Error('Marka adi zorunludur.');
  const payload = {
    name,
    slug: normalizeSlugPart(name),
    logo_url: (input.logoUrl || '').trim() || null,
    is_published: input.isPublished !== false,
    uses_sub_brands: input.usesSubBrands !== false,
  };
  const { data, error } = await supabase.from(BRANDS_TABLE).insert(payload).select('*').single();
  if (error) throw error;
  return data as MediaReportBrandRecord;
}

export async function updateMediaReportBrand(
  id: string,
  input: {
    name: string;
    logoUrl?: string;
    isPublished?: boolean;
    usesSubBrands?: boolean;
  }
) {
  const supabase = assertAdminClient();
  const name = input.name.trim();
  if (!name) throw new Error('Marka adi zorunludur.');
  const payload = {
    name,
    slug: normalizeSlugPart(name),
    logo_url: (input.logoUrl || '').trim() || null,
    is_published: input.isPublished !== false,
    ...(typeof input.usesSubBrands === 'boolean' ? { uses_sub_brands: input.usesSubBrands } : {}),
  };
  const { data, error } = await supabase.from(BRANDS_TABLE).update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return data as MediaReportBrandRecord;
}

export async function deleteMediaReportBrand(id: string) {
  const supabase = assertAdminClient();
  const { error } = await supabase.from(BRANDS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function listMediaReportSubBrandsForAdmin(brandId: string) {
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from(SUB_BRANDS_TABLE)
    .select('*')
    .eq('brand_id', brandId)
    .order('name', { ascending: true })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as MediaReportSubBrandRecord[];
}

export async function createMediaReportSubBrand(input: {
  brandId: string;
  name: string;
  logoUrl?: string;
  pdfUrl?: string;
  isPublished?: boolean;
}) {
  const supabase = assertAdminClient();
  const brandId = input.brandId.trim();
  const name = input.name.trim();
  const pdfUrl = (input.pdfUrl || '').trim();
  if (!brandId || !name) {
    throw new Error('brandId ve name zorunludur.');
  }

  const payload = {
    brand_id: brandId,
    name,
    slug: normalizeSlugPart(name),
    logo_url: (input.logoUrl || '').trim() || null,
    pdf_url: pdfUrl || null,
    is_published: input.isPublished !== false,
  };
  const { data, error } = await supabase.from(SUB_BRANDS_TABLE).insert(payload).select('*').single();
  if (error) throw error;
  return data as MediaReportSubBrandRecord;
}

export async function updateMediaReportSubBrand(
  id: string,
  input: {
    name: string;
    logoUrl?: string;
    pdfUrl?: string;
    isPublished?: boolean;
  }
) {
  const supabase = assertAdminClient();
  const name = input.name.trim();
  const pdfUrl = (input.pdfUrl || '').trim();
  if (!name) {
    throw new Error('name zorunludur.');
  }

  const payload = {
    name,
    slug: normalizeSlugPart(name),
    logo_url: (input.logoUrl || '').trim() || null,
    pdf_url: pdfUrl || null,
    is_published: input.isPublished !== false,
  };
  const { data, error } = await supabase
    .from(SUB_BRANDS_TABLE)
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as MediaReportSubBrandRecord;
}

export async function deleteMediaReportSubBrand(id: string) {
  const supabase = assertAdminClient();
  const { error } = await supabase.from(SUB_BRANDS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

/** Galeri: daha önce marka / alt marka kayıtlarında kullanılmış benzersiz logo URL'leri. */
export async function listDistinctMediaReportLogosForAdmin(): Promise<Array<{ url: string; label: string }>> {
  const supabase = assertAdminClient();
  const [subsRes, brandsRes] = await Promise.all([
    supabase.from(SUB_BRANDS_TABLE).select('logo_url, name').not('logo_url', 'is', null).limit(2000),
    supabase.from(BRANDS_TABLE).select('logo_url, name').not('logo_url', 'is', null).limit(2000),
  ]);
  if (subsRes.error) throw subsRes.error;
  if (brandsRes.error) throw brandsRes.error;

  const map = new Map<string, string>();
  const push = (url: string, label: string) => {
    const u = url.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u) && !u.startsWith('/')) return;
    if (!map.has(u)) map.set(u, (label || '').trim() || u.split('/').pop() || u);
  };

  for (const r of subsRes.data || []) {
    const row = r as { logo_url?: string | null; name?: string | null };
    if (row.logo_url) push(row.logo_url, row.name || '');
  }
  for (const r of brandsRes.data || []) {
    const row = r as { logo_url?: string | null; name?: string | null };
    if (row.logo_url) push(row.logo_url, row.name || '');
  }

  return Array.from(map.entries()).map(([url, label]) => ({ url, label }));
}

export async function listPublishedMediaReportTree() {
  noStore();
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from(BRANDS_TABLE)
    .select(
      `
      id,
      name,
      slug,
      logo_url,
      is_published,
      uses_sub_brands,
      subBrands:${SUB_BRANDS_TABLE}(
        id,
        name,
        slug,
        logo_url,
        pdf_url,
        is_published,
        updated_at
      )
    `
    )
    .eq('is_published', true)
    .order('name', { ascending: true })
    .limit(1000);
  if (error) throw error;
  const rows = (data ?? []) as Array<
    MediaReportBrandRecord & {
      subBrands?: Array<{
        id: string;
        name: string;
        slug: string;
        logo_url: string | null;
        pdf_url: string;
        is_published: boolean;
        updated_at: string;
      }>;
    }
  >;
  return rows.map((brand) => ({
    id: brand.id,
    slug: normalizeSlugPart(brand.slug || brand.name),
    name: brand.name,
    logoUrl: brand.logo_url || null,
    projects: (brand.subBrands || [])
      .filter((x) => x.is_published)
      .map((x) => ({
        id: x.id,
        slug: normalizeSlugPart(x.slug || x.name),
        name: x.name,
        logoUrl:
          brand.uses_sub_brands === false
            ? x.logo_url || brand.logo_url || null
            : x.logo_url || null,
        pdfUrl: x.pdf_url,
        updatedAt: x.updated_at,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr')),
  }));
}

export async function getPublishedMediaReportBySlugs(brandSlug: string, subBrandSlug: string) {
  noStore();
  const supabase = assertAdminClient();
  const normalizedBrand = normalizeSlugPart(brandSlug);
  const normalizedSubBrand = normalizeSlugPart(subBrandSlug);

  const { data: brandData, error: brandError } = await supabase
    .from(BRANDS_TABLE)
    .select('*')
    .eq('is_published', true)
    .eq('slug', normalizedBrand)
    .limit(1)
    .maybeSingle();
  if (brandError) throw brandError;
  const brand = (brandData ?? null) as MediaReportBrandRecord | null;
  if (!brand) return null;

  const { data, error } = await supabase
    .from(SUB_BRANDS_TABLE)
    .select('*')
    .eq('brand_id', brand.id)
    .eq('is_published', true)
    .eq('slug', normalizedSubBrand)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  const subBrand = (data ?? null) as MediaReportSubBrandRecord | null;
  if (!subBrand) return null;
  const reportUsesBrandLogo = brand.uses_sub_brands === false;
  const subLogo = reportUsesBrandLogo
    ? subBrand.logo_url || brand.logo_url || null
    : subBrand.logo_url || null;
  return {
    brand_id: brand.id,
    brand_name: brand.name,
    brand_slug: brand.slug,
    brand_logo_url: brand.logo_url,
    sub_brand_id: subBrand.id,
    sub_brand_name: subBrand.name,
    sub_brand_slug: subBrand.slug,
    sub_brand_logo_url: subLogo,
    pdf_url: subBrand.pdf_url,
    updated_at: subBrand.updated_at,
  };
}

// ─── media_report_entries (çok rapor / sub-brand) ─────────────────────────────

export async function listEntriesForSubBrand(subBrandId: string): Promise<MediaReportEntryRecord[]> {
  noStore();
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from(ENTRIES_TABLE)
    .select('*')
    .eq('sub_brand_id', subBrandId)
    .order('report_date', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as MediaReportEntryRecord[];
}

export async function listPublishedEntriesForSubBrand(subBrandId: string): Promise<MediaReportEntryRecord[]> {
  noStore();
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from(ENTRIES_TABLE)
    .select('*')
    .eq('sub_brand_id', subBrandId)
    .eq('is_published', true)
    .order('report_date', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []) as MediaReportEntryRecord[];
}

/** Başlıktan benzersiz slug üretir; aynı sub_brand içinde çakışırsa -2, -3 ekler. */
async function generateUniqueEntrySlug(supabase: ReturnType<typeof assertAdminClient>, subBrandId: string, title: string): Promise<string> {
  const base = normalizeSlugPart(title);
  let candidate = base;
  let counter = 2;
  for (;;) {
    const { data } = await supabase
      .from(ENTRIES_TABLE)
      .select('id')
      .eq('sub_brand_id', subBrandId)
      .eq('slug', candidate)
      .limit(1)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

export async function createMediaReportEntry(input: {
  subBrandId: string;
  title: string;
  pdfUrl: string;
  reportDate?: string | null;
}): Promise<MediaReportEntryRecord> {
  const supabase = assertAdminClient();
  const title = input.title.trim();
  if (!title) throw new Error('Rapor başlığı zorunludur.');
  if (!input.pdfUrl.trim()) throw new Error('PDF URL zorunludur.');
  const slug = await generateUniqueEntrySlug(supabase, input.subBrandId, title);
  const { data, error } = await supabase
    .from(ENTRIES_TABLE)
    .insert({
      sub_brand_id: input.subBrandId,
      title,
      slug,
      pdf_url: input.pdfUrl.trim(),
      report_date: input.reportDate || null,
      is_published: true,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as MediaReportEntryRecord;
}

export async function deleteMediaReportEntry(id: string): Promise<void> {
  const supabase = assertAdminClient();
  const { error } = await supabase.from(ENTRIES_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function getPublishedEntryById(entryId: string): Promise<MediaReportEntryRecord | null> {
  noStore();
  const supabase = assertAdminClient();
  const { data, error } = await supabase
    .from(ENTRIES_TABLE)
    .select('*')
    .eq('id', entryId)
    .eq('is_published', true)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as MediaReportEntryRecord | null;
}

/** Brand + sub-brand + entry slug üçlüsünden tek bir entry döner. */
export async function getPublishedEntryBySlug(
  brandSlug: string,
  subBrandSlug: string,
  entrySlug: string
): Promise<(MediaReportEntryRecord & { brand_name: string; brand_slug: string; sub_brand_name: string; sub_brand_slug: string; sub_brand_logo_url: string | null }) | null> {
  noStore();
  const supabase = assertAdminClient();
  const normBrand = normalizeSlugPart(brandSlug);
  const normSub = normalizeSlugPart(subBrandSlug);

  const { data: brandData, error: brandErr } = await supabase
    .from(BRANDS_TABLE).select('*').eq('is_published', true).eq('slug', normBrand).limit(1).maybeSingle();
  if (brandErr) throw brandErr;
  const brand = (brandData ?? null) as MediaReportBrandRecord | null;
  if (!brand) return null;

  const { data: subData, error: subErr } = await supabase
    .from(SUB_BRANDS_TABLE).select('*').eq('brand_id', brand.id).eq('is_published', true).eq('slug', normSub).limit(1).maybeSingle();
  if (subErr) throw subErr;
  const sub = (subData ?? null) as MediaReportSubBrandRecord | null;
  if (!sub) return null;

  const { data: entryData, error: entryErr } = await supabase
    .from(ENTRIES_TABLE).select('*').eq('sub_brand_id', sub.id).eq('is_published', true).eq('slug', entrySlug).limit(1).maybeSingle();
  if (entryErr) throw entryErr;
  const entry = (entryData ?? null) as MediaReportEntryRecord | null;
  if (!entry) return null;

  const subLogo = brand.uses_sub_brands === false ? sub.logo_url || brand.logo_url || null : sub.logo_url || null;
  return { ...entry, brand_name: brand.name, brand_slug: brand.slug, sub_brand_name: sub.name, sub_brand_slug: sub.slug, sub_brand_logo_url: subLogo };
}

/** Brand + sub-brand slug'ından alt markanın yayınlı entry listesini döner. */
export async function listPublishedEntriesBySlugs(
  brandSlug: string,
  subBrandSlug: string
): Promise<Array<MediaReportEntryRecord & { brand_name: string; brand_slug: string; sub_brand_name: string; sub_brand_slug: string; sub_brand_logo_url: string | null }>> {
  noStore();
  const supabase = assertAdminClient();
  const normBrand = normalizeSlugPart(brandSlug);
  const normSub = normalizeSlugPart(subBrandSlug);

  const { data: brandData, error: brandErr } = await supabase
    .from(BRANDS_TABLE)
    .select('*')
    .eq('is_published', true)
    .eq('slug', normBrand)
    .limit(1)
    .maybeSingle();
  if (brandErr) throw brandErr;
  const brand = (brandData ?? null) as MediaReportBrandRecord | null;
  if (!brand) return [];

  const { data: subData, error: subErr } = await supabase
    .from(SUB_BRANDS_TABLE)
    .select('*')
    .eq('brand_id', brand.id)
    .eq('is_published', true)
    .eq('slug', normSub)
    .limit(1)
    .maybeSingle();
  if (subErr) throw subErr;
  const sub = (subData ?? null) as MediaReportSubBrandRecord | null;
  if (!sub) return [];

  const entries = await listPublishedEntriesForSubBrand(sub.id);
  const subLogo = brand.uses_sub_brands === false ? sub.logo_url || brand.logo_url || null : sub.logo_url || null;
  return entries.map((e) => ({
    ...e,
    brand_name: brand.name,
    brand_slug: brand.slug,
    sub_brand_name: sub.name,
    sub_brand_slug: sub.slug,
    sub_brand_logo_url: subLogo,
  }));
}
