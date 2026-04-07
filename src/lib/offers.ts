import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { normalizeSlugPart, toDateSlug } from '@/lib/slug';
import { buildPublicProjectUrl } from '@/lib/project-url';
import { PROJECT_TYPE_PREFIX, type ProjectType } from '@/lib/project-type-from-slug';

export type { ProjectType } from '@/lib/project-type-from-slug';
export { inferProjectTypeFromBrandSlug } from '@/lib/project-type-from-slug';

export type OfferRecord = {
  id: string;
  crm_quote_id: string | number | null;
  brand_name: string;
  brand_slug: string;
  offer_date: string;
  date_slug: string;
  project_title: string;
  summary: string | null;
  sample_contents: string[] | null;
  photo_gallery: { url: string; caption?: string }[] | null;
  video_gallery: { url: string; title?: string; orientation?: 'horizontal' | 'vertical' }[] | null;
  notes: string | null;
  noindex: boolean;
  created_at: string;
  updated_at: string;
};

export type QuoteRecord = {
  id: string;
  [key: string]: any;
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

/** `notes` kolonu text; API bazen JSON string, nadir olarak obje gonderebilir. jsonb donen DB'lerde okuma obje olabilir. */
function normalizeNotesForDb(notes: unknown): string | null {
  if (notes == null) return null;
  if (typeof notes === 'string') {
    const t = notes.trim();
    return t.length ? t : null;
  }
  if (typeof notes === 'object') {
    try {
      const s = JSON.stringify(notes);
      return s.length ? s : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function buildOfferPath(brandName: string, offerDate: string, projectType?: ProjectType) {
  const baseBrandSlug = normalizeSlugPart(brandName);
  const brandSlug = projectType ? `${PROJECT_TYPE_PREFIX[projectType]}-${baseBrandSlug}` : baseBrandSlug;
  const dateSlug = toDateSlug(offerDate);
  return {
    brandSlug,
    dateSlug,
    path: `/proje/${brandSlug}/${dateSlug}`,
  };
}

export async function listOffers() {
  const supabase = assertAdminClient();

  const { data, error } = await supabase
    .from('crm_offer_pages')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as OfferRecord[];
}

/** cPanel statik export: build sirasinda /proje/[brand]/[date] sayfalarini uretmek icin. */
export async function listOfferPathParams(): Promise<{ brand: string; date: string }[]> {
  const rows = await listOffers();
  return rows.map((o) => ({ brand: o.brand_slug, date: o.date_slug }));
}

export async function listQuotes() {
  const supabase = assertAdminClient();

  const { data, error } = await supabase.from('crm_quotes').select('*').limit(500);
  if (error) throw error;
  return (data ?? []) as QuoteRecord[];
}

export async function createOffer(input: {
  brandName: string;
  offerDate: string;
  projectTitle: string;
  quoteId?: string | null;
  projectType?: ProjectType;
  summary?: string;
  sampleContents?: string[];
  photoGallery?: { url: string; caption?: string }[];
  videoGallery?: { url: string; title?: string; orientation?: 'horizontal' | 'vertical' }[];
  notes?: string;
  noindex?: boolean;
}) {
  const supabase = assertAdminClient();

  const { brandSlug, dateSlug } = buildOfferPath(input.brandName, input.offerDate, input.projectType);
  const publicProjectUrl = buildPublicProjectUrl(brandSlug, dateSlug);

  const payload = {
    crm_quote_id: input.quoteId?.trim() || null,
    brand_name: input.brandName.trim(),
    brand_slug: brandSlug,
    offer_date: input.offerDate,
    date_slug: dateSlug,
    project_title: input.projectTitle.trim(),
    summary: input.summary?.trim() || null,
    sample_contents: input.sampleContents?.filter(Boolean) ?? [],
    photo_gallery: input.photoGallery ?? [],
    video_gallery: input.videoGallery ?? [],
    notes: normalizeNotesForDb(input.notes),
    noindex: input.noindex === true,
  };

  const { data, error } = await supabase
    .from('crm_offer_pages')
    .insert(payload)
    .select('*')
    .single();
  if (error && /photo_gallery|video_gallery|crm_quote_id|quote_id/i.test(`${error.message ?? ''} ${error.details ?? ''}`)) {
    throw new Error(
      "Supabase schema cache guncel degil: 'photo_gallery' / 'video_gallery' / 'crm_quote_id' kolonu gorunmuyor. SQL migration + 'notify pgrst, ''reload schema'';' calistirin."
    );
  }
  if (error) throw error;

  if (input.quoteId) {
    const { error: quoteUpdateError } = await supabase
      .from('crm_quotes')
      .update({ dashboard_url: publicProjectUrl })
      .eq('id', input.quoteId);
    if (quoteUpdateError) {
      throw new Error(`Proje kaydedildi ancak crm_quotes.dashboard_url guncellenemedi: ${quoteUpdateError.message}`);
    }
  }

  return data as OfferRecord;
}

export async function updateOffer(
  id: string,
  input: {
    brandName: string;
    offerDate: string;
    projectTitle: string;
    quoteId?: string | null;
    projectType?: ProjectType;
    summary?: string;
    sampleContents?: string[];
    photoGallery?: { url: string; caption?: string }[];
    videoGallery?: { url: string; title?: string; orientation?: 'horizontal' | 'vertical' }[];
    notes?: string;
    noindex?: boolean;
  }
) {
  const supabase = assertAdminClient();

  const { brandSlug, dateSlug } = buildOfferPath(input.brandName, input.offerDate, input.projectType);
  const publicProjectUrl = buildPublicProjectUrl(brandSlug, dateSlug);

  const payload = {
    crm_quote_id: input.quoteId?.trim() || null,
    brand_name: input.brandName.trim(),
    brand_slug: brandSlug,
    offer_date: input.offerDate,
    date_slug: dateSlug,
    project_title: input.projectTitle.trim(),
    summary: input.summary?.trim() || null,
    sample_contents: input.sampleContents?.filter(Boolean) ?? [],
    photo_gallery: input.photoGallery ?? [],
    video_gallery: input.videoGallery ?? [],
    notes: normalizeNotesForDb(input.notes),
    noindex: input.noindex === true,
  };

  const { data, error } = await supabase
    .from('crm_offer_pages')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error && /photo_gallery|video_gallery|crm_quote_id|quote_id/i.test(`${error.message ?? ''} ${error.details ?? ''}`)) {
    throw new Error(
      "Supabase schema cache guncel degil: 'photo_gallery' / 'video_gallery' / 'crm_quote_id' kolonu gorunmuyor. SQL migration + 'notify pgrst, ''reload schema'';' calistirin."
    );
  }
  if (error) throw error;

  if (input.quoteId) {
    const { error: quoteUpdateError } = await supabase
      .from('crm_quotes')
      .update({ dashboard_url: publicProjectUrl })
      .eq('id', input.quoteId);
    if (quoteUpdateError) {
      throw new Error(`Proje guncellendi ancak crm_quotes.dashboard_url guncellenemedi: ${quoteUpdateError.message}`);
    }
  }

  return data as OfferRecord;
}

export async function deleteOffer(id: string) {
  const supabase = assertAdminClient();

  const { data: row, error: fetchErr } = await supabase
    .from('crm_offer_pages')
    .select('id, crm_quote_id, brand_slug, date_slug')
    .eq('id', id)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (!row) throw new Error('Proje bulunamadi.');

  const { error: delErr } = await supabase.from('crm_offer_pages').delete().eq('id', id);
  if (delErr) throw delErr;

  if (row.crm_quote_id != null && String(row.crm_quote_id).length > 0) {
    const { error: quoteErr } = await supabase
      .from('crm_quotes')
      .update({ dashboard_url: null })
      .eq('id', row.crm_quote_id);
    if (quoteErr) {
      console.error('deleteOffer: crm_quotes.dashboard_url temizlenemedi', quoteErr);
    }
  }

  return {
    brand_slug: row.brand_slug as string,
    date_slug: row.date_slug as string,
  };
}

export async function getOfferByPath(brandSlug: string, dateSlug: string) {
  if (process.env.STATIC_EXPORT !== '1') {
    noStore();
  }

  const supabase = assertAdminClient();

  const { data, error } = await supabase
    .from('crm_offer_pages')
    .select('*')
    .eq('brand_slug', brandSlug)
    .eq('date_slug', dateSlug)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as OfferRecord | null;
}

