-- crm_quotes.id Supabase tarafinda cogu projede bigint'tir (uuid degil).
-- Bu yuzden crm_offer_pages icinde teklif baglantisi bigint olmalidir.
-- Uygulama kodu: crm_quote_id alanina yazar.

create table if not exists public.crm_offer_pages (
  id uuid primary key default gen_random_uuid(),
  crm_quote_id bigint references public.crm_quotes(id) on delete set null,
  brand_name text not null,
  brand_slug text not null,
  offer_date date not null,
  date_slug text not null,
  project_title text not null,
  summary text,
  sample_contents text[] default '{}',
  photo_gallery jsonb not null default '[]'::jsonb,
  video_gallery jsonb not null default '[]'::jsonb,
  notes text,
  noindex boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_offer_pages_path_idx
  on public.crm_offer_pages (brand_slug, date_slug, updated_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_crm_offer_pages_updated_at on public.crm_offer_pages;
create trigger trg_crm_offer_pages_updated_at
before update on public.crm_offer_pages
for each row execute function public.set_updated_at();

alter table public.crm_offer_pages
  add column if not exists photo_gallery jsonb not null default '[]'::jsonb;

alter table public.crm_offer_pages
  add column if not exists video_gallery jsonb not null default '[]'::jsonb;

alter table public.crm_offer_pages
  add column if not exists crm_quote_id bigint references public.crm_quotes(id) on delete set null;

-- Eski dokumanda kalan quote_id (uuid) varsa FK hatasi verir; kaldir / tipi duzelt:
alter table public.crm_offer_pages drop constraint if exists crm_offer_pages_quote_id_fkey;
alter table public.crm_offer_pages drop column if exists quote_id;

-- Sponsorluk / galeri gorselleri icin Storage bucket (public okuma, service role yazma)
-- Admin panel /api/admin/upload-image -> bucket adi: project-gallery
insert into storage.buckets (id, name, public)
values ('project-gallery', 'project-gallery', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "project-gallery public read" on storage.objects;
create policy "project-gallery public read"
on storage.objects
for select
to public
using (bucket_id = 'project-gallery');

drop policy if exists "project-gallery service role write" on storage.objects;
create policy "project-gallery service role write"
on storage.objects
for all
to service_role
using (bucket_id = 'project-gallery')
with check (bucket_id = 'project-gallery');

-- PostgREST sema cache: Supabase SQL Editor sonunda gerekiyorsa:
-- notify pgrst, 'reload schema';

-- (Istege bagli) Eski admin.joinpr.com.tr dashboard_url kayitlarini proje hostuna cevirmek icin:
-- update public.crm_quotes
-- set dashboard_url = replace(dashboard_url, 'https://admin.joinpr.com.tr', 'https://proje.joinpr.com.tr')
-- where dashboard_url like 'https://admin.joinpr.com.tr%';
